"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound, LoaderCircle, Mail } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setMessage(""); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
    });
    if (error) setError(error.message);
    else setMessage("Si cette adresse possède un compte Nexora, un email de réinitialisation vient d’être envoyé.");
    setLoading(false);
  }

  return <main><Header/><section className="authPage"><div className="authCard">
    <div className="authIcon"><KeyRound size={22}/></div><span className="sectionTag">SÉCURITÉ DU COMPTE</span>
    <h1>Mot de passe <span>oublié ?</span></h1>
    <p className="lead">Indiquez votre adresse email et nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.</p>
    <form onSubmit={submit} className="authForm">
      <label>Email<input value={email} onChange={e => setEmail(e.target.value)} name="email" type="email" placeholder="vous@exemple.fr" required/></label>
      <button className="primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={16}/> Envoi...</> : <>Recevoir le lien <ArrowRight size={16}/></>}</button>
    </form>
    {error && <p className="authError">{error}</p>}
    {message && <p className="demoNote"><Mail size={15}/> {message}</p>}
    <p className="authSwitch"><Link href="/connexion"><ArrowLeft size={13}/> Retour à la connexion</Link></p>
  </div></section><Footer /></main>;
}
