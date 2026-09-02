import { ArrowRight, BookOpen, Code2, Globe2, Headphones, Sparkles } from "lucide-react";

const pillars = [
  { icon: BookOpen, title: "Formations", text: "Développement, optimisation et compétences numériques, accessibles à tous." },
  { icon: Globe2, title: "Nos projets", text: "Retrouvez les sites et projets créés au sein de l’univers Nexora." },
  { icon: Code2, title: "Nos services", text: "Un accompagnement concret pour créer, améliorer et faire évoluer vos projets." },
  { icon: Headphones, title: "Accompagnement", text: "Une aide humaine pour avancer sereinement, étape par étape." },
];

export default function Home() {
  return (
    <main>
      <header className="nav">
        <a className="brand" href="#"><span className="brandMark">N</span><span>NEXORA</span></a>
        <nav className="navLinks">
          <a className="active" href="#">Accueil</a>
          <a href="#formations">Formations</a>
          <a href="#projects">Nos sites</a>
          <a href="#services">Nos services</a>
          <a href="#contact">Nous contacter</a>
        </nav>
        <button className="menu" aria-label="Menu">☰</button>
      </header>

      <section className="hero">
        <div className="orb orb1" /><div className="orb orb2" />
        <div className="heroContent">
          <div className="eyebrow"><Sparkles size={16}/> L'univers numérique, autrement</div>
          <h1>Bienvenue chez<br/><span>Nexora.</span></h1>
          <p>Une plateforme pensée pour apprendre, créer et faire grandir vos projets numériques au même endroit.</p>
          <div className="actions">
            <a className="primary" href="#services">Découvrir Nexora <ArrowRight size={18}/></a>
            <a className="secondary" href="#contact">Nous contacter</a>
          </div>
        </div>
        <div className="heroCard">
          <div className="glow" />
          <div className="cardTop"><span className="dot"/><span>NX / PLATFORM</span></div>
          <div className="bigN">N</div>
          <div className="cardBottom"><span>Création</span><span>Formation</span><span>Services</span></div>
        </div>
      </section>

      <section className="intro" id="services">
        <div>
          <span className="sectionTag">NEXORA</span>
          <h2>Un seul univers.<br/><span>Plusieurs possibilités.</span></h2>
        </div>
        <p>Nexora rassemble différents services numériques dans une expérience simple et moderne. Le projet commence ici et évoluera avec vous.</p>
      </section>

      <section className="grid" id="formations">
        {pillars.map(({icon: Icon, title, text}) => (
          <article className="tile" key={title}>
            <div className="icon"><Icon size={22}/></div>
            <h3>{title}</h3><p>{text}</p>
            <span className="tileArrow"><ArrowRight size={18}/></span>
          </article>
        ))}
      </section>

      <section className="cta" id="projects">
        <div><span className="sectionTag">Bientôt sur Nexora</span><h2>Votre projet mérite<br/><span>plus qu'un simple site.</span></h2></div>
        <p>Cette première version pose les fondations. Les pages Formations, Nos sites, Services et Contact seront ajoutées progressivement.</p>
      </section>

      <footer id="contact">
        <div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div>
        <p>© 2026 Nexora. Tous droits réservés.</p>
      </footer>
    </main>
  );
}
