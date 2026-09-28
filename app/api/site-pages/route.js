import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: custom, error } = await supabase.from("site_pages").select("id,slug,title,nav_label,show_in_nav,published,sort_order").eq("published", true).eq("show_in_nav", true).order("sort_order", { ascending:true }).order("title", { ascending:true });
    if (error) return NextResponse.json({ pages: [] });
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    let staff = false;
    if (userId) {
      const { data: row } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
      staff = !!row;
    }
    const fixedKeys = ["home","formations","abonnements","projets","about","services","sites","contact"];
    const { data: fixed } = await supabase.from("site_content").select("page_key,content").in("page_key", fixedKeys);
    const fixedMap = new Map((fixed || []).map(x => [x.page_key, x.content || {}]));
    const fixedLabels = {home:"Accueil",formations:"Formations",abonnements:"Abonnements",services:"Nos services",sites:"Nos sites",projets:"Nos projets",contact:"Nous contacter",about:"À propos"};
    const fixedRoutes = {home:"/",formations:"/formations",abonnements:"/abonnements",services:"/services",sites:"/sites",projets:"/projets",contact:"/contact",about:"/a-propos"};
    const fixedLinks = fixedKeys.filter(k => staff || fixedMap.get(k)?.published !== false).map(k => ({id:`fixed-${k}`,slug:k,title:fixedLabels[k],nav_label:fixedLabels[k],show_in_nav:true,published:fixedMap.get(k)?.published !== false,sort_order:-100+fixedKeys.indexOf(k),href:fixedRoutes[k]}));
    return NextResponse.json({ pages: [...fixedLinks, ...(custom || [])] });
  } catch { return NextResponse.json({ pages: [] }); }
}
