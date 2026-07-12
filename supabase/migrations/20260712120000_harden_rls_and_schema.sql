-- =============================================================================
-- Security hardening migration
-- Addresses /security-auditor findings (code_review_records.md 2026-07-12):
--   * RLS treated any `authenticated` user as an admin (products/categories/orders)
--   * Users could self-escalate to role = 'admin' on their own profile row
--   * Orders/order_items were readable + updatable by every logged-in user (PII)
--   * payment_proofs table + orders.payment_status referenced by code but never
--     created (IDOR / broken update).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Server-authoritative admin check (SECURITY DEFINER bypasses RLS on users,
--    so policies can call it without recursion or leaking the users table).
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- 1. Products — writes restricted to admins (was: any authenticated user).
-- -----------------------------------------------------------------------------
drop policy if exists "Authenticated users can insert products" on public.products;
drop policy if exists "Authenticated users can update products" on public.products;
drop policy if exists "Authenticated users can delete products" on public.products;

create policy "Admins can insert products"
  on public.products for insert to authenticated
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. Categories — writes restricted to admins (was: any authenticated user).
-- -----------------------------------------------------------------------------
drop policy if exists "Authenticated users can insert categories" on public.categories;
drop policy if exists "Authenticated users can update categories" on public.categories;
drop policy if exists "Authenticated users can delete categories" on public.categories;

create policy "Admins can insert categories"
  on public.categories for insert to authenticated
  with check (public.is_admin());

create policy "Admins can update categories"
  on public.categories for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins can delete categories"
  on public.categories for delete to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. Users — lock the `role` column against privilege escalation.
--    RLS with-check can't reference OLD, so enforce via a BEFORE UPDATE trigger:
--    a non-admin's attempt to change their own role is silently coerced back,
--    leaving the rest of the profile update intact.
-- -----------------------------------------------------------------------------
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and not public.is_admin()
     and auth.role() <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists lock_user_role on public.users;
create trigger lock_user_role
  before update on public.users
  for each row execute procedure public.prevent_role_change();

-- -----------------------------------------------------------------------------
-- 4. Orders + order_items — the "Admin can ..." policies were `using (true)`,
--    exposing every customer's PII to any logged-in user and letting anyone
--    flip order status. Replace with owner-scoped reads + admin-only fulfilment.
-- -----------------------------------------------------------------------------

-- orders.payment_status is written by the payment-proof upload flow.
alter table public.orders add column if not exists payment_status text default 'unpaid' not null;

drop policy if exists "Admin can view all orders" on public.orders;
drop policy if exists "Admin can update orders" on public.orders;
drop policy if exists "Admin can view all order items" on public.order_items;

-- Reads: admins see all; owners see their own ("Users can view their own orders"
-- from the reviews migration remains for the owner case).
create policy "Admins can view all orders"
  on public.orders for select to authenticated
  using (public.is_admin());

-- Updates: owners may update their own order (needed to attach a payment proof),
-- admins may update any. Column-level rules are enforced by the trigger below.
create policy "Owners and admins can update orders"
  on public.orders for update to authenticated
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- order_items reads: item belongs to an order the caller owns, or caller is admin.
create policy "View own order items"
  on public.order_items for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- Restrict which columns a non-admin owner may change on their order: only the
-- payment fields. Everything status/price/PII related is admin-only.
create or replace function public.enforce_order_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() or auth.role() = 'service_role' then
    return new;
  end if;

  if new.status            is distinct from old.status
     or new.total_amount   is distinct from old.total_amount
     or new.customer_name  is distinct from old.customer_name
     or new.customer_phone is distinct from old.customer_phone
     or new.customer_address is distinct from old.customer_address
     or new.payment_method is distinct from old.payment_method
     or new.user_id        is distinct from old.user_id then
    raise exception 'Only admins can modify order fulfilment fields';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_order_updates on public.orders;
create trigger guard_order_updates
  before update on public.orders
  for each row execute procedure public.enforce_order_update_rules();

-- -----------------------------------------------------------------------------
-- 5. payment_proofs — referenced by src/actions/upload/action-upload.ts but
--    never created. Create it, ownership-scoped so a buyer can only attach a
--    proof to their own order (closes the IDOR).
-- -----------------------------------------------------------------------------
create table if not exists public.payment_proofs (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  file_url text not null,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payment_proofs enable row level security;

-- Insert: only for your own order, tagged with your own id.
create policy "Users can add proof to own order"
  on public.payment_proofs for insert to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.orders o
      where o.id = payment_proofs.order_id
        and o.user_id = auth.uid()
    )
  );

-- Read: your own proofs, or admin.
create policy "View own payment proofs"
  on public.payment_proofs for select to authenticated
  using (uploaded_by = auth.uid() or public.is_admin());
