import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * OAuth callback handler.
 * Supabase redirects here after Google sign-in.
 * Exchanges the auth code for a session, then redirects to home or the stored redirect path.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth — check if user profile exists in public.users
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Upsert user into public.users table (handles Google merge by email)
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
          console.error("User upsert error:", upsertError);
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
  }

  // OAuth error — redirect to login with error message
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
