import Link from "next/link";
import { ArrowRight, Bot, Code2, Globe, Gauge, LifeBuoy, PenTool } from "lucide-react";
import Header from "../ui/Header";

const services = [
  ["Développement sur mesure","Code2","Création de scripts, systèmes et fonctionnalités adaptés à votre projet.","À partir de 49 €"],
  ["Création de site web","Globe","Sites vitrines, landing pages et plateformes modernes prêtes à évoluer.","À partir de 79 €"],
  ["Optimisation","Gauge","Analyse et amélioration des performances de votre PC, jeu ou projet.","À partir de 29 €"],
  ["Accompagnement","LifeBuoy","Aide au diagnostic, débogage et résolution de problèmes techniques.","À partir de 19 €"],
  ["UI / Design web","PenTool","Interfaces modernes et cohérentes pour donner une vraie identité à votre projet.","Sur devis"],
  ["Automatisation","Bot","Scripts et outils pour supprimer les tâches répétitives et gagner du temps.","Sur devis"],
];

const icons={Code2,Globe,Gauge,LifeBuoy,PenTool,Bot};

export default function Services(){return <main><Header/>
<section className="pageHero"><span className="sectionTag">NOS SERVICES</span><h1>Une idée ?<br/><span>On la construit.</span></h1><p>Du développement à la mise en ligne, Nexora vous accompagne sur les différentes étapes de votre projet numérique.</p></section>
<section className="serviceGrid">{services.map(([title,ico,desc,price])=>{const Icon=icons[ico];return <article className="serviceCard" key={title}><div className="icon"><Icon size={22}/></div><h2>{title}</h2><p>{desc}</p><div className="serviceBottom"><span>{price}</span><Link href="/contact"><ArrowRight size={18}/></Link></div></article>})}</section>
<section className="serviceCTA"><div><span className="sectionTag">UN BESOIN PARTICULIER ?</span><h2>Parlez-nous de votre projet.</h2></div><Link className="primary" href="/contact">Demander un accompagnement <ArrowRight size={18}/></Link></section>
<footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora.</p></footer></main>}
