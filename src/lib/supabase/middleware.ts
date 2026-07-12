import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabaseResponse = response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Don't recreate NextResponse.next(), just use the passed response
          // to preserve next-intl headers and redirects
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set({ name, value, ...options }),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Strip locale from pathname for route matching
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|my)/, "") || "/";

  const protectedPaths = ["/checkout", "/account", "/seller", "/admin"];
  // Note: /admin/login is an auth path, not a protected path
  const isProtected =
    protectedPaths.some((path) => pathWithoutLocale.startsWith(path)) &&
    !pathWithoutLocale.startsWith("/admin/login");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    // Keep locale if present
    const localeMatch = pathname.match(/^\/(en|my)/);
    const locale = localeMatch ? localeMatch[0] : "";

    // Show 404 if trying to access admin, else redirect to /login
    if (pathWithoutLocale.startsWith("/admin")) {
      url.pathname = locale ? `${locale}/404` : `/404`;
      return NextResponse.rewrite(url);
    } else {
      url.pathname = `${locale}/login`;
      url.searchParams.set("redirect", pathWithoutLocale);
      return NextResponse.redirect(url);
    }
  }

  const authPaths = ["/login", "/register", "/admin/login"];
  const isAuthPage = authPaths.some((path) =>
    pathWithoutLocale.startsWith(path),
  );

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    const localeMatch = pathname.match(/^\/(en|my)/);
    const locale = localeMatch ? localeMatch[0] : "";

    if (pathWithoutLocale.startsWith("/admin/login")) {
      url.pathname = `${locale}/admin`;
    } else {
      url.pathname = locale || "/";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
