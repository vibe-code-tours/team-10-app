-- Step 1: Reassign products from old (@yoeyarzaw.com) to correct (@yoeyarzay.com) sellers
UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'lin@yoeyarzay.com' LIMIT 1)
WHERE seller_id = (SELECT id FROM auth.users WHERE email = 'lin@yoeyarzaw.com' LIMIT 1);

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'kyaw@yoeyarzay.com' LIMIT 1)
WHERE seller_id = (SELECT id FROM auth.users WHERE email = 'kyaw@yoeyarzaw.com' LIMIT 1);

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'myat@yoeyarzay.com' LIMIT 1)
WHERE seller_id = (SELECT id FROM auth.users WHERE email = 'myat@yoeyarzaw.com' LIMIT 1);

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'aung@yoeyarzay.com' LIMIT 1)
WHERE seller_id = (SELECT id FROM auth.users WHERE email = 'aung@yoeyarzaw.com' LIMIT 1);

UPDATE public.products
SET seller_id = (SELECT id FROM auth.users WHERE email = 'yoeyar@yoeyarzay.com' LIMIT 1)
WHERE seller_id = (SELECT id FROM auth.users WHERE email = 'yoeyar@yoeyarzaw.com' LIMIT 1);

-- Step 2: Delete old typo domain sellers
-- First remove from public.users
DELETE FROM public.users
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN (
    'lin@yoeyarzaw.com',
    'kyaw@yoeyarzaw.com',
    'myat@yoeyarzaw.com',
    'aung@yoeyarzaw.com',
    'yoeyar@yoeyarzaw.com'
  )
);

-- Then remove from auth.identities
DELETE FROM auth.identities
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email IN (
    'lin@yoeyarzaw.com',
    'kyaw@yoeyarzaw.com',
    'myat@yoeyarzaw.com',
    'aung@yoeyarzaw.com',
    'yoeyar@yoeyarzaw.com'
  )
);

-- Finally remove from auth.users
DELETE FROM auth.users
WHERE email IN (
  'lin@yoeyarzaw.com',
  'kyaw@yoeyarzaw.com',
  'myat@yoeyarzaw.com',
  'aung@yoeyarzaw.com',
  'yoeyar@yoeyarzaw.com'
);
