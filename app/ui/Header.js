"use client";
import Link from "next/link";
import { Menu, Sparkles, X, UserRound, LogOut, LoaderCircle, MessageCircle, Bell, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { createClient } from "../../lib/supabase/client";

const baseLinks = [["Accueil","/"],["Formations","/formations"],["Abonnements","/abonnements"],["Nos projets","/projets"],["À propos","/a-propos"],["Nos sites","/sites"],["Nos services","/services"],["Nous contacter","/contact"]];

export default function Header(){
 const [open,setOpen]=useState(false);
 const [links,setLinks]=useState(baseLinks);
 const [user,setUser]=useState(null);
 const [loading,setLoading]=useState(true);
 const [unread,setUnread]=useState(0);
 const [cartCount,setCartCount]=useState(0);
 const [cartEnabled,setCartEnabled]=useState(false);
 const router=useRouter();

 useEffect(()=>{
   const supabase=createClient();
   let active=true;
   fetch("/api/site-pages").then(r=>r.json()).then(j=>{
     if(active && Array.isArray(j.pages)) setLinks(j.pages.map(p=>[p.nav_label||p.title,p.href||`/${p.slug}`]));
   }).catch(()=>{});
   supabase.auth.getUser().then(({data})=>{
     if(active) setUser(data.user || null);
     if(active) setLoading(false);
   }).catch(()=>{ if(active) setLoading(false); });

   fetch("/api/store/config",{cache:"no-store"}).then(r=>r.json()).then(j=>{ if(active) setCartEnabled(j?.enabled !== false); }).catch(()=>{});
   const syncCart=()=>{ try { const raw=localStorage.getItem("nexora_cart")||"[]"; const items=JSON.parse(raw); setCartCount(Array.isArray(items)?items.reduce((n,x)=>n+Math.max(1,Number(x.quantity)||1),0):0); } catch { setCartCount(0); } };
   syncCart();
   window.addEventListener("nexora-cart-updated",syncCart);
   window.addEventListener("storage",syncCart);

   supabase.auth.getUser().then(({data})=>{
     if(data?.user) fetch("/api/notifications").then(r=>r.json()).then(j=>{if(active)setUnread(Number(j.unread)||0)}).catch(()=>{});
   }).catch(()=>{});

   const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
     if(active) {
       setUser(session?.user || null);
       if(session?.user) fetch("/api/notifications").then(r=>r.json()).then(j=>{if(active)setUnread(Number(j.unread)||0)}).catch(()=>{});
       else setUnread(0);
     }
     if(active) setLoading(false);
   });
   return ()=>{ active=false; subscription.unsubscribe(); window.removeEventListener("nexora-cart-updated",syncCart); window.removeEventListener("storage",syncCart); };
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
   {user && <Link className="messagesNav" href="/demandes" title="Mes échanges"><MessageCircle size={15}/></Link>}
   {user && <Link className="notificationsNav" href="/notifications" title="Notifications"><Bell size={15}/>{unread>0&&<span>{unread > 99 ? "99+" : unread}</span>}</Link>}
   {user && cartEnabled && <Link className="cartNav" href="/profil#panier" title="Mon panier" aria-label={`Mon panier${cartCount ? `, ${cartCount} article${cartCount>1?"s":""}` : ""}`}><ShoppingCart size={15}/>{cartCount>0&&<span>{cartCount>99?"99+":cartCount}</span>}</Link>}
   {loading ? <span className="accountLoading" aria-label="Chargement du profil"><LoaderCircle className="spin" size={16}/></span> : user ? (
    <div className="profileNav">
      <Link className="profileNavLink" href="/compte" onClick={()=>setOpen(false)} title="Ouvrir mon espace">
       <span className="profileNavIcon"><UserRound size={15}/></span>
       <span className="profileNavName">{displayName}</span><span className="profileNavMobileName">Compte</span>
      </Link>
      <button className="profileLogout" type="button" onClick={logout} title="Se déconnecter" aria-label="Se déconnecter"><LogOut size={14}/></button>
    </div>
   ) : <Link className="accountLink" href="/connexion"><UserRound size={15}/> Compte</Link>}
   <Link className="navCta" href="/contact"><Sparkles size={15}/> Parlons projet</Link>
  </div>
  <button className="menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
 </header>
}
