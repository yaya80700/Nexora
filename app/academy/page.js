import Header from "../ui/Header";
import Footer from "../ui/Footer";
import AcademyPanel from "./AcademyPanel";
import { getCatalog } from "../../lib/nexora/catalog";

export const dynamic = "force-dynamic";

export default async function AcademyPage(){
  const formations = await getCatalog("formation");
  return <main><Header/><section className="pageHero academyHero"><span className="sectionTag">NEXORA ACADEMY</span><h1>Apprendre.<br/><span>Pratiquer. Progresser.</span></h1><p>Retrouvez vos parcours de formation, suivez votre progression et avancez à votre rythme.</p></section><AcademyPanel formations={formations}/><Footer/></main>;
}
