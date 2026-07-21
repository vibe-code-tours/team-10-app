-- Add shop_name column to public.users table
ALTER TABLE public.users
ADD COLUMN shop_name TEXT;
