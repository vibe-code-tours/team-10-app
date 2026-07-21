-- =============================================================================
-- Multi-Vendor Marketplace Migration
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Server-authoritative seller check
-- -----------------------------------------------------------------------------
create or replace function public.is_seller()
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
      and role = 'seller'
  );
$$;

revoke all on function public.is_seller() from public;
grant execute on function public.is_seller() to authenticated;

-- -----------------------------------------------------------------------------
-- 2. Add seller_id to products
-- -----------------------------------------------------------------------------
alter table public.products add column if not exists seller_id uuid references public.users(id);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins and Sellers can insert products"
  on public.products for insert to authenticated
  with check (public.is_admin() or (public.is_seller() and seller_id = auth.uid()));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins and Sellers can update products"
  on public.products for update to authenticated
  using (public.is_admin() or (public.is_seller() and seller_id = auth.uid()))
  with check (public.is_admin() or (public.is_seller() and seller_id = auth.uid()));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins and Sellers can delete products"
  on public.products for delete to authenticated
  using (public.is_admin() or (public.is_seller() and seller_id = auth.uid()));

-- -----------------------------------------------------------------------------
-- 3. Add seller_id and fulfillment_status to order_items
-- -----------------------------------------------------------------------------
alter table public.order_items add column if not exists seller_id uuid references public.users(id);
alter table public.order_items add column if not exists fulfillment_status text default 'pending' not null;

-- Allow sellers to see the parent order if they have an item in it
drop policy if exists "Admins can view all orders" on public.orders;
create policy "View orders"
  on public.orders for select to authenticated
  using (
    public.is_admin()
    or auth.uid() = user_id
    or (public.is_seller() and exists (
      select 1 from public.order_items oi
      where oi.order_id = id and oi.seller_id = auth.uid()
    ))
  );

drop policy if exists "View own order items" on public.order_items;
create policy "View own order items and seller items"
  on public.order_items for select to authenticated
  using (
    public.is_admin()
    or (public.is_seller() and seller_id = auth.uid())
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "Sellers can update their own order items"
  on public.order_items for update to authenticated
  using (public.is_seller() and seller_id = auth.uid())
  with check (public.is_seller() and seller_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 4. Update create_order RPC to accept seller_id
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_order(
  p_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_total_amount numeric,
  p_payment_method text,
  p_payment_receipt_url text,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_qty int;
  v_price numeric;
  v_seller_id uuid;
  v_current_stock int;
BEGIN
  -- Insert the order
  INSERT INTO public.orders (
    user_id,
    customer_name,
    customer_phone,
    customer_address,
    total_amount,
    payment_method,
    payment_receipt_url
  )
  VALUES (
    p_user_id,
    p_customer_name,
    p_customer_phone,
    p_customer_address,
    p_total_amount,
    p_payment_method,
    p_payment_receipt_url
  )
  RETURNING id INTO v_order_id;

  -- Loop through items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::int;
    v_price := (v_item->>'price')::numeric;
    v_seller_id := (v_item->>'seller_id')::uuid;

    -- Lock the row and check stock
    SELECT stock INTO v_current_stock
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    IF v_current_stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for product %', v_product_id;
    END IF;

    -- Decrement stock
    UPDATE public.products
    SET stock = stock - v_qty
    WHERE id = v_product_id;

    -- Insert order item
    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      price,
      seller_id
    )
    VALUES (
      v_order_id,
      v_product_id,
      v_qty,
      v_price,
      v_seller_id
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;
