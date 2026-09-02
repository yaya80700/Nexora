import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Header() {
 const links=[["Accueil","/"],["Formations","/formations"],["Nos sites","/sites"],["Nos services","/services"],["Nous contacter","/contact"]];
 return <header className="nav">
  <Link className="brand" href="/"><span className="brandMark">N</span><span>NEXORA</span></Link>
  <nav className="navLinks">{links.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav>
  <Link className="navCta" href="/contact"><Sparkles size={15}/> Démarrer</Link>
 </header>
}
