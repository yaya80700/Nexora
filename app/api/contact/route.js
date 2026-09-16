import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request){
  try {
    const body=await request.json();
    if(!body?.name || !body?.email || !body?.subject || !body?.message) return NextResponse.json({ok:false,error:"Champs requis manquants."},{status:400});
    const supabase=await createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return NextResponse.json({ok:false,error:"Connectez-vous à votre compte Nexora pour envoyer et suivre une demande."},{status:401});
    const baseMessage=String(body.message).trim();
    const details=[
      body.project_type?`Type de projet : ${String(body.project_type).trim()}`:null,
      body.deadline?`Délai souhaité : ${String(body.deadline).trim()}`:null,
      body.urgency?`Urgence : ${String(body.urgency).trim()}`:null,
    ].filter(Boolean);
    const finalMessage=details.length?`${details.join("\n")}\n\n${baseMessage}`:baseMessage;
    const {data,error}=await supabase.from("contact_requests").insert({user_id:user.id,name:String(body.name).trim(),email:String(body.email).trim(),request_type:String(body.request_type||"Projet"),budget:body.budget?String(body.budget):null,subject:String(body.subject).trim(),message:finalMessage}).select().single();
    if(error) return NextResponse.json({ok:false,error:error.message},{status:400});
    return NextResponse.json({ok:true,request:data});
  } catch { return NextResponse.json({ok:false,error:"Requête invalide."},{status:400}); }
}
