import Link from "next/link";
import Header from "./ui/Header";
import Footer from "./ui/Footer";

export default function NotFound() {
  return <main><Header/><section className="subPage"><div className="subHero notFoundPage">
    <span className="sectionTag">ERREUR 404</span>
    <h1>Cette page n'existe <span>pas.</span></h1>
    <p className="lead">La page recherchée a peut-être été déplacée, supprimée ou n'a jamais existé.</p>
    <div className="notFoundActions"><Link className="primary" href="/">Retour à l'accueil</Link><Link className="secondary" href="/contact">Nous contacter</Link></div>
  </div></section><Footer/></main>;
}
