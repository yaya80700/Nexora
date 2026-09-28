import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";
import { validateAttachments, uploadRequestAttachments } from "../../../../lib/nexora/attachments";
async function admin(){const ctx=await getAdminContext();if(!ctx.userId)return {response:NextResponse.json({error:"Non authentifié"},{status:401})};if(!ctx.role||!can(ctx.role,"requests",ctx.permissions))return {response:NextResponse.json({error:"Permission insuffisante"},{status:403})};return {supabase:ctx.supabase,userId:ctx.userId};}
export async function GET(){const {supabase,response}=await admin();if(response)return response;const {data:reqs,error}=await supabase.from("contact_requests").select("*").order("created_at",{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});const ids=(reqs||[]).map(x=>x.id);let messages=[];if(ids.length){const r=await supabase.from("request_messages").select("*").in("request_id",ids).order("created_at",{ascending:true});messages=r.data||[];}return NextResponse.json({requests:reqs||[],messages});}
export async function PATCH(request){const {supabase,response}=await admin();if(response)return response;const body=await request.json();if(!body.id)return NextResponse.json({error:"ID obligatoire"},{status:400});const patch={};if(body.status)patch.status=body.status;const {data,error}=await supabase.from("contact_requests").update(patch).eq("id",body.id).select().single();if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({request:data});}
export async function POST(request){
  try{
    const {supabase,userId,response}=await admin();if(response)return response;
    const form=await request.formData();const requestId=String(form.get("request_id")||"");const message=String(form.get("message")||"").trim();const files=form.getAll("attachments").filter((x)=>x && typeof x.size === "number" && x.size > 0);validateAttachments(files);
    if(!requestId||!message)return NextResponse.json({error:"Message obligatoire"},{status:400});
    const {data:targetRequest,error:requestError}=await supabase.from("contact_requests").select("id,user_id").eq("id",requestId).maybeSingle();
    if(requestError)return NextResponse.json({error:requestError.message},{status:400});
    if(!targetRequest)return NextResponse.json({error:"Demande introuvable"},{status:404});
    const {data,error}=await supabase.from("request_messages").insert({request_id:requestId,sender_id:userId,sender_role:"admin",message,attachments:[]}).select().single();if(error)return NextResponse.json({error:error.message},{status:400});
    let attachments=[];try{attachments=await uploadRequestAttachments(supabase,files,userId,requestId,data.id,targetRequest.user_id);}catch(uploadError){await supabase.from("request_messages").delete().eq("id",data.id);return NextResponse.json({error:uploadError.message||"Impossible d'envoyer les fichiers."},{status:400});}
    if(attachments.length){const {error:updateError}=await supabase.from("request_messages").update({attachments}).eq("id",data.id);if(updateError){await supabase.storage.from("nexora-attachments").remove(attachments.map((file)=>file.path));await supabase.from("request_messages").delete().eq("id",data.id);return NextResponse.json({error:updateError.message},{status:400});}}
    await supabase.from("contact_requests").update({status:"answered",updated_at:new Date().toISOString()}).eq("id",requestId);return NextResponse.json({message:{...data,attachments}});
  }catch(error){return NextResponse.json({error:error.message||"Requête invalide."},{status:400});}
}
