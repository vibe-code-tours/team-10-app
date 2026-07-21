-- =============================================================================
-- Seller Applications Table
-- =============================================================================

create table if not exists public.seller_applications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  shop_name         text not null,
  owner_name        text not null,
  phone             text not null,
  nrc               text not null,
  business_license  text not null,
  address           text not null,
  status            text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  rejection_reason  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  -- one application per user at a time
  unique (user_id)
);

-- RLS
alter table public.seller_applications enable row level security;

-- User reads own application
create policy "Users can view own application"
  on public.seller_applications for select to authenticated
  using (auth.uid() = user_id);

-- User submits own application
create policy "Users can insert own application"
  on public.seller_applications for insert to authenticated
  with check (auth.uid() = user_id);

-- Only admin can update (approve/reject) via service role / SECURITY DEFINER
create policy "Admins can update applications"
  on public.seller_applications for update to authenticated
  using (public.is_admin());

-- Admin reads all applications
create policy "Admins can view all applications"
  on public.seller_applications for select to authenticated
  using (public.is_admin());

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_seller_applications_updated_at on public.seller_applications;
create trigger set_seller_applications_updated_at
  before update on public.seller_applications
  for each row execute function public.set_updated_at();