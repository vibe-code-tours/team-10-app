-- Create auth users (skip if already exists)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud
)
SELECT
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  email, crypt('12345678', gen_salt('bf')), now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', full_name),
  false, 'authenticated', 'authenticated'
FROM (VALUES
  ('lin@yoeyarzay.com',   'Lin'),
  ('kyaw@yoeyarzay.com',  'Kyaw'),
  ('myat@yoeyarzay.com',  'Myat'),
  ('aung@yoeyarzay.com',  'Aung'),
  ('yoeyar@yoeyarzay.com','Yoe Yar')
) AS t(email, full_name)
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.email = t.email
);

-- Create identity records (required for email login)
INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data, created_at, updated_at, last_sign_in_at
)
SELECT
  gen_random_uuid(),
  u.id,
  u.email,
  'email',
  jsonb_build_object('sub', u.id, 'email', u.email),
  now(), now(), now()
FROM auth.users u
WHERE u.email IN (
  'lin@yoeyarzay.com','kyaw@yoeyarzay.com','myat@yoeyarzay.com',
  'aung@yoeyarzay.com','yoeyar@yoeyarzay.com'
)
AND NOT EXISTS (
  SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
);

-- Create public.users profiles (trigger may have already done this)
INSERT INTO public.users (id, full_name, role, shop_name, created_at, updated_at)
SELECT
  u.id,
  (u.raw_user_meta_data->>'full_name'),
  'seller',
  s.shop_name,
  now(), now()
FROM auth.users u
JOIN (VALUES
  ('lin@yoeyarzay.com',   'LIN - Beauty Shop'),
  ('kyaw@yoeyarzay.com',  'KYAW - Mobile Shop'),
  ('myat@yoeyarzay.com',  'Myat - Cloth Shop'),
  ('aung@yoeyarzay.com',  'Aung - Computer Shop'),
  ('yoeyar@yoeyarzay.com','Yoe Yar Traditional')
) AS s(email, shop_name) ON u.email = s.email
ON CONFLICT (id) DO UPDATE SET
  role = 'seller',
  shop_name = EXCLUDED.shop_name,
  full_name = EXCLUDED.full_name;

-- Assign seller roles and shop names (join via auth.users for email lookup)
UPDATE public.users SET role = 'seller', shop_name = 'LIN - Beauty Shop'
WHERE id = (SELECT id FROM auth.users WHERE email = 'lin@yoeyarzay.com' LIMIT 1);

UPDATE public.users SET role = 'seller', shop_name = 'KYAW - Mobile Shop'
WHERE id = (SELECT id FROM auth.users WHERE email = 'kyaw@yoeyarzay.com' LIMIT 1);

UPDATE public.users SET role = 'seller', shop_name = 'Myat - Cloth Shop'
WHERE id = (SELECT id FROM auth.users WHERE email = 'myat@yoeyarzay.com' LIMIT 1);

UPDATE public.users SET role = 'seller', shop_name = 'Aung - Computer Shop'
WHERE id = (SELECT id FROM auth.users WHERE email = 'aung@yoeyarzay.com' LIMIT 1);

UPDATE public.users SET role = 'seller', shop_name = 'Yoe Yar Traditional'
WHERE id = (SELECT id FROM auth.users WHERE email = 'yoeyar@yoeyarzay.com' LIMIT 1);

-- Assign products to sellers by category
UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'lin@yoeyarzay.com' LIMIT 1)
WHERE category = 'beauty' AND seller_id IS NULL;

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'kyaw@yoeyarzay.com' LIMIT 1)
WHERE category = 'mobile' AND seller_id IS NULL;

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'myat@yoeyarzay.com' LIMIT 1)
WHERE category IN ('cloth', 'clothing', 'fashion') AND seller_id IS NULL;

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'aung@yoeyarzay.com' LIMIT 1)
WHERE category = 'computer' AND seller_id IS NULL;

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'yoeyar@yoeyarzay.com' LIMIT 1)
WHERE seller_id IS NULL;

