import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
export async function GET(){
  const supabase=await createClient();
  const [{data:settings},{data:methods}]=await Promise.all([
    supabase.from("store_settings").select("enabled").eq("id",1).maybeSingle(),
    supabase.from("payment_methods").select("id,name,description,icon,mode,instructions,payment_url,sort_order").eq("active",true).order("sort_order").order("created_at")
  ]);
  return NextResponse.json({enabled:settings?.enabled!==false,methods:methods||[]});
}
