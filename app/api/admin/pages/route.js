import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function admin() {
  const ctx = await getAdminContext();
  if (!ctx.userId) return { supabase:ctx.supabase, response:NextResponse.json({ error:"Non authentifié" }, { status:401 }) };
  if (!ctx.role || !can(ctx.role,"editor")) return { supabase:ctx.supabase, response:NextResponse.json({ error:"Permission insuffisante" }, { status:403 }) };
  return { supabase:ctx.supabase };
}

const reserved = new Set(["connexion","inscription","compte","profil","contact","formations","services","sites","demandes","mot-de-passe-oublie","reinitialiser-mot-de-passe","admin","auth","api"]);
function cleanSlug(value) { return String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80); }

export async function GET() {
  const { supabase, response } = await admin(); if (response) return response;
  const { data, error } = await supabase.from("site_pages").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data || [] });
}

export async function POST(request) {
  const { supabase, response } = await admin(); if (response) return response;
  const body = await request.json(); const slug = cleanSlug(body.slug || body.title);
  if (!slug) return NextResponse.json({ error: "Un slug est obligatoire." }, { status: 400 });
  if (reserved.has(slug)) return NextResponse.json({ error: "Cette adresse est réservée par Nexora." }, { status: 400 });
  const content = body.content && typeof body.content === "object" ? body.content : { heroEyebrow: "NEXORA", heroTitle: body.title || "Nouvelle page", heroAccent: "", heroText: "", heroImage: "", showHero: true, customBlocks: [] };
  const { data, error } = await supabase.from("site_pages").insert({ slug, title: String(body.title || "Nouvelle page").trim() || "Nouvelle page", nav_label: String(body.nav_label || body.title || "Nouvelle page").trim() || "Nouvelle page", seo_title: String(body.seo_title || body.title || "Nexora").trim(), seo_description: String(body.seo_description || "").trim(), show_in_nav: body.show_in_nav !== false, published: body.published !== false, sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 50, content }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ page: data });
}

export async function PATCH(request) {
  const { supabase, response } = await admin(); if (response) return response;
  const body = await request.json(); if (!body.id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  const updates = {};
  if (body.slug !== undefined) { const slug = cleanSlug(body.slug); if (!slug || reserved.has(slug)) return NextResponse.json({ error: "Slug invalide ou réservé." }, { status: 400 }); updates.slug = slug; }
  ["title","nav_label","seo_title","seo_description"].forEach(k => { if (body[k] !== undefined) updates[k] = String(body[k] ?? ""); });
  ["show_in_nav","published"].forEach(k => { if (body[k] !== undefined) updates[k] = Boolean(body[k]); });
  if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
  if (body.content !== undefined) updates.content = body.content;
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from("site_pages").update(updates).eq("id", body.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ page: data });
}

export async function DELETE(request) {
  const { supabase, response } = await admin(); if (response) return response;
  const body = await request.json(); if (!body.id) return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  const { error } = await supabase.from("site_pages").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
