import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function guard(permission="staff") {
  const ctx = await getAdminContext();
  if (!ctx.userId) return { ...ctx, response: NextResponse.json({error:"Non authentifié"},{status:401}) };
  if (!ctx.role || !can(ctx.role, permission)) return { ...ctx, response: NextResponse.json({error:"Permission insuffisante"},{status:403}) };
  return ctx;
}

export async function GET(){
  const ctx=await guard("users_read");
  if(ctx.response)return ctx.response;
  const {data,error}=await ctx.supabase.rpc("nexora_get_staff");
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({staff:data||[]});
}

export async function POST(request){
  const ctx=await guard("staff");
  if(ctx.response)return ctx.response;
  const body=await request.json();
  if(!body.user_id)return NextResponse.json({error:"Utilisateur obligatoire"},{status:400});
  const role=["owner","admin","editor","support"].includes(body.role)?body.role:"support";
  const {data,error}=await ctx.supabase.rpc("nexora_upsert_staff",{
    target_user_id:body.user_id,
    target_role:role,
    target_permissions:body.permissions||{}
  });
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({staff:data});
}

export async function PATCH(request){
  const ctx=await guard("staff");
  if(ctx.response)return ctx.response;
  const body=await request.json();
  if(!body.user_id)return NextResponse.json({error:"Utilisateur obligatoire"},{status:400});
  const role=["owner","admin","editor","support"].includes(body.role)?body.role:null;
  const {data,error}=await ctx.supabase.rpc("nexora_update_staff",{
    target_user_id:body.user_id,
    target_role:role,
    target_permissions:body.permissions===undefined?null:body.permissions
  });
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({staff:data});
}

export async function DELETE(request){
  const ctx=await guard("staff");
  if(ctx.response)return ctx.response;
  const body=await request.json();
  if(!body.user_id)return NextResponse.json({error:"Utilisateur obligatoire"},{status:400});
  const {data,error}=await ctx.supabase.rpc("nexora_remove_staff",{target_user_id:body.user_id});
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ok:true,staff:data});
}
