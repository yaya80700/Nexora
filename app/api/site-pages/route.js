import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_pages").select("id,slug,title,nav_label,show_in_nav,published,sort_order").eq("published", true).eq("show_in_nav", true).order("sort_order", { ascending:true }).order("title", { ascending:true });
    if (error) return NextResponse.json({ pages: [] });
    return NextResponse.json({ pages: data || [] });
  } catch { return NextResponse.json({ pages: [] }); }
}
