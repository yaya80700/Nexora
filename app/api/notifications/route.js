import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

async function getUser() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) return { supabase, user: null };
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET(request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 30), 1), 100);
  const { data, error } = await supabase.from("notifications").select("id,type,title,message,href,read_at,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(limit);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const { count, error: countError } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).is("read_at", null);
  if (countError) return NextResponse.json({ ok: false, error: countError.message }, { status: 500 });
  return NextResponse.json({ ok: true, notifications: data || [], unread: count || 0 });
}

export async function PATCH(request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  let body = {};
  try { body = await request.json(); } catch {}
  if (body.all === true) {
    const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }
  if (!body.id) return NextResponse.json({ ok: false, error: "Notification manquante." }, { status: 400 });
  const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", body.id).eq("user_id", user.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
