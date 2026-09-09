import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/** Nexora V1.2 — Refreshes the Supabase session across the whole site and protects private areas. */
export async function middleware(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (request.nextUrl.pathname === "/admin/connexion") return NextResponse.next();

  const isProtected = request.nextUrl.pathname.startsWith("/compte") || request.nextUrl.pathname.startsWith("/profil");
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");

  if (!supabaseUrl || !supabaseKey) {
    if (!isProtected && !isAdmin) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? "/admin/connexion" : "/connexion";
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
      if (!isProtected && !isAdmin) return response;
      const url = request.nextUrl.clone();
      url.pathname = isAdmin ? "/admin/connexion" : "/connexion";
      url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (isAdmin) {
      const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.claims.sub).maybeSingle();
      if (!admin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/connexion";
        url.searchParams.set("error", "forbidden");
        return NextResponse.redirect(url);
      }
    }

    return response;
  } catch (error) {
    console.error("[Nexora middleware] Supabase error:", error);
    if (!isProtected && !isAdmin) return response;
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? "/admin/connexion" : "/connexion";
    url.searchParams.set("error", "supabase_runtime");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)"],
};
