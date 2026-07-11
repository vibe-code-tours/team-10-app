-- Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.categories enable row level security;

-- Policies
create policy "Categories are viewable by everyone"
on public.categories for select
to public
using (true);

create policy "Authenticated users can insert categories"
on public.categories for insert
to authenticated
with check (true);

create policy "Authenticated users can update categories"
on public.categories for update
to authenticated
using (true);

create policy "Authenticated users can delete categories"
on public.categories for delete
to authenticated
using (true);

-- Seed initial categories from products table to preserve existing data
insert into public.categories (name, slug)
select distinct category, category
from public.products
on conflict (slug) do nothing;
