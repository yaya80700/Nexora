import Link from "next/link";
import { BookOpen, MessageSquare, UserRound, ArrowUpRight, LogOut, Settings2 } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export const metadata={title:"Mon espace"};

export default async function Compte() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/connexion");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Membre Nexora";

  return <main><Header/><section className="subPage"><div className="subHero">
    <span className="sectionTag">ESPACE CLIENT</span><h1>Bonjour,<br/><span>{name}.</span></h1>
    <p className="lead">Votre espace Nexora est connecté à votre compte. Retrouvez vos formations et échangez avec nous pour vos projets.</p>
    <div className="accountBar"><div><span>COMPTE CONNECTÉ</span><strong>{user.email}</strong></div><form action="/api/auth/logout" method="post"><button className="secondary" type="submit"><LogOut size={15}/> Se déconnecter</button></form></div>
    <div className="dashboardGrid">
      <article className="dashCard"><div className="dashIcon"><BookOpen/></div><span>FORMATIONS</span><h2>Mes formations</h2><p>Retrouvez vos formations et votre progression.</p><Link href="/formations">Découvrir <ArrowUpRight size={15}/></Link></article>
      <article className="dashCard"><div className="dashIcon"><MessageSquare/></div><span>PROJETS</span><h2>Mes demandes</h2><p>Pour une prestation ou un projet, contactez directement Nexora.</p><Link href="/contact">Créer une demande <ArrowUpRight size={15}/></Link></article>
      <article className="dashCard"><div className="dashIcon"><UserRound/></div><span>PROFIL</span><h2>Mes informations</h2><p>Votre identité de compte est gérée par le système Nexora.</p><Link href="/profil" className="profileLink"><Settings2 size={13}/> Modifier</Link></article>
    </div>
  </div></section><Footer /></main>;
}
