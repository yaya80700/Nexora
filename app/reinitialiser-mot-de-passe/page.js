"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    if (password !== confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      setLoading(false); return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setDone(true);
    setLoading(false);
  }

  return <main><Header/><section className="authPage"><div className="authCard">
    <div className="authIcon">{done ? <CheckCircle2 size={22}/> : <KeyRound size={22}/>}</div><span className="sectionTag">NOUVEAU MOT DE PASSE</span>
    {!done ? <>
      <h1>Réinitialisez votre <span>accès.</span></h1>
      <p className="lead">Choisissez un nouveau mot de passe pour sécuriser votre compte Nexora.</p>
      <form onSubmit={submit} className="authForm">
        <label>Nouveau mot de passe<input value={password} onChange={e => setPassword(e.target.value)} type="password" minLength={8} placeholder="8 caractères minimum" required/></label>
        <label>Confirmer<input value={confirmation} onChange={e => setConfirmation(e.target.value)} type="password" minLength={8} placeholder="Répétez votre mot de passe" required/></label>
        <button className="primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={16}/> Enregistrement...</> : <>Enregistrer <ArrowRight size={16}/></>}</button>
      </form>
      {error && <p className="authError">{error}</p>}
    </> : <>
      <h1>Mot de passe <span>modifié.</span></h1>
      <p className="lead">Votre nouveau mot de passe est enregistré. Vous pouvez maintenant accéder à votre espace Nexora.</p>
      <Link className="primary" href="/connexion">Se connecter <ArrowRight size={16}/></Link>
    </>}
  </div></section><Footer /></main>;
}
