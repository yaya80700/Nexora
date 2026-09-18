import { NextResponse } from "next/server";
import { getAdminContext } from "../../../../lib/nexora/admin";

export async function GET(){
  const ctx=await getAdminContext();
  if(!ctx.userId)return NextResponse.json({error:"Non authentifié"},{status:401});
  if(!ctx.role)return NextResponse.json({error:"Accès administrateur requis"},{status:403});
  const {supabase}=ctx;
  const [users,requests,newRequests,inProgress,projects,services,formations,sites,subscriptions,recent]=await Promise.all([
    supabase.from("profiles").select("user_id",{count:"exact",head:true}),
    supabase.from("contact_requests").select("id",{count:"exact",head:true}),
    supabase.from("contact_requests").select("id",{count:"exact",head:true}).eq("status","new"),
    supabase.from("contact_requests").select("id",{count:"exact",head:true}).eq("status","in_progress"),
    supabase.from("projects").select("id",{count:"exact",head:true}).eq("active",true),
    supabase.from("catalog_items").select("id",{count:"exact",head:true}).eq("type","service").eq("active",true),
    supabase.from("catalog_items").select("id",{count:"exact",head:true}).eq("type","formation").eq("active",true),
    supabase.from("catalog_items").select("id",{count:"exact",head:true}).eq("type","site").eq("active",true),
    supabase.from("subscriptions").select("id",{count:"exact",head:true}).eq("active",true),
    supabase.from("contact_requests").select("id,name,email,subject,request_type,status,created_at,updated_at").order("created_at",{ascending:false}).limit(6)
  ]);
  const firstError=[users,requests,newRequests,inProgress,projects,services,formations,sites,subscriptions,recent].find(x=>x.error);
  if(firstError)return NextResponse.json({error:firstError.error.message},{status:500});
  return NextResponse.json({stats:{users:users.count||0,requests:requests.count||0,newRequests:newRequests.count||0,inProgress:inProgress.count||0,projects:projects.count||0,services:services.count||0,formations:formations.count||0,sites:sites.count||0,subscriptions:subscriptions.count||0},recentRequests:recent.data||[]});
}
