import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";
async function admin(){const ctx=await getAdminContext();if(!ctx.userId)return {response:NextResponse.json({error:"Non authentifié"},{status:401})};if(!ctx.role||!can(ctx.role,"users_read"))return {response:NextResponse.json({error:"Permission insuffisante"},{status:403})};return {supabase:ctx.supabase};}
export async function GET(){const {supabase,response}=await admin();if(response)return response;const {data,error}=await supabase.from("profiles").select("user_id,email,full_name,provider,created_at,updated_at").order("created_at",{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({users:data||[]});}
