import { z } from "zod";

export const cartItemSchema = z.object({
  product_id: z.string().uuid("ပစ္စည်း ID မမှန်ကန်ပါ"),
  quantity: z
    .number()
    .int()
    .min(1, "အရေအတွက် အနည်းဆုံး ၁ ခုထည့်ပါ")
    .max(99, "အရေအတွက် ၉၉ ခုထက်မပိုရပါ"),
});

export const updateCartSchema = z.object({
  cart_item_id: z.string().uuid("ခြင်းတောင်း ID မမှန်ကန်ပါ"),
  quantity: z
    .number()
    .int()
    .min(1, "အရေအတွက် အနည်းဆုံး ၁ ခုထည့်ပါ")
    .max(99, "အရေအတွက် ၉၉ ခုထက်မပိုရပါ"),
});

export const guestCartSchema = z.array(
  z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().min(1).max(99),
  }),
);

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type GuestCartInput = z.infer<typeof guestCartSchema>;
