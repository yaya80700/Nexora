import { NextResponse } from "next/server";
export async function POST(request){
 try {
  const body=await request.json();
  if(!body?.name || !body?.email || !body?.message) return NextResponse.json({ok:false,error:"Champs requis manquants."},{status:400});
  return NextResponse.json({ok:true,message:"Demande reçue en mode démonstration."});
 } catch { return NextResponse.json({ok:false,error:"Requête invalide."},{status:400}); }
}
