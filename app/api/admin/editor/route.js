import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";
import { defaultSiteContent } from "../../../../lib/nexora/siteContent";
import { safeHttpUrl, safePageKey } from "../../../../lib/nexora/security";

async function admin(){
 const ctx=await getAdminContext();
 if(!ctx.userId) return {supabase:ctx.supabase,response:NextResponse.json({error:"Non authentifié"},{status:401})};
 if(!ctx.role || !can(ctx.role,"editor",ctx.permissions)) return {supabase:ctx.supabase,response:NextResponse.json({error:"Permission insuffisante"},{status:403})};
 return {supabase:ctx.supabase,response:null};
}
export async function GET(){const {supabase,response}=await admin();if(response)return response;const {data,error}=await supabase.from("site_content").select("page_key,content,updated_at").order("page_key");if(error)return NextResponse.json({error:error.message},{status:500});const found=new Map((data||[]).map(x=>[x.page_key,x]));
 const pages=Object.entries(defaultSiteContent).map(([page_key,base])=>({page_key,content:{...base,...(found.get(page_key)?.content||{})},updated_at:found.get(page_key)?.updated_at||null}));
 return NextResponse.json({pages});}
export async function PUT(request){
 const {supabase,response}=await admin();
 if(response)return response;
 let body={};
 try{body=await request.json();}catch{return NextResponse.json({error:"Contenu JSON invalide"},{status:400});}
 const allowed=new Set(Object.keys(defaultSiteContent));
 const page_key=safePageKey(body.page_key,allowed);
 if(!page_key||!body.content||typeof body.content!=="object"||Array.isArray(body.content))return NextResponse.json({error:"page_key et content obligatoires"},{status:400});
 const content={...body.content};
 if(Object.prototype.hasOwnProperty.call(content,"supportUrl")){
   const url=safeHttpUrl(content.supportUrl);
   if(content.supportUrl && !url)return NextResponse.json({error:"Le lien de soutien doit être une URL http(s) valide."},{status:400});
   content.supportUrl=url;
 }
 const {data,error}=await supabase.from("site_content").upsert({page_key,content,updated_at:new Date().toISOString()},{onConflict:"page_key"}).select().single();
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json({page:data});
}
