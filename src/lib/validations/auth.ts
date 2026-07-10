import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("မှန်ကန်သော email ထည့်ပါ"),
  password: z.string().min(6, "စကားဝှက် အနည်းဆုံး ၆ လုံးထည့်ပါ"),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "အမည်ကို အနည်းဆုံး ၂ လုံးထည့်ပါ"),
    email: z.string().email("မှန်ကန်သော email ထည့်ပါ"),
    password: z
      .string()
      .min(6, "စကားဝှက် အနည်းဆုံး ၆ လုံးထည့်ပါ")
      .max(72, "စကားဝှက် ၇၂ လုံးထက်မပိုရပါ"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "စကားဝှက်နှစ်ခု မတူညီပါ",
    path: ["confirm_password"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
