import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function GET(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({count:0});
  const {data:requests,error}=await supabase.from("contact_requests").select("id").eq("user_id",user.id);
  if(error || !requests?.length) return NextResponse.json({count:0});
  const ids=requests.map(r=>r.id);
  const {data:messages}=await supabase.from("request_messages").select("request_id,sender_role,created_at").in("request_id",ids).order("created_at",{ascending:false});
  const latest=new Map();
  for(const message of messages||[]) if(!latest.has(message.request_id)) latest.set(message.request_id,message);
  return NextResponse.json({count:[...latest.values()].filter(m=>m.sender_role==="admin").length});
}
