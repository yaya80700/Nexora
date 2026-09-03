"use client";
import { Apple, Chrome } from "lucide-react";

export default function AuthProviders({mode="connexion"}){
  const action = mode === "inscription" ? "Créer avec" : "Continuer avec";
  return <>
    <div className="socialAuth">
      <button type="button" className="socialButton" onClick={()=>alert("Connexion Google : sera activée avec le backend Nexora.")}><Chrome size={18}/> {action} Google</button>
      <button type="button" className="socialButton" onClick={()=>alert("Connexion Apple : sera activée avec le backend Nexora.")}><Apple size={18}/> {action} Apple</button>
    </div>
    <div className="authDivider"><span>ou avec votre email</span></div>
  </>;
}
