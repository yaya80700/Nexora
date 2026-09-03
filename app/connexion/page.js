"use client";
import Link from "next/link";
import { LogIn, ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import AuthProviders from "../ui/AuthProviders";

export default function Connexion() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault(); setLoading(true); setMessage(""); setError("");
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: form.get("email"), password: form.get("password") });
    if (error) setError(error.message);
    else window.location.href = "/compte";
    setLoading(false);
  }

  return <main><Header/><section className="authPage"><div className="authCard">
    <div className="authIcon"><LogIn size={22}/></div><span className="sectionTag">ESPACE NEXORA</span>
    <h1>Content de vous <span>revoir.</span></h1><p className="lead">Connectez-vous à votre espace client pour retrouver vos formations et vos demandes.</p>
    <AuthProviders mode="connexion" />
    <form onSubmit={submit} className="authForm">
      <label>Email<input name="email" type="email" placeholder="vous@exemple.fr" required/></label>
      <label>Mot de passe<input name="password" type="password" placeholder="••••••••" required/></label>
      <button className="primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={16}/> Connexion...</> : <>Se connecter <ArrowRight size={16}/></>}</button>
    </form>
    {error && <p className="authError">{error}</p>}
    {message && <p className="demoNote">{message}</p>}
    <p className="authSwitch">Pas encore de compte ? <Link href="/inscription">Créer un compte</Link></p>
  </div></section><Footer /></main>;
}
