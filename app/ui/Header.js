"use client";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

const links = [["Accueil","/"],["Formations","/formations"],["Nos sites","/sites"],["Nos services","/services"],["Nous contacter","/contact"]];
export default function Header(){
 const [open,setOpen]=useState(false);
 return <header className="nav">
  <Link className="brand" href="/" onClick={()=>setOpen(false)}><span className="brandMark">N</span><span>NEXORA</span></Link>
  <nav className={open ? "navLinks mobileOpen" : "navLinks"}>{links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
  <Link className="navCta" href="/contact"><Sparkles size={15}/> Parlons projet</Link>
  <button className="menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
 </header>
}
