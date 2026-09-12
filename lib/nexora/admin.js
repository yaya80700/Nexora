import { createClient } from "../supabase/server";

const legacyPermissions={owner:["all"],admin:["users_read","users_manage","staff_manage","catalog","editor","requests","requests_manage","site_pages"],editor:["editor","catalog","site_pages"],support:["users_read","requests"]};

export async function getAdminContext(){
 const supabase=await createClient();
 const {data,error}=await supabase.auth.getClaims();
 const userId=data?.claims?.sub;
 if(error||!userId)return{supabase,userId:null,role:null,permissions:{}};
 const {data:staff}=await supabase.from("admin_users").select("user_id,role,permissions").eq("user_id",userId).maybeSingle();
 if(!staff)return{supabase,userId,role:null,permissions:{}};
 const {data:assignments}=await supabase.from("admin_user_roles").select("role:admin_roles(id,key,name,permissions)").eq("user_id",userId);
 const roleList=(assignments||[]).map(x=>x.role).filter(Boolean);
 const permissions={};
 if(roleList.length){
   for(const r of roleList){if(Array.isArray(r.permissions))for(const p of r.permissions){if(p==="all")permissions.all=true;else permissions[p]=true}}
 }else{
   const legacy=legacyPermissions[staff.role]||[];
   for(const p of legacy){if(p==="all")permissions.all=true;else permissions[p]=true}
 }
 return{supabase,userId,role:staff.role,permissions,roles:roleList};
}

export function can(role,permission,permissions={}){if(permissions?.all||permissions?.[permission])return true;return false}
