"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

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

  const ip = await getClientIp();
  if (isRateLimited(`register:${ip}`, 5, 300_000)) {
    // 5 per 5 minutes
    return {
      error: "Too many sign-up attempts. Please try again later.",
    };
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
      return { error: "An account with this email already exists" };
    }
    return { error: "Could not create account" };
  }

  return {
    success: true,
    message:
      "Account created. Please check your email and click the verification link.",
  };
}
