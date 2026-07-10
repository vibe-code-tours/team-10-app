-- Create public.users table to store profile details
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone_number text,
  address text,
  preferred_payment_method text default 'cod',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Users can only view and update their own profile
create policy "Users can view own profile" on public.users for select to authenticated using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update to authenticated using (auth.uid() = id);

-- Function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after a new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
