-- Add image_url column to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket category-images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Public Read Access for Category Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated Users Upload Category Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'category-images');
