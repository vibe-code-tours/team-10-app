-- =============================================================================
-- Logistics Partners Management
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.logistics_partners (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,                    -- e.g. 'Ninja Van', 'Royal Express', 'K-MD Express'
  badge_color           TEXT DEFAULT '#0284c7',           -- Hex color code for badge background
  icon_type             TEXT DEFAULT 'emoji',             -- 'emoji', 'lucide_icon', 'image'
  icon_value            TEXT DEFAULT '🚚',                -- Icon emoji / Lucide icon name / image URL or base64
  tracking_url_template TEXT,                             -- e.g. 'https://ninjavan.co/track/{tracking_id}'
  description           TEXT,                             -- e.g. 'Myanmar Nationwide Door-to-Door Delivery'
  is_active             BOOLEAN NOT NULL DEFAULT true,
  sort_order            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial default 3 logistics partners with custom brand colors & icons
INSERT INTO public.logistics_partners (name, badge_color, icon_type, icon_value, description, is_active, sort_order)
VALUES 
  ('Ninja Van', '#dc2626', 'emoji', '🥷', 'Myanmar Nationwide Express Delivery', true, 1),
  ('Royal Express', '#1e3a8a', 'lucide_icon', 'Crown', 'Premium Express Courier & Cargo', true, 2),
  ('K-MD Express', '#059669', 'lucide_icon', 'Package', 'Fast & Reliable Regional Logistics', true, 3)
ON CONFLICT DO NOTHING;

ALTER TABLE public.logistics_partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active logistics partners (for buyer checkout & footer)
CREATE POLICY "Anyone can view active logistics partners"
  ON public.logistics_partners FOR SELECT
  USING (true);

-- Allow admins to manage (CRUD) all logistics partners
CREATE POLICY "Admins manage logistics partners"
  ON public.logistics_partners FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
