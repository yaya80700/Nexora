import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";
import { defaultSiteContent } from "../../../../lib/nexora/siteContent";

async function admin(){
 const ctx=await getAdminContext();
 if(!ctx.userId) return {supabase:ctx.supabase,response:NextResponse.json({error:"Non authentifié"},{status:401})};
 if(!ctx.role || !can(ctx.role,"editor")) return {supabase:ctx.supabase,response:NextResponse.json({error:"Permission insuffisante"},{status:403})};
 return {supabase:ctx.supabase,response:null};
}
export async function GET(){const {supabase,response}=await admin();if(response)return response;const {data,error}=await supabase.from("site_content").select("page_key,content,updated_at").order("page_key");if(error)return NextResponse.json({error:error.message},{status:500});const found=new Map((data||[]).map(x=>[x.page_key,x]));
 const pages=Object.entries(defaultSiteContent).map(([page_key,base])=>({page_key,content:{...base,...(found.get(page_key)?.content||{})},updated_at:found.get(page_key)?.updated_at||null}));
 return NextResponse.json({pages});}
export async function PUT(request){const {supabase,response}=await admin();if(response)return response;const body=await request.json();if(!body.page_key||!body.content)return NextResponse.json({error:"page_key et content obligatoires"},{status:400});const {data,error}=await supabase.from("site_content").upsert({page_key:body.page_key,content:body.content,updated_at:new Date().toISOString()},{onConflict:"page_key"}).select().single();if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({page:data});}
