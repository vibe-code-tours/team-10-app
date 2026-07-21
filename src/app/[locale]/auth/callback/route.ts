import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Authentication callback handler (OAuth + Email Confirmation).
 * Supports both PKCE auth code exchange and token_hash OTP verification.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const errorParam =
    searchParams.get("error_code") || searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  // Check if Supabase sent an explicit error parameter (e.g. otp_expired)
  if (errorParam) {
    console.error("Auth callback error parameter received:", errorParam);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorParam)}`,
    );
  }

  const supabase = await createClient();

  // 1. Handle token_hash & type (Email Confirmation / Magic Link OTP)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return handleSuccessfulAuth(request, supabase, origin, next);
    } else {
      console.error("verifyOtp error:", error);
      return NextResponse.redirect(`${origin}/login?error=otp_expired`);
    }
  }

  // 2. Handle PKCE auth code exchange (OAuth / Email Link PKCE)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return handleSuccessfulAuth(request, supabase, origin, next);
    } else {
      console.error("exchangeCodeForSession error:", error);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
    }
  }

  // Generic failure redirect
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

async function handleSuccessfulAuth(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  origin: string,
  next: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Upsert user into public.users table
    const { error: upsertError } = await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email!,
        full_name:
          user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        email_verified: true,
      },
      { onConflict: "id" },
    );

    if (upsertError) {
      console.error("User profile upsert error:", upsertError);
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
