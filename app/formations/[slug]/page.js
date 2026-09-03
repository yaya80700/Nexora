import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import Header from "../../ui/Header";
import Footer from "../../ui/Footer";
import { formations } from "../../data";

export function generateStaticParams() { return formations.map(f => ({ slug: f.slug })); }

export default async function FormationDetail({ params }) {
  const { slug } = await params;
  const f = formations.find(x => x.slug === slug);
  if (!f) return <main><Header/><section className="notFound"><h1>Formation introuvable</h1><Link className="primary" href="/formations">Retour aux formations</Link></section></main>;
  return <main><Header/>
    <section className="detailHero">
      <Link className="back" href="/formations"><ArrowLeft size={16}/> Toutes les formations</Link>
      <div className="detailIcon">{f.icon}</div><span className="sectionTag">{f.category} • {f.level}</span>
      <h1>{f.title}</h1><p>{f.desc}</p>
      <div className="detailActions"><button className="primary"><Lock size={17}/> S'inscrire — {f.price.toFixed(2).replace(".", ",")} €</button><span className="secure">Paiement sécurisé • Accès après inscription</span></div>
    </section>
    <section className="detailLayout">
      <div className="detailMain"><span className="sectionTag">PROGRAMME</span><h2>Ce que vous allez apprendre</h2>
        <div className="lessonList">{f.bullets.map((b,i)=><div className="lesson" key={b}><span>{String(i+1).padStart(2,"0")}</span><div><strong>{b}</strong><small><PlayCircle size={13}/> Module de formation</small></div><CheckCircle2 size={18}/></div>)}</div>
      </div>
      <aside className="detailAside"><div className="asideTop">VOTRE PARCOURS</div><h3>Une formation pensée pour aller à l'essentiel.</h3><p>Les contenus seront enrichis progressivement avec des exercices, ressources et projets pratiques.</p><div className="asideStat"><b>{f.bullets.length}</b><span>modules</span></div><div className="asideStat"><b>∞</b><span>progression à votre rythme</span></div></aside>
    </section>
  </main>;
}
