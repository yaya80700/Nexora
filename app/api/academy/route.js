import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if(!userId) return NextResponse.json({error:"Non authentifié"},{status:401});
  const {data:enrollments,error}=await supabase.from("academy_enrollments").select("id,user_id,formation_slug,formation_title,module_count,current_module,status,started_at,completed_at,updated_at").eq("user_id",userId).order("updated_at",{ascending:false});
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({enrollments:enrollments||[]});
}
