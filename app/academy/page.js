import Header from "../ui/Header";
import Footer from "../ui/Footer";
import AcademyPanel from "./AcademyPanel";
import { getCatalog } from "../../lib/nexora/catalog";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AcademyPage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if(!userId) redirect("/connexion");
  const [{data:enrollments,error},formations]=await Promise.all([
    supabase.from("academy_enrollments").select("id,user_id,formation_slug,formation_title,module_count,current_module,status,started_at,completed_at,updated_at").eq("user_id",userId).order("updated_at",{ascending:false}),
    getCatalog("formation")
  ]);
  if(error) console.error("Nexora Academy:",error.message);
  const assignedSlugs=new Set((enrollments||[]).map(x=>x.formation_slug));
  const assignedFormations=formations.filter(x=>assignedSlugs.has(x.slug));
  return <main><Header/><section className="pageHero academyHero"><span className="sectionTag">NEXORA ACADEMY</span><h1>Apprendre.<br/><span>Pratiquer. Progresser.</span></h1><p>Votre parcours est suivi par l'équipe Nexora. Retrouvez la formation activée, le module que vous travaillez actuellement et votre progression.</p></section><AcademyPanel formations={assignedFormations} enrollments={enrollments||[]}/><Footer/></main>;
}
