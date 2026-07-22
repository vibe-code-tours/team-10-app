-- Add shop_slug column to public.users table and populate initial seller slugs
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS shop_slug TEXT UNIQUE;

UPDATE public.users SET shop_slug = 'lin-beauty-shop' WHERE (shop_name ILIKE '%lin%' OR full_name ILIKE '%lin%') AND role = 'seller';
UPDATE public.users SET shop_slug = 'kyaw-mobile-shop' WHERE (shop_name ILIKE '%kyaw%' OR full_name ILIKE '%kyaw%') AND role = 'seller';
UPDATE public.users SET shop_slug = 'myat-cloth-shop' WHERE (shop_name ILIKE '%myat%' OR full_name ILIKE '%myat%') AND role = 'seller';
UPDATE public.users SET shop_slug = 'aung-computer-shop' WHERE (shop_name ILIKE '%aung%' OR full_name ILIKE '%aung%') AND role = 'seller';
UPDATE public.users SET shop_slug = 'yoe-yar-traditional' WHERE (shop_name ILIKE '%yoeyar%' OR shop_name ILIKE '%yoe yar%') AND role = 'seller';
