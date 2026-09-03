import Link from "next/link";
import { BookOpen, MessageSquare, ShoppingBag, UserRound, ArrowUpRight } from "lucide-react";
import Header from "../ui/Header";
export const metadata={title:"Mon espace"};
export default function Compte(){return <main><Header/><section className="subPage"><div className="subHero"><span className="sectionTag">ESPACE CLIENT</span><h1>Votre espace<br/><span>Nexora.</span></h1><p className="lead">Une base prête à accueillir vos formations, commandes, demandes et échanges avec Nexora.</p>
 <div className="dashboardGrid">
  <article className="dashCard"><div className="dashIcon"><BookOpen/></div><span>FORMATIONS</span><h2>Mes formations</h2><p>Retrouvez les formations achetées et votre progression.</p><Link href="/formations">Découvrir <ArrowUpRight size={15}/></Link></article>
  <article className="dashCard"><div className="dashIcon"><MessageSquare/></div><span>PROJETS</span><h2>Mes demandes</h2><p>Suivez vos demandes de prestation et vos futurs projets.</p><Link href="/contact">Créer une demande <ArrowUpRight size={15}/></Link></article>
  <article className="dashCard"><div className="dashIcon"><ShoppingBag/></div><span>COMMANDES</span><h2>Mes commandes</h2><p>Une future zone pour vos achats, factures et paiements.</p><span className="coming">BIENTÔT</span></article>
  <article className="dashCard"><div className="dashIcon"><UserRound/></div><span>PROFIL</span><h2>Mes informations</h2><p>La gestion du profil sera connectée au système de comptes.</p><Link href="/contact">Nous contacter <ArrowUpRight size={15}/></Link></article>
 </div></div></section></main>}
