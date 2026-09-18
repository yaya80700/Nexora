import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function guard(){
  const ctx=await getAdminContext();
  if(!ctx.userId) return {...ctx,response:NextResponse.json({error:"Non authentifié"},{status:401})};
  if(!ctx.role||!can(ctx.role,"academy_manage",ctx.permissions)) return {...ctx,response:NextResponse.json({error:"Permission insuffisante"},{status:403})};
  return ctx;
}

export async function GET(){
  const ctx=await guard(); if(ctx.response)return ctx.response;
  const [users,formations,enrollments]=await Promise.all([
    ctx.supabase.from("profiles").select("user_id,email,full_name").order("full_name",{ascending:true}),
    ctx.supabase.from("catalog_items").select("id,slug,title,name,description,bullets,icon,active").eq("type","formation").order("sort_order",{ascending:true}),
    ctx.supabase.from("academy_enrollments").select("id,user_id,formation_slug,formation_title,module_count,current_module,status,started_at,completed_at,updated_at,assigned_by").order("updated_at",{ascending:false})
  ]);
  if(users.error)return NextResponse.json({error:users.error.message},{status:500});
  if(formations.error)return NextResponse.json({error:formations.error.message},{status:500});
  if(enrollments.error)return NextResponse.json({error:enrollments.error.message},{status:500});
  return NextResponse.json({users:users.data||[],formations:formations.data||[],enrollments:enrollments.data||[]});
}

export async function POST(request){
  const ctx=await guard(); if(ctx.response)return ctx.response;
  const body=await request.json();
  const userId=String(body.user_id||"").trim();
  const slug=String(body.formation_slug||"").trim();
  if(!userId||!slug)return NextResponse.json({error:"Utilisateur et formation obligatoires"},{status:400});
  const {data:formation,error:formationError}=await ctx.supabase.from("catalog_items").select("slug,title,name,bullets,active").eq("type","formation").eq("slug",slug).maybeSingle();
  if(formationError)return NextResponse.json({error:formationError.message},{status:500});
  if(!formation||formation.active===false)return NextResponse.json({error:"Formation introuvable ou inactive"},{status:404});
  const modules=Array.isArray(formation.bullets)?formation.bullets.filter(Boolean):[];
  if(!modules.length)return NextResponse.json({error:"Cette formation ne contient aucun module."},{status:400});
  const {data,error}=await ctx.supabase.from("academy_enrollments").upsert({
    user_id:userId,formation_slug:slug,formation_title:formation.title||formation.name||slug,module_count:modules.length,current_module:1,status:"active",started_at:new Date().toISOString(),completed_at:null,assigned_by:ctx.userId,updated_at:new Date().toISOString()
  },{onConflict:"user_id,formation_slug"}).select().single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({enrollment:data});
}

export async function PATCH(request){
  const ctx=await guard(); if(ctx.response)return ctx.response;
  const body=await request.json();
  const id=String(body.id||"").trim();
  if(!id)return NextResponse.json({error:"Inscription obligatoire"},{status:400});
  const {data:current,error:readError}=await ctx.supabase.from("academy_enrollments").select("*").eq("id",id).maybeSingle();
  if(readError)return NextResponse.json({error:readError.message},{status:500});
  if(!current)return NextResponse.json({error:"Formation utilisateur introuvable"},{status:404});
  if(current.status==="completed")return NextResponse.json({error:"Cette formation est déjà terminée."},{status:400});
  const total=Number(current.module_count)||1;
  const currentModule=Number(current.current_module)||1;
  const isLast=currentModule>=total;
  const next=isLast?total:currentModule+1;
  const {data,error}=await ctx.supabase.from("academy_enrollments").update({current_module:next,status:isLast?"completed":"active",completed_at:isLast?new Date().toISOString():null,updated_at:new Date().toISOString()}).eq("id",id).eq("current_module",currentModule).select().single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({enrollment:data});
}

export async function DELETE(request){
  const ctx=await guard(); if(ctx.response)return ctx.response;
  const body=await request.json();
  const id=String(body.id||"").trim();
  if(!id)return NextResponse.json({error:"Inscription obligatoire"},{status:400});
  const {error}=await ctx.supabase.from("academy_enrollments").delete().eq("id",id);
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ok:true});
}
