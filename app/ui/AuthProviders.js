"use client";
import { Chrome, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function AuthProviders({ mode = "connexion" }) {
  const [loading, setLoading] = useState(false);
  const action = mode === "inscription" ? "Créer avec" : mode === "admin" ? "Continuer avec" : "Continuer avec";

  async function oauth(provider) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "https://nexora-gules-three.vercel.app/auth/callback" },
    });
    if (error) {
      setLoading(false);
      alert(error.message || "Impossible de démarrer la connexion Google.");
    }
  }

  return <>
    <div className="socialAuth">
      <button type="button" className="socialButton" onClick={() => oauth("google")} disabled={loading}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <Chrome size={18} />} {loading ? "Connexion..." : `${action} Google`}
      </button>
    </div>
    <div className="authDivider"><span>ou avec votre email</span></div>
  </>;
}
