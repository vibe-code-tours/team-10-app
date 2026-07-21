-- Add document URL columns to seller_applications table
ALTER TABLE public.seller_applications
ADD COLUMN IF NOT EXISTS nrc_document_url TEXT,
ADD COLUMN IF NOT EXISTS license_document_url TEXT;

-- Create storage bucket seller-documents if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller-documents', 'seller-documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Public Read Access for Seller Documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'seller-documents');

CREATE POLICY "Authenticated Users Upload Seller Documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'seller-documents');
