-- Add user_id to orders
alter table public.orders add column user_id uuid references auth.users(id) on delete set null;

-- Create reviews table
create table public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.product_reviews enable row level security;

-- Policies for product_reviews
create policy "Anyone can view reviews" on public.product_reviews for select to public using (true);

create policy "Authenticated users can insert reviews" on public.product_reviews for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own reviews" on public.product_reviews for update to authenticated using (auth.uid() = user_id);

create policy "Users can delete their own reviews" on public.product_reviews for delete to authenticated using (auth.uid() = user_id);

-- Update RLS policies for orders so users can only view their own
create policy "Users can view their own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
