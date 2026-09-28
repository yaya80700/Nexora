"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "../../../lib/supabase/client";
import Editor from "../EditorPanel";
import AdminControlNav from "../AdminControlNav";

export default function AdminEditorPage(){
 async function logout(){ await createClient().auth.signOut(); location.href="/admin/connexion"; }
 return <main className="adminPage">
  <header className="adminTop"><div><span className="sectionTag">NEXORA ADMIN</span><h1>Éditeur du <span>site.</span></h1><p>Modifiez les pages, textes, blocs et contenus de Nexora.</p></div><div className="adminActions"><Link href="/" className="secondary">Voir le site</Link><button className="secondary" onClick={logout}><LogOut size={15}/> Déconnexion</button></div></header>
  <section className="adminWrap"><AdminControlNav active="editor"/><Editor/></section>
 </main>;
}
