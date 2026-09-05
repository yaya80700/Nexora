"use client";
import { Chrome } from "lucide-react";
import { createClient } from "../../lib/supabase/client";

export default function AuthProviders({ mode = "connexion" }) {
  const action = mode === "inscription" ? "Créer avec" : "Continuer avec";

  async function oauth(provider) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert(error.message);
  }

  return <>
    <div className="socialAuth">
      <button type="button" className="socialButton" onClick={() => oauth("google")}>
        <Chrome size={18} /> {action} Google
      </button>
    </div>
    <div className="authDivider"><span>ou avec votre email</span></div>
  </>;
}
