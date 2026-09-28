import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Vous devez être connecté."},{status:401});
  const body=await request.json().catch(()=>({}));
  const items=(Array.isArray(body.items)?body.items:[]).map(x=>({type:String(x.type||""),slug:String(x.slug||""),quantity:Math.max(1,Math.min(99,Number(x.quantity)||1))}))
    .filter(x=>(x.type==="formation"||x.type==="service")&&x.slug).slice(0,50);
  if(!items.length) return NextResponse.json({error:"Votre panier est vide."},{status:400});
  const {data:settings}=await supabase.from("store_settings").select("enabled").eq("id",1).maybeSingle();
  if(settings?.enabled===false) return NextResponse.json({error:"Le panier est actuellement désactivé."},{status:403});
  const {data:method}=await supabase.from("payment_methods").select("id,name,mode,payment_url,instructions").eq("id",body.payment_method_id).eq("active",true).maybeSingle();
  if(!method) return NextResponse.json({error:"Moyen de paiement indisponible."},{status:400});
  const types=[...new Set(items.map(x=>x.type))];
  const {data:catalog,error:catError}=await supabase.from("catalog_items").select("type,slug,title,name,price,price_label,active").in("type",types).eq("active",true);
  if(catError) return NextResponse.json({error:catError.message},{status:500});
  const priced=items.map(x=>{const p=(catalog||[]).find(y=>y.type===x.type&&y.slug===x.slug);return p?{...x,title:p.title||p.name||p.slug,unit_price:p.price==null?null:Number(p.price)}:null;});
  if(priced.some(x=>!x)) return NextResponse.json({error:"Un article du panier n'est plus disponible."},{status:400});
  if(priced.some(x=>x.unit_price==null)) return NextResponse.json({error:"Un article du panier n'a pas de prix fixe et doit être traité sur devis."},{status:400});
  const total=priced.reduce((s,x)=>s+x.unit_price*x.quantity,0);
  const {data:order,error}=await supabase.from("orders").insert({user_id:user.id,payment_method_id:method.id,total,notes:body.notes?String(body.notes).slice(0,1000):null}).select().single();
  if(error) return NextResponse.json({error:error.message},{status:500});
  const {error:itemError}=await supabase.from("order_items").insert(priced.map(x=>({order_id:order.id,catalog_type:x.type,catalog_slug:x.slug,title:x.title,unit_price:x.unit_price,quantity:x.quantity})));
  if(itemError){await supabase.from("orders").delete().eq("id",order.id);return NextResponse.json({error:itemError.message},{status:500});}
  return NextResponse.json({orderId:order.id,total,paymentMethod:method});
}
