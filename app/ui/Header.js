import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="nav">
      <Link className="brand" href="/"><span className="brandMark">N</span><span>NEXORA</span></Link>
      <nav className="navLinks">
        <Link href="/">Accueil</Link>
        <Link href="/formations">Formations</Link>
        <Link href="/sites">Nos sites</Link>
        <Link href="/services">Nos services</Link>
        <Link href="/contact">Nous contacter</Link>
      </nav>
      <Link className="navCta" href="/contact"><Sparkles size={15}/> Parlons projet</Link>
      <button className="menu" aria-label="Menu">☰</button>
    </header>
  );
}
