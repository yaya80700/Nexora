import { createClient } from "../supabase/server";

export async function getAdminContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return { supabase, userId: null, role: null };
  const { data: staff } = await supabase.from("admin_users").select("user_id,role,permissions").eq("user_id", userId).maybeSingle();
  return { supabase, userId, role: staff?.role || null, permissions: staff?.permissions || {} };
}

export function can(role, permission) {
  if (role === "owner" || role === "admin") return true;
  if (role === "editor") return ["editor", "catalog"].includes(permission);
  if (role === "support") return ["users_read", "requests"].includes(permission);
  return false;
}
