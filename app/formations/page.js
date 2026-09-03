import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, Sparkles } from "lucide-react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { formations } from "../data";
export default function Formations(){return <main><Header/>
<section className="pageHero"><span className="sectionTag">APPRENDRE AVEC NEXORA</span><h1>Des formations<br/><span>faites pour pratiquer.</span></h1><p>Des parcours accessibles et orientés projet pour apprendre progressivement, sans vous perdre dans la théorie.</p></section>
<section className="filterRow"><span><GraduationCap size={17}/> {formations.length} formations disponibles</span><span><Sparkles size={15}/> Contenu pratique · progression libre</span></section>
<section className="formationGrid">{formations.map(f=><article className="formationCard" key={f.slug}><div className="formationIcon">{f.icon}</div><div className="cardMeta">{f.category}<span>{f.level}</span></div><h2>{f.title}</h2><p>{f.desc}</p><div className="formationInfo"><span><Clock3 size={14}/> Parcours progressif</span><span><CheckCircle2 size={14}/> Projet pratique</span></div><ul>{f.bullets.slice(0,3).map(x=><li key={x}><CheckCircle2 size={15}/>{x}</li>)}</ul><div className="priceRow"><strong>{f.price.toFixed(2).replace(".",",")} €</strong><Link className="smallBtn" href={`/formations/${f.slug}`}>Voir le programme <ArrowRight size={16}/></Link></div></article>)}</section>
<section className="serviceCTA formationCTA"><div><span className="sectionTag">BESOIN D'UNE FORMATION DIFFÉRENTE ?</span><h2>Vous avez un sujet précis ?</h2><p>Contactez Nexora pour discuter d'un parcours adapté à votre objectif.</p></div><Link className="primary" href="/contact">Demander une formation <ArrowRight size={17}/></Link></section>
<Footer /></main>}
