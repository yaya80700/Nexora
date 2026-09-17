import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function guard(){
  const ctx=await getAdminContext();
  if(!ctx.userId) return {ctx,response:NextResponse.json({error:"Non authentifié"},{status:401})};
  if(!ctx.role || !can(ctx.role,"catalog",ctx.permissions)) return {ctx,response:NextResponse.json({error:"Permission insuffisante"},{status:403})};
  return {ctx,response:null};
}

export async function GET(){
  const {ctx,response}=await guard(); if(response)return response;
  const {data,error}=await ctx.supabase.from("projects").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false});
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({items:data||[]});
}

export async function POST(request){
  const {ctx,response}=await guard(); if(response)return response;
  const b=await request.json();
  const payload={slug:String(b.slug||"").trim().toLowerCase(),title:String(b.title||"").trim(),category:b.category||null,description:b.description||"",status:b.status||"Projet actif",accent:b.accent||null,url:b.url||null,image_url:b.image_url||null,active:b.active!==false,sort_order:Number(b.sort_order||0),updated_at:new Date().toISOString()};
  if(!payload.slug||!payload.title)return NextResponse.json({error:"Slug et titre obligatoires"},{status:400});
  const {data,error}=await ctx.supabase.from("projects").insert(payload).select().single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({item:data});
}

export async function PATCH(request){
  const {ctx,response}=await guard(); if(response)return response;
  const b=await request.json(); if(!b.id)return NextResponse.json({error:"ID obligatoire"},{status:400});
  const allowed=["slug","title","category","description","status","accent","url","image_url","active","sort_order"];
  const payload=Object.fromEntries(Object.entries(b).filter(([k])=>allowed.includes(k)));
  if(payload.slug)payload.slug=String(payload.slug).trim().toLowerCase();
  if(payload.sort_order!=null)payload.sort_order=Number(payload.sort_order);
  payload.updated_at=new Date().toISOString();
  const {data,error}=await ctx.supabase.from("projects").update(payload).eq("id",b.id).select().single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({item:data});
}

export async function DELETE(request){
  const {ctx,response}=await guard(); if(response)return response;
  const b=await request.json(); if(!b.id)return NextResponse.json({error:"ID obligatoire"},{status:400});
  const {error}=await ctx.supabase.from("projects").delete().eq("id",b.id);
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ok:true});
}
