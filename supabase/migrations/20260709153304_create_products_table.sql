create table public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  stock integer default 0 not null,
  category text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policies
create policy "Products are viewable by everyone"
on public.products for select
to public
using (true);

-- MVP: Allow authenticated users to insert/update/delete products
create policy "Authenticated users can insert products"
on public.products for insert
to authenticated
with check (true);

create policy "Authenticated users can update products"
on public.products for update
to authenticated
using (true);

create policy "Authenticated users can delete products"
on public.products for delete
to authenticated
using (true);

-- Function and trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_product_updated
  before update on public.products
  for each row execute procedure public.handle_updated_at();
