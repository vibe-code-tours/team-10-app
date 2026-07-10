"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export type AuthResult = {
  error?: string;
  success?: boolean;
};

export async function loginWithEmail(formData: FormData): Promise<AuthResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return {
        error: "အီးမေးလ်အတည်ပြုချက် မပြုလုပ်ရသေးပါ။ အီးမေးလ်ကိုစစ်ဆေးပါ။",
      };
    }
    return { error: "အီးမေးလ် သို့မဟုတ် စကားဝှက်မှားနေပါသည်" };
  }

  const redirectTo = formData.get("redirect") as string;

  if (redirectTo) {
    redirect(redirectTo);
  }

  redirect("/");
}

export async function loginWithGoogle(): Promise<AuthResult> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: "Google ဖြင့်ဝင်ရောက်၍မရပါ" };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "တစ်စုံတစ်ရာမှားယွင်းနေပါသည်" };
}
