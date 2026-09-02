import Link from "next/link";
import { ExternalLink, Github, Globe2 } from "lucide-react";
import Header from "../ui/Header";

const projects=[
 {name:"Echos RP",type:"Plateforme GTA RP",desc:"Univers communautaire et outils numériques autour d'un serveur GTA RP.",status:"Projet actif",url:"#"},
 {name:"SEN RP",type:"Naruto RP",desc:"Projet de serveur et d'expérience communautaire inspiré de l'univers Naruto.",status:"En développement",url:"#"},
 {name:"Action Shop",type:"Projet web",desc:"Une expérience e-commerce pensée autour d'une identité moderne.",status:"Projet",url:"#"},
];

export default function Sites(){return <main><Header/><section className="pageHero"><span className="sectionTag">NOS PROJETS</span><h1>Des idées qui<br/><span>prennent vie.</span></h1><p>Cette page deviendra le portfolio public de l'écosystème Nexora. Chaque projet aura sa fiche et ses liens.</p></section>
<section className="projectGrid">{projects.map(p=><article className="projectCard" key={p.name}><div className="projectVisual"><Globe2 size={40}/><span>{p.status}</span></div><div className="projectBody"><small>{p.type}</small><h2>{p.name}</h2><p>{p.desc}</p><div className="projectLinks"><Link href={p.url}>Visiter <ExternalLink size={15}/></Link><Link href="#"><Github size={15}/> Projet</Link></div></div></article>)}</section>
<footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora.</p></footer></main>}
