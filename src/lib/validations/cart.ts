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
  z
    .object({
      product_id: z.string().uuid().optional(),
      id: z.string().uuid().optional(),
      quantity: z.number().int().min(1).max(99),
      title: z.string().optional(),
      name: z.string().optional(),
      price: z.number().optional(),
      image_url: z.string().optional(),
      stock: z.number().optional(),
    })
    .transform((item) => ({
      product_id: item.product_id || item.id || "",
      quantity: item.quantity,
      title: item.title || item.name || "",
    }))
    .refine((item) => item.product_id.length > 0, {
      message: "Invalid product_id",
    }),
);

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type GuestCartInput = z.infer<typeof guestCartSchema>;
