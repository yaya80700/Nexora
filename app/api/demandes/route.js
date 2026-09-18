import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { uploadRequestAttachments, validateAttachments } from "../../../lib/nexora/attachments";

export async function GET(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Non authentifié"},{status:401});const {data:requests,error}=await supabase.from("contact_requests").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});const ids=(requests||[]).map(r=>r.id);let messages=[];if(ids.length){const r=await supabase.from("request_messages").select("*").in("request_id",ids).order("created_at",{ascending:true});messages=r.data||[];}return NextResponse.json({requests:requests||[],messages});}

export async function POST(request){
  try {
    const supabase=await createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return NextResponse.json({error:"Non authentifié"},{status:401});
    const form=await request.formData();
    const requestId=String(form.get("request_id")||"");
    const message=String(form.get("message")||"").trim();
    const files=form.getAll("attachments").filter((x)=>x && typeof x.size === "number" && x.size > 0);
    validateAttachments(files);
    if(!requestId||!message)return NextResponse.json({error:"Message obligatoire"},{status:400});
    const {data:owned}=await supabase.from("contact_requests").select("id").eq("id",requestId).eq("user_id",user.id).maybeSingle();
    if(!owned)return NextResponse.json({error:"Demande introuvable"},{status:404});
    const {data,error}=await supabase.from("request_messages").insert({request_id:requestId,sender_id:user.id,sender_role:"user",message,attachments:[]}).select().single();
    if(error)return NextResponse.json({error:error.message},{status:400});
    let attachments=[];
    try { attachments=await uploadRequestAttachments(supabase,files,user.id,requestId,data.id); }
    catch(uploadError){ await supabase.from("request_messages").delete().eq("id",data.id).eq("sender_id",user.id); return NextResponse.json({error:uploadError.message||"Impossible d'envoyer les fichiers."},{status:400}); }
    if(attachments.length){const {error:updateError}=await supabase.from("request_messages").update({attachments}).eq("id",data.id).eq("sender_id",user.id);if(updateError)return NextResponse.json({error:updateError.message},{status:400});}
    await supabase.from("contact_requests").update({status:"in_progress",updated_at:new Date().toISOString()}).eq("id",requestId).eq("user_id",user.id);
    return NextResponse.json({message:{...data,attachments}});
  } catch(error){return NextResponse.json({error:error.message||"Requête invalide."},{status:400});}
}
