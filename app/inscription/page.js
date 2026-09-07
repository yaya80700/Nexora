"use client";
import Link from "next/link";
import { UserPlus, ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import AuthProviders from "../ui/AuthProviders";

export default function Inscription() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault(); setLoading(true); setMessage(""); setError("");
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.get("email"), password: form.get("password"),
      options: { data: { full_name: form.get("name") }, emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) setError(error.message);
    else if (data.session) window.location.href = "/compte";
    else setMessage("Compte créé. Consultez votre email pour confirmer votre adresse avant de vous connecter.");
    setLoading(false);
  }

  return <main><Header/><section className="authPage"><div className="authCard">
    <div className="authIcon"><UserPlus size={22}/></div><span className="sectionTag">NOUVEAU COMPTE</span>
    <h1>Bienvenue sur <span>Nexora.</span></h1><p className="lead">Créez votre espace pour retrouver vos formations, demandes et échanges avec Nexora.</p>
    <AuthProviders mode="inscription" />
    <form onSubmit={submit} className="authForm">
      <label>Nom<input name="name" placeholder="Votre nom" required/></label>
      <label>Email<input name="email" type="email" placeholder="vous@exemple.fr" required/></label>
      <label>Mot de passe<input name="password" type="password" placeholder="8 caractères minimum" minLength={8} required/></label>
      <button className="primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={16}/> Création...</> : <>Créer mon compte <ArrowRight size={16}/></>}</button>
    </form>
    {error && <p className="authError">{error}</p>}
    {message && <p className="demoNote">{message}</p>}
    <p className="authSwitch">Déjà inscrit ? <Link href="/connexion">Se connecter</Link></p>
  </div></section><Footer /></main>;
}
