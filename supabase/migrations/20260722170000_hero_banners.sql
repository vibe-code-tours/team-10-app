-- Create hero_banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_type TEXT NOT NULL DEFAULT 'main_slider', -- 'main_slider', 'side_top', 'side_bottom'
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  target_link TEXT DEFAULT '/en/categories',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read hero_banners"
  ON public.hero_banners
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated admin full access hero_banners"
  ON public.hero_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed Initial Default Banners
INSERT INTO public.hero_banners (banner_type, title, subtitle, badge, image_url, target_link, is_active, sort_order)
VALUES
  ('main_slider', 'မြန်မာ့ရိုးရာ လက်မှုနှင့် အထည်အလိပ် ပွဲတော်', 'Authentic Myanmar Artisanal Collection', 'Seasonal Offer', '/images/banners/handloom_craft.png', '/en/categories', true, 1),
  ('main_slider', 'သဘာဝ အလှကုန် နှင့် ယွန်းထည် ပစ္စည်းများ', 'Pure Natural Beauty & Lacquerware', 'Best Seller', '/images/banners/beauty_lacquerware.png', '/en/categories', true, 2),
  ('main_slider', 'ခေတ်မီ မြန်မာ့ရိုးရာ ဝတ်စုံများ', 'Modern Traditional Wear & Accessories', 'New Arrival', '/images/banners/traditional_wear.png', '/en/categories', true, 3),
  ('side_top', 'အထူးလျှော့စျေး ဘောက်ချာများ', 'Daily Coupon 30% OFF', '30% OFF', '/images/banners/special_vouchers.png', '/en/daily-discover', true, 1),
  ('side_bottom', 'တစ်နိုင်ငံလုံး အခမဲ့ ပို့ဆောင်ခြင်း', 'Free Shipping Nationwide', 'Free Shipping', '/images/banners/free_shipping.png', '/en/daily-discover', true, 2);
