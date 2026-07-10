create table public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  total_amount numeric not null,
  payment_method text not null,
  payment_receipt_url text,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Admin can see everything
create policy "Admin can view all orders" on public.orders for select to authenticated using (true);
create policy "Admin can view all order items" on public.order_items for select to authenticated using (true);

-- Admin can update orders
create policy "Admin can update orders" on public.orders for update to authenticated using (true);

-- Anyone can insert an order (Guest Checkout)
create policy "Anyone can insert orders" on public.orders for insert to public with check (true);
create policy "Anyone can insert order items" on public.order_items for insert to public with check (true);

-- Anyone can insert orders (Authenticated Checkout)
create policy "Authenticated can insert orders" on public.orders for insert to authenticated with check (true);
create policy "Authenticated can insert order items" on public.order_items for insert to authenticated with check (true);
