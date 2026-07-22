-- =============================================================================
-- Commission Settings & Seller Payouts
-- =============================================================================

-- Commission settings (global default + per-category overrides)
create table if not exists public.commission_settings (
  id          uuid primary key default gen_random_uuid(),
  category    text unique,          -- NULL = global default
  rate        numeric(5,2) not null check (rate >= 0 and rate <= 100),
  updated_by  uuid references public.users(id),
  updated_at  timestamptz not null default now()
);

-- Seed global default 5%
insert into public.commission_settings (category, rate)
values (null, 5.00)
on conflict (category) do nothing;

alter table public.commission_settings enable row level security;

create policy "Admins manage commission settings"
  on public.commission_settings for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Sellers can read commission settings"
  on public.commission_settings for select to authenticated
  using (public.is_seller() or public.is_admin());

-- Seller payouts
create table if not exists public.seller_payouts (
  id                  uuid primary key default gen_random_uuid(),
  seller_id           uuid not null references public.users(id) on delete cascade,
  amount              numeric(12,2) not null,
  commission_deducted numeric(12,2) not null,
  net_amount          numeric(12,2) not null,
  period_start        date not null,
  period_end          date not null,
  status              text not null default 'pending'
                      check (status in ('pending', 'paid')),
  paid_at             timestamptz,
  note                text,
  created_at          timestamptz not null default now()
);

alter table public.seller_payouts enable row level security;

create policy "Admins manage payouts"
  on public.seller_payouts for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Sellers view own payouts"
  on public.seller_payouts for select to authenticated
  using (public.is_seller() and seller_id = auth.uid());
