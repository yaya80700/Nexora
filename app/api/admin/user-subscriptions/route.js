import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function guard() {
  const ctx = await getAdminContext();
  if (!ctx.userId) return { response: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  if (!can(ctx.role, "users_manage", ctx.permissions)) {
    return { response: NextResponse.json({ error: "Permission insuffisante" }, { status: 403 }) };
  }
  return { supabase: ctx.supabase };
}

export async function GET() {
  const { supabase, response } = await guard();
  if (response) return response;
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("user_id,subscription_id,subscription_slug,subscription_name,assigned_at,assigned_by")
    .order("assigned_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data: subscriptions, error: subscriptionsError } = await supabase.from("subscriptions").select("id,slug,name,price,billing_period,active").order("sort_order").order("created_at");
  if (subscriptionsError) return NextResponse.json({ error: subscriptionsError.message }, { status: 500 });
  return NextResponse.json({ assignments: data || [], subscriptions: subscriptions || [] });
}

export async function POST(request) {
  const { supabase, response } = await guard();
  if (response) return response;
  const body = await request.json();
  const userId = String(body.user_id || "").trim();
  const subscriptionId = body.subscription_id == null || body.subscription_id === "" ? null : Number(body.subscription_id);
  if (!userId) return NextResponse.json({ error: "Utilisateur obligatoire" }, { status: 400 });

  if (subscriptionId === null) {
    const { error } = await supabase.from("user_subscriptions").delete().eq("user_id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, assignment: null });
  }

  if (!Number.isInteger(subscriptionId)) return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });

  const { data: plan, error: planError } = await supabase
    .from("subscriptions")
    .select("id,slug,name")
    .eq("id", subscriptionId)
    .maybeSingle();
  if (planError) return NextResponse.json({ error: planError.message }, { status: 400 });
  if (!plan) return NextResponse.json({ error: "Abonnement introuvable" }, { status: 404 });

  const { data: authData } = await supabase.auth.getUser();
  const { data: assignment, error } = await supabase
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      subscription_id: plan.id,
      subscription_slug: plan.slug,
      subscription_name: plan.name,
      assigned_at: new Date().toISOString(),
      assigned_by: authData?.user?.id || null,
    }, { onConflict: "user_id" })
    .select("user_id,subscription_id,subscription_slug,subscription_name,assigned_at,assigned_by")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, assignment });
}
