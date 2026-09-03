"use client";
import Link from "next/link";
import { UserPlus, ArrowRight } from "lucide-react";
import { useState } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import AuthProviders from "../ui/AuthProviders";
export default function Inscription(){
 const [sent,setSent]=useState(false);
 return <main><Header/><section className="authPage"><div className="authCard">
  <div className="authIcon"><UserPlus size={22}/></div><span className="sectionTag">NOUVEAU COMPTE</span>
  <h1>Bienvenue sur <span>Nexora.</span></h1><p className="lead">Créez votre espace pour retrouver vos formations, demandes et échanges avec Nexora au même endroit.</p>
  <AuthProviders mode="inscription" />
  <form onSubmit={(e)=>{e.preventDefault();setSent(true)}} className="authForm">
   <label>Nom<input placeholder="Votre nom" required/></label>
   <label>Email<input type="email" placeholder="vous@exemple.fr" required/></label>
   <label>Mot de passe<input type="password" placeholder="••••••••" minLength={8} required/></label>
   <button className="primary" type="submit">Créer mon compte <ArrowRight size={16}/></button>
  </form>
  {sent && <p className="demoNote">Mode démo : l’interface est prête. La création réelle des comptes sera branchée au backend ensuite.</p>}
  <p className="authSwitch">Déjà inscrit ? <Link href="/connexion">Se connecter</Link></p>
 </div></section><Footer /></main>
}
