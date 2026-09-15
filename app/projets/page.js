import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, FolderKanban, Sparkles } from "lucide-react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { getProjects } from "../../lib/nexora/projects";
import { getSiteContent, isStaffUser } from "../../lib/nexora/siteContent";
import ContentBlocks from "../ui/ContentBlocks";

export default async function Projects(){
  const [projects,c]=await Promise.all([getProjects(),getSiteContent("projects")]);
  const allowed=c.published!==false || await isStaffUser();
  if(!allowed) notFound();
  return <main><Header/>
    <section className="pageHero projectsHero">
      <span className="sectionTag">{c.eyebrow||"NEXORA / RÉALISATIONS"}</span>
      <h1>{c.title||"Des idées devenues"}<br/><span>{c.accent||"des projets concrets."}</span></h1>
      <p>{c.text||"Découvrez une sélection de projets conçus, développés ou accompagnés par Nexora."}</p>
    </section>
    {c.showCatalog!==false && <section className="projectGrid projectsGrid">
      {projects.map(p=><article className="projectCard" key={p.slug}>
        <div className="projectVisual projectRealisationVisual" style={p.image_url?{backgroundImage:`linear-gradient(180deg,rgba(7,8,18,.10),rgba(7,8,18,.90)),url("${p.image_url}")`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}>
          {!p.image_url&&<div className="projectVisualIcon"><FolderKanban size={38}/></div>}
          <span>{p.status||"Projet"}</span><small>{p.accent||p.category||"Nexora"}</small>
        </div>
        <div className="projectBody"><small>{p.category||"Réalisation"}</small><h2>{p.title}</h2><p>{p.description}</p>
          <div className="projectLinks">{p.url&&<a href={p.url} target="_blank" rel="noreferrer" className="primary projectVisit">Voir le projet <ExternalLink size={15}/></a>}{!p.url&&<Link href="/contact" className="primary projectVisit">Parler du projet <Sparkles size={15}/></Link>}{p.url&&<a href={p.url} target="_blank" rel="noreferrer" className="projectExternal" aria-label={`Ouvrir ${p.title}`}><ArrowUpRight size={17}/></a>}</div>
        </div>
      </article>)}
    </section>}
    {c.showCta!==false&&<section className="projectsCTA"><div><span className="sectionTag">{c.ctaEyebrow||"VOTRE PROJET"}</span><h2>{c.ctaTitle||"Et si votre idée était la prochaine ?"}</h2><p>{c.ctaText||"Présentez-nous votre projet et construisons-le ensemble."}</p></div><Link href="/contact" className="primary">Parler de mon projet <ArrowUpRight size={17}/></Link></section>}
    <ContentBlocks blocks={c.customBlocks}/><Footer/>
  </main>;
}
