import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../lib/nexora/admin";

export async function GET(request){
  const path=new URL(request.url).searchParams.get("path")||"";
  if(!path.startsWith("requests/")||path.includes(".."))return NextResponse.json({error:"Fichier invalide"},{status:400});
  const parts=path.split("/");
  const ownerId=parts[1]||"";
  const requestId=parts[2]||"";
  if(!ownerId||!requestId||parts.length<4)return NextResponse.json({error:"Fichier invalide"},{status:400});
  const ctx=await getAdminContext();
  if(!ctx.userId)return NextResponse.json({error:"Non authentifié"},{status:401});
  const isOwner=ctx.userId===ownerId;
  const isStaff=Boolean(ctx.role) && can(ctx.role,"requests",ctx.permissions);
  if(!isOwner && !isStaff)return NextResponse.json({error:"Accès refusé"},{status:403});
  const {data:requestRow,error:requestError}=await ctx.supabase.from("contact_requests").select("id,user_id").eq("id",requestId).maybeSingle();
  if(requestError||!requestRow)return NextResponse.json({error:"Demande introuvable"},{status:404});
  if(requestRow.user_id!==ownerId)return NextResponse.json({error:"Fichier invalide"},{status:400});
  const {data,error}=await ctx.supabase.storage.from("nexora-attachments").createSignedUrl(path,300);
  if(error)return NextResponse.json({error:"Fichier introuvable"},{status:404});
  return NextResponse.redirect(data.signedUrl);
}
