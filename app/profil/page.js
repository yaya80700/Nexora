"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export default function Profil() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/connexion"; return; }
      setEmail(user.email || "");
      setName(user.user_metadata?.full_name || "");
      setLoading(false);
    };
    load();
  }, []);

  async function submit(e) {
    e.preventDefault(); setSaving(true); setMessage(""); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    if (error) setError(error.message);
    else setMessage("Vos informations ont bien été enregistrées.");
    setSaving(false);
  }

  if (loading) return <main><Header/><section className="authPage"><div className="authCard"><LoaderCircle className="spin" size={24}/></div></section><Footer/></main>;

  return <main><Header/><section className="authPage"><div className="authCard">
    <div className="authIcon"><UserRound size={22}/></div><span className="sectionTag">MON PROFIL</span>
    <h1>Vos informations <span>Nexora.</span></h1>
    <p className="lead">Modifiez les informations visibles dans votre espace client.</p>
    <form onSubmit={submit} className="authForm">
      <label>Nom<input value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" required/></label>
      <label>Email<input value={email} type="email" disabled/></label>
      <button className="primary" type="submit" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={16}/> Enregistrement...</> : <>Enregistrer <ArrowRight size={16}/></>}</button>
    </form>
    {error && <p className="authError">{error}</p>}
    {message && <p className="demoNote"><CheckCircle2 size={15}/> {message}</p>}
    <p className="authSwitch"><Link href="/compte"><ArrowLeft size={13}/> Retour à mon espace</Link></p>
  </div></section><Footer /></main>;
}
