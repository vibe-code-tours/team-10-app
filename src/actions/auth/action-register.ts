"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations";
import { headers } from "next/headers";

export type RegisterResult = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function registerWithEmail(
  formData: FormData,
): Promise<RegisterResult> {
  const raw = {
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "ဤအီးမေးလ်ဖြင့် အကောင့်ရှိပြီးသားဖြစ်ပါသည်" };
    }
    return { error: "အကောင့်ဖန်တီး၍မရပါ" };
  }

  return {
    success: true,
    message:
      "အကောင့်ဖန်တီးပြီးပါပြီ။ အီးမေးလ်ကိုစစ်ဆေးပြီး အတည်ပြုလင့်ခ်ကိုနှိပ်ပါ။",
  };
}
