"use client";
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";
import { useState } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import AuthProviders from "../ui/AuthProviders";

export default function Connexion(){
 const [sent,setSent]=useState(false);
 return <main><Header/><section className="authPage"><div className="authCard">
  <div className="authIcon"><LogIn size={22}/></div><span className="sectionTag">ESPACE NEXORA</span>
  <h1>Content de vous <span>revoir.</span></h1><p className="lead">Connectez-vous à votre espace client. L’authentification réelle sera activée avec le backend dans une prochaine étape.</p>
  <AuthProviders mode="connexion" />
  <form onSubmit={(e)=>{e.preventDefault();setSent(true)}} className="authForm">
   <label>Email<input type="email" placeholder="vous@exemple.fr" required/></label>
   <label>Mot de passe<input type="password" placeholder="••••••••" required/></label>
   <button className="primary" type="submit">Se connecter <ArrowRight size={16}/></button>
  </form>
  {sent && <p className="demoNote">Mode démo : le formulaire fonctionne côté interface, mais aucun compte n’est encore enregistré.</p>}
  <p className="authSwitch">Pas encore de compte ? <Link href="/inscription">Créer un compte</Link></p>
 </div></section><Footer /></main>
}
