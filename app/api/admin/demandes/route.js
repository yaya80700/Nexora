import { NextResponse } from "next/server";
import { getAdminContext, can } from "../../../../lib/nexora/admin";

async function admin(){const ctx=await getAdminContext();if(!ctx.userId)return {response:NextResponse.json({error:"Non authentifié"},{status:401})};if(!ctx.role||!can(ctx.role,"requests"))return {response:NextResponse.json({error:"Permission insuffisante"},{status:403})};return {supabase:ctx.supabase,userId:ctx.userId};}
const validStatus=["new","in_progress","answered","closed"];

export async function GET(){
 const {supabase,response}=await admin();if(response)return response;
 const {data:reqs,error}=await supabase.from("contact_requests").select("*").order("created_at",{ascending:false});
 if(error)return NextResponse.json({error:error.message},{status:500});
 const ids=(reqs||[]).map(x=>x.id), assignedIds=[...new Set((reqs||[]).map(x=>x.assigned_to).filter(Boolean))];
 let messages=[],profiles=[],staff=[];
 if(ids.length){const r=await supabase.from("request_messages").select("*").in("request_id",ids).order("created_at",{ascending:true});messages=r.data||[];}
 if(assignedIds.length){const r=await supabase.from("profiles").select("user_id,email,full_name").in("user_id",assignedIds);profiles=r.data||[];}
 const s=await supabase.from("admin_users").select("user_id,role,permissions");
 if(s.data?.length){const ids=[...new Set(s.data.map(x=>x.user_id))];const p=await supabase.from("profiles").select("user_id,email,full_name").in("user_id",ids);const pm=Object.fromEntries((p.data||[]).map(x=>[x.user_id,x]));staff=s.data.map(x=>({...x,role_label:x.role,full_name:pm[x.user_id]?.full_name||pm[x.user_id]?.email||"Staff" ,email:pm[x.user_id]?.email||""}));}
 const pm=Object.fromEntries(profiles.map(x=>[x.user_id,x]));
 const requests=(reqs||[]).map(x=>({...x,assigned_profile:x.assigned_to?pm[x.assigned_to]||null:null}));
 return NextResponse.json({requests,messages,staff});
}

export async function PATCH(request){
 const {supabase,userId,response}=await admin();if(response)return response;
 const body=await request.json();if(!body.id)return NextResponse.json({error:"ID obligatoire"},{status:400});
 const {data:current}=await supabase.from("contact_requests").select("id,assigned_to,assigned_at").eq("id",body.id).maybeSingle();if(!current)return NextResponse.json({error:"Demande introuvable"},{status:404});
 const patch={updated_at:new Date().toISOString()};
 if(body.status!==undefined){if(!validStatus.includes(body.status))return NextResponse.json({error:"Statut invalide"},{status:400});patch.status=body.status;}
 if(body.assigned_to!==undefined){let target=body.assigned_to; if(target==="__me__")target=userId;if(target){const {data:targetStaff}=await supabase.from("admin_users").select("user_id").eq("user_id",target).maybeSingle();if(!targetStaff)return NextResponse.json({error:"Ce membre n'est pas staff."},{status:400});patch.assigned_to=target;patch.assigned_at=current.assigned_to===target&&current.assigned_at?current.assigned_at:new Date().toISOString();}else{patch.assigned_to=null;patch.assigned_at=null;}}
 if(patch.status==="in_progress"&&!current.assigned_to&&body.assigned_to===undefined){patch.assigned_to=userId;patch.assigned_at=new Date().toISOString();}
 const {data,error}=await supabase.from("contact_requests").update(patch).eq("id",body.id).select().single();
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json({request:data});
}

export async function POST(request){
 const {supabase,userId,response}=await admin();if(response)return response;const body=await request.json();if(!body.request_id||!body.message?.trim())return NextResponse.json({error:"Message obligatoire"},{status:400});
 const {data,error}=await supabase.from("request_messages").insert({request_id:body.request_id,sender_id:userId,sender_role:"admin",message:body.message.trim()}).select().single();if(error)return NextResponse.json({error:error.message},{status:400});
 await supabase.from("contact_requests").update({status:"answered",updated_at:new Date().toISOString(),assigned_to:userId,assigned_at:new Date().toISOString()}).eq("id",body.request_id);
 return NextResponse.json({message:data});
}
