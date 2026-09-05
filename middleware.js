import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/** Nexora V0.9.1 — Supabase SSR protection for the private account area. */
export async function middleware(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

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
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
      const url = request.nextUrl.clone();
      url.pathname = "/connexion";
      url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
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
