import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function guard() {
  const ctx = await getAdminContext();
  if (!ctx.userId) return { supabase: null, response: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  if (!ctx.role || !can(ctx.role, "catalog", ctx.permissions)) {
    return { supabase: null, response: NextResponse.json({ error: "Permission insuffisante" }, { status: 403 }) };
  }
  return { supabase: ctx.supabase, response: null };
}

const clean = (body) => ({
  slug: String(body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""),
  name: String(body.name || "").trim(),
  description: String(body.description || "").trim(),
  price: body.price === "" || body.price == null ? null : Number(body.price),
  price_label: String(body.price_label || "").trim() || null,
  billing_period: String(body.billing_period || "mois").trim() || "mois",
  features: Array.isArray(body.features) ? body.features.map((x) => String(x).trim()).filter(Boolean) : [],
  highlighted: body.highlighted === true,
  active: body.active !== false,
  sort_order: Number(body.sort_order || 0),
  updated_at: new Date().toISOString(),
});

export async function GET() {
  const { supabase, response } = await guard();
  if (response) return response;
  const { data, error } = await supabase.from("subscriptions").select("*").order("sort_order").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

export async function POST(request) {
  const { supabase, response } = await guard();
  if (response) return response;
  const { count, error: countError } = await supabase.from("subscriptions").select("id", { count: "exact", head: true });
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });
  if ((count || 0) >= 2) return NextResponse.json({ error: "Nexora est limité à 2 abonnements. Supprimez ou modifiez une formule existante avant d'en créer une nouvelle." }, { status: 400 });
  const body = await request.json();
  const payload = clean(body);
  if (!payload.slug || !payload.name) return NextResponse.json({ error: "Nom et slug obligatoires" }, { status: 400 });
  const { data, error } = await supabase.from("subscriptions").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}

export async function PATCH(request) {
  const { supabase, response } = await guard();
  if (response) return response;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "ID obligatoire" }, { status: 400 });
  const payload = clean(body);
  if (!payload.slug || !payload.name) return NextResponse.json({ error: "Nom et slug obligatoires" }, { status: 400 });
  const { data, error } = await supabase.from("subscriptions").update(payload).eq("id", body.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}

export async function DELETE(request) {
  const { supabase, response } = await guard();
  if (response) return response;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "ID obligatoire" }, { status: 400 });
  const { error } = await supabase.from("subscriptions").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
