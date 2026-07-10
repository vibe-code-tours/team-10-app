import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "အညွှန်းထည့်ပါ").max(50),
  full_name: z.string().min(2, "အမည်ထည့်ပါ"),
  phone: z.string().min(5, "ဖုန်းနံပါတ်ထည့်ပါ").max(20),
  address_line1: z.string().min(5, "လိပ်စာထည့်ပါ"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "မြို့အမည်ထည့်ပါ"),
  state_region: z.string().min(1, "ပြည်နယ် သို့မဟုတ် တိုင်းအမည်ထည့်ပါ"),
  is_default: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  address_id: z.string().uuid("ပို့ဆောင်ရမည့်လိပ်စာကို ရွေးချယ်ပါ"),
  notes: z.string().max(500).optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
