import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function getAdminClient() {
  const ctx = await getAdminContext();
  if (!ctx.userId) return { supabase:null, response:NextResponse.json({error:"Non authentifié"},{status:401}) };
  if (!ctx.role || !can(ctx.role,"catalog")) return { supabase:null, response:NextResponse.json({error:"Permission insuffisante"},{status:403}) };
  return { supabase:ctx.supabase, response:null };
}

export async function GET() {
  const { supabase, response } = await getAdminClient();
  if (response) return response;
  const { data, error } = await supabase.from("catalog_items").select("*").order("type").order("sort_order");
  if (error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({items:data});
}

export async function POST(request) {
  const { supabase, response } = await getAdminClient();
  if (response) return response;
  const body = await request.json();
  const payload = {
    type: body.type,
    slug: body.slug,
    title: body.title || null,
    name: body.name || null,
    full_name: body.full_name || null,
    category: body.category || null,
    level: body.level || null,
    icon: body.icon || "✨",
    description: body.description || "",
    bullets: Array.isArray(body.bullets) ? body.bullets : [],
    price: body.price === "" || body.price == null ? null : Number(body.price),
    price_label: body.price_label || null,
    status: body.status || null,
    accent: body.accent || null,
    url: body.url || null,
    image_url: body.image_url || null,
    active: body.active !== false,
    sort_order: Number(body.sort_order || 0),
    updated_at: new Date().toISOString()
  };
  if (!payload.type || !payload.slug) return NextResponse.json({error:"Type et slug obligatoires"},{status:400});
  const { data, error } = await supabase.from("catalog_items").insert(payload).select().single();
  if (error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({item:data});
}

export async function PATCH(request) {
  const { supabase, response } = await getAdminClient();
  if (response) return response;
  const body = await request.json();
  if (!body.id) return NextResponse.json({error:"ID obligatoire"},{status:400});
  const allowed = ["type","slug","title","name","full_name","category","level","icon","description","bullets","price","price_label","status","accent","url","image_url","active","sort_order"];
  const payload = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  if (payload.price === "") payload.price = null;
  if (payload.price != null) payload.price = Number(payload.price);
  payload.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from("catalog_items").update(payload).eq("id",body.id).select().single();
  if (error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({item:data});
}

export async function DELETE(request) {
  const { supabase, response } = await getAdminClient();
  if (response) return response;
  const body = await request.json();
  if (!body.id) return NextResponse.json({error:"ID obligatoire"},{status:400});
  const { error } = await supabase.from("catalog_items").delete().eq("id",body.id);
  if (error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ok:true});
}
