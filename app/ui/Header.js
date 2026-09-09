"use client";
import Link from "next/link";
import { Menu, Sparkles, X, UserRound, LogOut, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { createClient } from "../../lib/supabase/client";

const links = [["Accueil","/"],["Formations","/formations"],["Nos sites","/sites"],["Nos services","/services"],["Nous contacter","/contact"]];

export default function Header(){
 const [open,setOpen]=useState(false);
 const [user,setUser]=useState(null);
 const [loading,setLoading]=useState(true);
 const router=useRouter();

 useEffect(()=>{
   const supabase=createClient();
   let active=true;
   supabase.auth.getUser().then(({data})=>{
     if(active) setUser(data.user || null);
     if(active) setLoading(false);
   }).catch(()=>{ if(active) setLoading(false); });

   const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
     if(active) setUser(session?.user || null);
     if(active) setLoading(false);
   });
   return ()=>{ active=false; subscription.unsubscribe(); };
 },[]);

 const displayName=user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Mon profil";

 async function logout(){
   const supabase=createClient();
   setOpen(false);
   await supabase.auth.signOut();
   setUser(null);
   router.replace("/");
   router.refresh();
 }

 return <header className="nav">
  <Logo />
  <nav className={open ? "navLinks mobileOpen" : "navLinks"}>
   {links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
  </nav>
  <div className="navRight">
   {loading ? <span className="accountLoading" aria-label="Chargement du profil"><LoaderCircle className="spin" size={16}/></span> : user ? (
    <div className="profileNav">
      <Link className="profileNavLink" href="/compte" onClick={()=>setOpen(false)} title="Ouvrir mon espace">
       <span className="profileNavIcon"><UserRound size={15}/></span>
       <span className="profileNavName">{displayName}</span>
      </Link>
      <button className="profileLogout" type="button" onClick={logout} title="Se déconnecter" aria-label="Se déconnecter"><LogOut size={14}/></button>
    </div>
   ) : <Link className="accountLink" href="/connexion"><UserRound size={15}/> Compte</Link>}
   <Link className="navCta" href="/contact"><Sparkles size={15}/> Parlons projet</Link>
  </div>
  <button className="menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
 </header>
}
