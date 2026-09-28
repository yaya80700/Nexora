import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function guard() {
  const ctx = await getAdminContext();
  if (!ctx.userId) return { response: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  if (!can(ctx.role, "users_manage", ctx.permissions)) return { response: NextResponse.json({ error: "Permission insuffisante" }, { status: 403 }) };
  return { supabase: ctx.supabase };
}

function statusOf(row) {
  if (!row) return "none";
  if (row.status === "expired") return "expired";
  if (row.expires_at && new Date(row.expires_at).getTime() <= Date.now()) return "expired";
  return row.status || "active";
}

export async function GET() {
  const { supabase, response } = await guard();
  if (response) return response;
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("user_id,subscription_id,subscription_slug,subscription_name,assigned_at,assigned_by,starts_at,expires_at,status,renewed_at,renewal_count")
    .order("assigned_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const assignments = (data || []).map(row => ({ ...row, status: statusOf(row) }));
  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from("subscriptions")
    .select("id,slug,name,price,billing_period,active")
    .order("sort_order").order("created_at");
  if (subscriptionsError) return NextResponse.json({ error: subscriptionsError.message }, { status: 500 });
  return NextResponse.json({ assignments, subscriptions: subscriptions || [] });
}

function dateFromDuration(days) {
  const n = Number(days);
  if (!Number.isInteger(n) || n < 1 || n > 3650) return null;
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export async function POST(request) {
  const { supabase, response } = await guard();
  if (response) return response;
  let body = {};
  try { body = await request.json(); } catch {}
  const userId = String(body.user_id || "").trim();
  const subscriptionId = body.subscription_id == null || body.subscription_id === "" ? null : Number(body.subscription_id);
  if (!userId) return NextResponse.json({ error: "Utilisateur obligatoire" }, { status: 400 });

  const { data: current } = await supabase.from("user_subscriptions").select("*").eq("user_id", userId).maybeSingle();

  if (subscriptionId === null) {
    if (current) {
      await supabase.from("user_subscription_history").insert({ user_id: userId, subscription_id: current.subscription_id, subscription_slug: current.subscription_slug, subscription_name: current.subscription_name, starts_at: current.starts_at || current.assigned_at, expires_at: current.expires_at, action: "removed" });
    }
    const { error } = await supabase.from("user_subscriptions").delete().eq("user_id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, assignment: null });
  }
  if (!Number.isInteger(subscriptionId)) return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });

  const { data: plan, error: planError } = await supabase.from("subscriptions").select("id,slug,name,billing_period").eq("id", subscriptionId).maybeSingle();
  if (planError) return NextResponse.json({ error: planError.message }, { status: 400 });
  if (!plan) return NextResponse.json({ error: "Abonnement introuvable" }, { status: 404 });

  const durationDays = body.duration_days == null || body.duration_days === "" ? null : Number(body.duration_days);
  const requestedExpiry = body.expires_at ? new Date(body.expires_at) : null;
  const expiresAt = requestedExpiry && !Number.isNaN(requestedExpiry.getTime()) ? requestedExpiry.toISOString() : dateFromDuration(durationDays);
  const renew = body.action === "renew";
  const startsAt = renew && current?.expires_at && new Date(current.expires_at).getTime() > Date.now() ? current.expires_at : new Date().toISOString();
  const renewalCount = renew ? Number(current?.renewal_count || 0) + 1 : Number(current?.renewal_count || 0);

  const { data: authData } = await supabase.auth.getUser();
  const payload = {
    user_id: userId,
    subscription_id: plan.id,
    subscription_slug: plan.slug,
    subscription_name: plan.name,
    assigned_at: current?.assigned_at || new Date().toISOString(),
    assigned_by: authData?.user?.id || null,
    starts_at: startsAt,
    expires_at: expiresAt,
    status: expiresAt && new Date(expiresAt).getTime() <= Date.now() ? "expired" : "active",
    renewed_at: renew ? new Date().toISOString() : current?.renewed_at || null,
    renewal_count: renewalCount,
  };

  if (current) {
    await supabase.from("user_subscription_history").insert({ user_id: userId, subscription_id: current.subscription_id, subscription_slug: current.subscription_slug, subscription_name: current.subscription_name, starts_at: current.starts_at || current.assigned_at, expires_at: current.expires_at, action: renew ? "renewed" : "changed" });
  }

  const { data: assignment, error } = await supabase.from("user_subscriptions").upsert(payload, { onConflict: "user_id" }).select("user_id,subscription_id,subscription_slug,subscription_name,assigned_at,assigned_by,starts_at,expires_at,status,renewed_at,renewal_count").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, assignment: { ...assignment, status: statusOf(assignment) } });
}

export async function PATCH(request) {
  let body = {};
  try { body = await request.json(); } catch {}
  return POST(new Request(request.url, { method: "POST", headers: request.headers, body: JSON.stringify({ ...body, action: "renew" }) }));
}
