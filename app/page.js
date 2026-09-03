import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Code2, Globe2, Headphones, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import { formations } from "./data";

const pillars = [
  { icon: BookOpen, title: "Formations", text: "Des parcours pratiques pour apprendre le développement et les outils numériques.", href: "/formations" },
  { icon: Code2, title: "Développement", text: "Des scripts, systèmes et applications pensés autour de vos besoins.", href: "/services" },
  { icon: Globe2, title: "Projets", text: "Explorez les univers et plateformes déjà construits dans l'écosystème Nexora.", href: "/sites" },
  { icon: Headphones, title: "Accompagnement", text: "Un coup de main pour comprendre, corriger ou faire avancer votre projet.", href: "/contact" },
];

export default function Home() {
  return <main>
    <Header />
    <section className="hero">
      <div className="orb orb1"/><div className="orb orb2"/>
      <div className="heroContent">
        <div className="eyebrow"><Sparkles size={16}/> CRÉER · APPRENDRE · ÉVOLUER</div>
        <h1>Le numérique,<br/><span>sans limites.</span></h1>
        <p>Nexora rassemble formations, développement, services et projets dans une plateforme pensée pour transformer les idées en réalisations.</p>
        <div className="actions">
          <Link className="primary" href="/services">Démarrer un projet <ArrowRight size={18}/></Link>
          <Link className="secondary" href="/formations">Explorer les formations</Link>
        </div>
        <div className="heroTrust"><span><CheckCircle2 size={15}/> Approche pratique</span><span><CheckCircle2 size={15}/> Projets sur mesure</span><span><CheckCircle2 size={15}/> Plateforme évolutive</span></div>
      </div>
      <div className="heroCard"><div className="glow"/>
        <div className="cardTop"><span className="dot"/><span>NX / ECOSYSTEM</span></div>
        <div className="bigLogo"><Image src="/nexora-logo.png" alt="Logo Nexora" width={250} height={250} priority/></div>
        <div className="heroCardLine"><span/><span/><span/></div>
        <div className="cardBottom"><span>Learn</span><span>Build</span><span>Grow</span></div>
      </div>
    </section>

    <section className="statsStrip">
      <div><strong>03</strong><span>Projets présentés</span></div>
      <div><strong>06</strong><span>Formations disponibles</span></div>
      <div><strong>06</strong><span>Services proposés</span></div>
      <div><strong>∞</strong><span>Possibilités à venir</span></div>
    </section>

    <section className="intro">
      <div><span className="sectionTag">L'UNIVERS NEXORA</span><h2>Un seul univers.<br/><span>Plusieurs possibilités.</span></h2></div>
      <p>Que vous souhaitiez apprendre, lancer un site, développer un système ou simplement débloquer un problème, Nexora est construit pour réunir ces besoins au même endroit.</p>
    </section>

    <section className="grid">
      {pillars.map(({icon: Icon, title, text, href}) => <Link className="tile" href={href} key={title}>
        <div className="icon"><Icon size={22}/></div><h3>{title}</h3><p>{text}</p><span className="tileArrow"><ArrowRight size={18}/></span>
      </Link>)}
    </section>

    <section className="featureSplit">
      <div className="featureVisual"><div className="featureBadge"><Zap size={15}/> NEXORA / FORMATIONS</div><strong>Apprendre<br/><span>en construisant.</span></strong><div className="miniProgress"><span/><span/><span/></div></div>
      <div className="featureCopy"><span className="sectionTag">APPRENDRE AUTREMENT</span><h2>Pas seulement des cours.<br/><span>Des compétences utiles.</span></h2><p>Les formations Nexora sont pensées autour de la pratique : comprendre une notion, l'utiliser et l'intégrer dans un vrai projet.</p><ul>{formations.slice(0,3).map(f=><li key={f.slug}><CheckCircle2 size={16}/>{f.title}</li>)}</ul><Link className="secondary" href="/formations">Voir toutes les formations <ArrowRight size={16}/></Link></div>
    </section>

    <section className="homeBanner"><div><span className="sectionTag">PRÊT À COMMENCER ?</span><h2>Votre idée mérite<br/><span>d'aller plus loin.</span></h2></div><p>Décrivez votre projet, votre besoin ou votre problème. On construit la suite ensemble.</p><Link className="primary" href="/contact">Parler de mon projet <ArrowRight size={18}/></Link></section>

    <Footer />
  </main>;
}
