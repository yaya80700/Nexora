import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Globe2, Headphones, Sparkles, Zap } from "lucide-react";
import Header from "./ui/Header";

const pillars = [
  { icon: BookOpen, title: "Formations", text: "Apprenez le développement et les outils numériques à votre rythme.", href: "/formations" },
  { icon: Globe2, title: "Nos sites", text: "Découvrez les projets et plateformes créés par Nexora.", href: "/sites" },
  { icon: Code2, title: "Nos services", text: "Création, développement et accompagnement pour vos projets.", href: "/services" },
  { icon: Headphones, title: "Accompagnement", text: "Une aide humaine pour débloquer un projet ou progresser.", href: "/contact" },
];

export default function Home() {
  return <main>
    <Header />
    <section className="hero">
      <div className="orb orb1"/><div className="orb orb2"/>
      <div className="heroContent">
        <div className="eyebrow"><Sparkles size={16}/> L'univers numérique, autrement</div>
        <h1>Bienvenue chez<br/><span>Nexora.</span></h1>
        <p>Une plateforme pensée pour apprendre, créer et faire grandir vos projets numériques au même endroit.</p>
        <div className="actions">
          <Link className="primary" href="/formations">Découvrir Nexora <ArrowRight size={18}/></Link>
          <Link className="secondary" href="/contact">Nous contacter</Link>
        </div>
      </div>
      <div className="heroCard"><div className="glow"/>
        <div className="cardTop"><span className="dot"/><span>NX / PLATFORM</span></div>
        <div className="bigN">N</div>
        <div className="cardBottom"><span>Création</span><span>Formation</span><span>Services</span></div>
      </div>
    </section>

    <section className="intro">
      <div><span className="sectionTag">L'UNIVERS NEXORA</span><h2>Un seul univers.<br/><span>Plusieurs possibilités.</span></h2></div>
      <p>Nexora réunit les compétences, services et projets numériques dans une expérience simple, moderne et évolutive.</p>
    </section>

    <section className="grid">
      {pillars.map(({icon: Icon, title, text, href}) => <Link className="tile" href={href} key={title}>
        <div className="icon"><Icon size={22}/></div><h3>{title}</h3><p>{text}</p><span className="tileArrow"><ArrowRight size={18}/></span>
      </Link>)}
    </section>

    <section className="homeBanner">
      <div><span className="sectionTag">NEXORA V0.3</span><h2>On ne fait plus<br/><span>juste une vitrine.</span></h2></div>
      <p>Chaque rubrique devient maintenant une vraie partie de la plateforme : offres, détails, demandes et parcours utilisateur.</p>
      <Link className="primary" href="/services">Voir les services <ArrowRight size={18}/></Link>
    </section>

    <footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora. Tous droits réservés.</p></footer>
  </main>;
}
