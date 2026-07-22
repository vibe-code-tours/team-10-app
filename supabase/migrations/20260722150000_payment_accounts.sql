-- =============================================================================
-- Payment Accounts & Methods Management
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.payment_accounts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider       TEXT NOT NULL, -- 'KBZPay', 'WavePay', 'Visa', 'Mastercard', 'JCB', 'COD', etc.
  icon           TEXT DEFAULT '💳', -- Custom icon / emoji / SVG badge key
  account_name   TEXT NOT NULL, -- e.g. 'Yoe Yar Zay Main Account'
  account_number TEXT NOT NULL, -- e.g. '09123456789' or Card Merchant ID
  qr_code_url    TEXT,          -- Optional QR code image URL
  instructions   TEXT,          -- Payment notes or guidelines for buyer
  is_active      BOOLEAN NOT NULL DEFAULT true,
  sort_order     INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial default 6 payment methods with custom icons
INSERT INTO public.payment_accounts (provider, icon, account_name, account_number, instructions, is_active, sort_order)
VALUES 
  ('KBZPay', '📱', 'Yoe Yar Zay Shop', '09790123456', 'KBZPay မိုဘိုင်းလ်အကောင့်သို့ ငွေလွှဲပြီးလျှင် ဖြတ်ပိုင်း ပြသပေးပါ။', true, 1),
  ('WavePay', '🟡', 'Yoe Yar Zay Shop', '09790123456', 'WavePay မိုဘိုင်းလ်အကောင့်သို့ ငွေလွှဲပေးနိုင်ပါသည်။', true, 2),
  ('Visa', '💳', 'Yoe Yar Zay Merchant', '4123-4567-8901-2345', 'Visa Credit/Debit Card Direct Gateway Payment', true, 3),
  ('Mastercard', '💳', 'Yoe Yar Zay Merchant', '5412-3456-7890-1234', 'Mastercard Credit/Debit Card Gateway Payment', true, 4),
  ('JCB', '💳', 'Yoe Yar Zay Merchant', '3568-1234-5678-9012', 'JCB International Card Gateway Payment', true, 5),
  ('COD', '💵', 'Cash on Delivery', 'N/A (Hand Delivery)', 'ပစ္စည်းရောက်မှ အိမ်အရောက် ငွေချေစနစ် ဖြစ်ပါသည်။', true, 6)
ON CONFLICT DO NOTHING;

ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active payment accounts (for buyer checkout)
CREATE POLICY "Anyone can view active payment accounts"
  ON public.payment_accounts FOR SELECT
  USING (true);

-- Allow admins to manage (CRUD) all payment accounts
CREATE POLICY "Admins manage payment accounts"
  ON public.payment_accounts FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
