import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { uploadRequestAttachments, validateAttachments } from "../../../lib/nexora/attachments";
import { text } from "../../../lib/nexora/security";

export async function POST(request){
  try {
    const form = await request.formData();
    const body = Object.fromEntries(["name","email","request_type","budget","project_type","deadline","urgency","subject","message"].map((key)=>[key, form.get(key)]));
    const files = form.getAll("attachments").filter((x)=>x && typeof x.size === "number" && x.size > 0);
    validateAttachments(files);
    if(!body?.name || !body?.email || !body?.subject || !body?.message) return NextResponse.json({ok:false,error:"Champs requis manquants."},{status:400});
    const supabase=await createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return NextResponse.json({ok:false,error:"Connectez-vous à votre compte Nexora pour envoyer et suivre une demande."},{status:401});
    const name = text(body.name, 100);
    const email = text(body.email, 254);
    const subject = text(body.subject, 200);
    const baseMessage = text(body.message, 10000);
    if (!name || !email || !subject || !baseMessage) return NextResponse.json({ok:false,error:"Les champs obligatoires sont invalides."},{status:400});
    const details=[
      body.project_type?`Type de projet : ${String(body.project_type).trim()}`:null,
      body.deadline?`Délai souhaité : ${String(body.deadline).trim()}`:null,
      body.urgency?`Urgence : ${String(body.urgency).trim()}`:null,
    ].filter(Boolean);
    const finalMessage=details.length?`${details.join("\n")}\n\n${baseMessage}`:baseMessage;
    const {data,error}=await supabase.from("contact_requests").insert({user_id:user.id,name,email,request_type:text(body.request_type, 80, "Projet"),budget:body.budget?text(body.budget, 120):null,subject,message:finalMessage,attachments:[]}).select().single();
    if(error) return NextResponse.json({ok:false,error:error.message},{status:400});
    let attachments=[];
    try { attachments = await uploadRequestAttachments(supabase, files, user.id, data.id); }
    catch (uploadError) { await supabase.from("contact_requests").delete().eq("id", data.id).eq("user_id", user.id); return NextResponse.json({ok:false,error:uploadError.message||"Impossible d'envoyer les fichiers."},{status:400}); }
    if(attachments.length){
      const {error:updateError}=await supabase.from("contact_requests").update({attachments}).eq("id",data.id).eq("user_id",user.id);
      if(updateError) return NextResponse.json({ok:false,error:updateError.message},{status:400});
    }
    return NextResponse.json({ok:true,request:{...data,attachments}});
  } catch (error) { return NextResponse.json({ok:false,error:error.message||"Requête invalide."},{status:400}); }
}
