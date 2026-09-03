import { ExternalLink, Globe2, ArrowUpRight } from "lucide-react";
import Header from "../ui/Header";

const projects = [
  {
    name: "S.E.N",
    fullName: "Shinobi Era Nations",
    type: "Naruto RP",
    desc: "Une expérience communautaire Naruto RP avec boutique, services et univers dédié.",
    status: "Projet actif",
    accent: "Naruto",
    url: "https://daily76.wixsite.com/sen-naruto-rp-1",
  },
  {
    name: "Echos WL",
    fullName: "Echos Whitelist",
    type: "GTA RP",
    desc: "Serveur GTA RP Whitelist avec une identité immersive, une économie et un univers communautaire.",
    status: "Projet actif",
    accent: "GTA RP",
    url: "https://daily76.wixsite.com/echos-wl",
  },
  {
    name: "Axion Shop",
    fullName: "Dev · Optimization · Vente",
    type: "Services & boutique",
    desc: "Boutique orientée développement, ressources, mapping et optimisation PC / jeux vidéo.",
    status: "Projet actif",
    accent: "Digital",
    url: "https://daily76.wixsite.com/axion-shop",
  },
];

export default function Sites() {
  return (
    <main>
      <Header />

      <section className="pageHero">
        <span className="sectionTag">NOS PROJETS</span>
        <h1>
          Des idées qui
          <br />
          <span>prennent vie.</span>
        </h1>
        <p>
          Découvrez les projets déjà réalisés ou développés dans l’écosystème
          Nexora. Cette vitrine évoluera au fil des nouveaux projets.
        </p>
      </section>

      <section className="projectGrid">
        {projects.map((project) => (
          <article className="projectCard" key={project.name}>
            <div className="projectVisual">
              <div className="projectVisualIcon">
                <Globe2 size={38} />
              </div>
              <span>{project.status}</span>
              <small>{project.accent}</small>
            </div>

            <div className="projectBody">
              <small>{project.type}</small>
              <h2>{project.name}</h2>
              <div className="projectFullName">{project.fullName}</div>
              <p>{project.desc}</p>

              <div className="projectLinks">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="primary projectVisit"
                >
                  Visiter le site
                  <ExternalLink size={15} />
                </a>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="projectExternal"
                  aria-label={`Ouvrir ${project.name}`}
                >
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="projectShowcase">
        <div>
          <span className="sectionTag">L’ÉCOSYSTÈME NEXORA</span>
          <h2>
            Un espace pour
            <br />
            <span>chaque projet.</span>
          </h2>
          <p>
            Nexora rassemble progressivement les projets, services et outils
            numériques développés autour de différentes communautés et
            expériences.
          </p>
        </div>

        <div className="showcaseStats">
          <div>
            <strong>03</strong>
            <span>Projets présentés</span>
          </div>
          <div>
            <strong>∞</strong>
            <span>Idées à venir</span>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand">
          <span className="brandMark">N</span>
          <span>NEXORA</span>
        </div>
        <p>© 2026 Nexora.</p>
      </footer>
    </main>
  );
}
