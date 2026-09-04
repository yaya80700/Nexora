import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Nexora V0.8.2
 *
 * The middleware only runs on the protected account area. This prevents a
 * Supabase configuration problem from taking down the entire public site.
 */
export async function middleware(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Never crash the whole application when Vercel env vars are missing.
  if (!supabaseUrl || !supabaseKey) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("error", "supabase_config");
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/connexion";
      url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    // Authentication/runtime errors must not become a Vercel
    // MIDDLEWARE_INVOCATION_FAILED page. Send the user to a usable screen.
    console.error("[Nexora middleware] Supabase error:", error);

    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("error", "supabase_runtime");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/compte", "/compte/:path*"],
};
