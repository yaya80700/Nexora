import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return NextResponse.json({ subscription: null }, { status: 401 });

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("subscription_id,subscription_slug,subscription_name,assigned_at,starts_at,expires_at,status,renewed_at,renewal_count")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscription: data || null });
}
