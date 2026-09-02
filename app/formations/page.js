import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import Header from "../ui/Header";
import { formations } from "../data";

export default function Formations() {
  return <main><Header/>
    <section className="pageHero"><span className="sectionTag">APPRENDRE AVEC NEXORA</span><h1>Des formations<br/><span>faites pour pratiquer.</span></h1><p>Des parcours accessibles, concrets et orientés projet. Choisissez votre domaine et avancez à votre rythme.</p></section>
    <section className="filterRow"><span><GraduationCap size={17}/> {formations.length} formations disponibles</span><span>Accès progressif • Contenu pratique</span></section>
    <section className="formationGrid">
      {formations.map(f => <article className="formationCard" key={f.slug}>
        <div className="formationIcon">{f.icon}</div><div className="cardMeta">{f.category}<span>{f.level}</span></div>
        <h2>{f.title}</h2><p>{f.desc}</p>
        <ul>{f.bullets.slice(0,3).map(x=><li key={x}><CheckCircle2 size={15}/>{x}</li>)}</ul>
        <div className="priceRow"><strong>{f.price.toFixed(2).replace(".", ",")} €</strong><Link className="smallBtn" href={`/formations/${f.slug}`}>Voir la formation <ArrowRight size={16}/></Link></div>
      </article>)}
    </section>
    <footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora.</p></footer>
  </main>;
}
