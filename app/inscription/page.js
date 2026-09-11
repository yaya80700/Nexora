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
  const [success, setSuccess] = useState(false);

  async function submit(e) {
    e.preventDefault(); setLoading(true); setMessage(""); setError("");
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "").trim();

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      const message = error.message || "Impossible de créer le compte.";
      setError(message);
      setLoading(false);
      return;
    }

    // Avec la confirmation email désactivée dans Supabase, Supabase renvoie
    // immédiatement une session et l'utilisateur peut entrer dans son compte.
    if (data?.session) {
      window.location.replace("/compte");
      return;
    }

    // Si Supabase ne renvoie pas de session, la confirmation email est encore
    // activée côté projet. On ne prétend pas que l'utilisateur est connecté.
    setSuccess(true);
    setMessage("Compte créé. La confirmation email est encore activée dans Supabase : désactive-la dans Authentication → Providers → Email pour permettre une connexion immédiate.");
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
    {message && <p className={success ? "demoNote authSuccess" : "demoNote"}>{message}</p>}
    <p className="authSwitch">Déjà inscrit ? <Link href="/connexion">Se connecter</Link></p>
  </div></section><Footer /></main>;
}
