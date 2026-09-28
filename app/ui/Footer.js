import Image from "next/image";
import Link from "next/link";

export default function Footer(){
  return <footer className="siteFooter">
    <div className="footerMain">
      <div className="footerBrand">
        <Image src="/nexora-logo.png" alt="Logo Nexora" width={58} height={58} />
        <div><strong>NEXORA</strong><span>Créons. Apprenons. Évoluons.</span></div>
      </div>
      <div className="footerLinks">
        <Link href="/">Accueil</Link>
        <Link href="/formations">Formations</Link>
        <Link href="/sites">Nos sites</Link>
        <Link href="/services">Nos services</Link>
        <Link href="/contact">Nous contacter</Link>
      </div>
    </div>
    <div className="footerBottom"><span>© 2026 Nexora. Tous droits réservés.</span><span>Une idée ? Parlons-en.</span></div>
  </footer>
}
