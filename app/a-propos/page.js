import Link from "next/link";
import { ArrowUpRight, Heart, Lightbulb, Rocket, Workflow } from "lucide-react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { getSiteContent } from "../../lib/nexora/siteContent";
import ContentBlocks from "../ui/ContentBlocks";

export default async function About(){
  const c=await getSiteContent("about");
  return <main><Header/>
    <section className="pageHero aboutHero"><span className="sectionTag">{c.eyebrow||"À PROPOS DE NEXORA"}</span><h1>{c.title||"Une plateforme pensée pour"}<br/><span>{c.accent||"faire avancer vos idées."}</span></h1><p>{c.text||"Nexora réunit développement, création de sites, services numériques et formations dans un même univers."}</p></section>
    {c.showTeam!==false&&<section className="aboutSection"><div className="aboutSectionHead"><span className="sectionTag">{c.teamEyebrow||"L’ÉQUIPE NEXORA"}</span><h2>{c.teamTitle||"Des profils différents,"} <span>{c.teamAccent||"une même vision."}</span></h2><p>{c.teamText}</p></div><div className="aboutTeamGrid">{(c.team||[]).map((m,i)=><article className="aboutTeamCard" key={`${m.name||"team"}-${i}`}><div className="aboutIcon">{m.icon||"✦"}</div><span>{m.role||"Nexora"}</span><h3>{m.name||"Nexora"}</h3><p>{m.text}</p></article>)}</div></section>}
    {c.showWhy!==false&&<section className="aboutSection aboutWhy"><div className="aboutSectionHead"><span className="sectionTag">{c.whyEyebrow||"POURQUOI NEXORA"}</span><h2>{c.whyTitle||"Pas seulement livrer."} <span>{c.whyAccent||"Construire avec vous."}</span></h2><p>{c.whyText}</p></div><div className="aboutWhyGrid">{(c.why||[]).map((w,i)=><article className="aboutWhyCard" key={`${w.title||"why"}-${i}`}><strong>{w.icon||String(i+1).padStart(2,"0")}</strong><h3>{w.title}</h3><p>{w.text}</p></article>)}</div></section>}
    {c.showProcess!==false&&<section className="aboutProcess"><div className="aboutProcessIntro"><span className="sectionTag">{c.processEyebrow||"NOTRE FAÇON DE TRAVAILLER"}</span><h2>{c.processTitle||"Simple dans l’approche."}<br/><span>{c.processAccent||"Sérieux dans l’exécution."}</span></h2><p>{c.processText}</p></div><div className="aboutProcessCards"><div><Workflow size={19}/><strong>Comprendre</strong><span>Clarifier le besoin et les objectifs.</span></div><div><Lightbulb size={19}/><strong>Imaginer</strong><span>Choisir une solution adaptée.</span></div><div><Rocket size={19}/><strong>Faire évoluer</strong><span>Construire et améliorer dans le temps.</span></div></div></section>}
    {c.supportEnabled!==false&&<section className="tipJarSection">
      <div className="tipJarVisual" aria-hidden="true">
        <div className="tipJarGlow"></div>
        <div className="tipJar">
          <div className="tipJarLid"></div>
          <div className="tipJarGlass">
            <span className="tipCoin tipCoin1">✦</span>
            <span className="tipCoin tipCoin2">N</span>
            <span className="tipCoin tipCoin3">✦</span>
            <span className="tipCoin tipCoin4">N</span>
          </div>
        </div>
      </div>
      <div className="tipJarContent">
        <span className="sectionTag">{c.supportEyebrow||"SOUTENIR NEXORA"}</span>
        <h2>{c.supportTitle||"Un petit coup de pouce pour"} <span>{c.supportAccent||"faire grandir Nexora."}</span></h2>
        <p>{c.supportText||"Si Nexora, ses projets ou ses ressources vous sont utiles, vous pouvez soutenir librement son développement."}</p>
        {c.supportUrl ? (
          <a href={c.supportUrl} target="_blank" rel="noopener noreferrer" className="primary tipJarButton">
            <Heart size={17} /> {c.supportButtonLabel||"Laisser un pourboire"} <ArrowUpRight size={17}/>
          </a>
        ) : (
          <span className="tipJarComingSoon"><Heart size={16}/> {c.supportNote||"Lien de soutien bientôt disponible"}</span>
        )}
      </div>
    </section>}
    {c.showCta!==false&&<section className="aboutCTA"><div><span className="sectionTag">{c.ctaEyebrow||"UN PROJET EN TÊTE ?"}</span><h2>{c.ctaTitle||"Faisons connaissance."}</h2><p>{c.ctaText}</p></div><Link href="/contact" className="primary">Parler de mon projet <ArrowUpRight size={17}/></Link></section>}
    <ContentBlocks blocks={c.customBlocks}/><Footer/>
  </main>;
}
