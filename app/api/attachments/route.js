import { NextResponse } from "next/server";
import { getAdminContext } from "../../../lib/nexora/admin";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request){
  const path=new URL(request.url).searchParams.get("path")||"";
  if(!path.startsWith("requests/")||path.includes(".."))return NextResponse.json({error:"Fichier invalide"},{status:400});
  const parts=path.split("/");const ownerId=parts[1];
  const ctx=await getAdminContext();
  if(!ctx.userId)return NextResponse.json({error:"Non authentifié"},{status:401});
  if(ctx.userId!==ownerId && !ctx.role)return NextResponse.json({error:"Accès refusé"},{status:403});
  if(ctx.userId!==ownerId){const {role}=ctx;if(!role)return NextResponse.json({error:"Accès refusé"},{status:403});}
  const supabase=ctx.supabase||await createClient();
  const {data,error}=await supabase.storage.from("nexora-attachments").createSignedUrl(path,300);
  if(error)return NextResponse.json({error:"Fichier introuvable"},{status:404});
  return NextResponse.redirect(data.signedUrl);
}
