"use client";
import Link from "next/link";

export default function AdminControlNav({active="catalog",onPanelChange}){
 const item=(key,label,href)=>{
  const cls=active===key?"active":"";
  if(onPanelChange) return <button key={key} className={cls} onClick={()=>onPanelChange(key)}>{label}</button>;
  return <Link key={key} href={href} className={cls}>{label}</Link>;
 };
 return <nav className="controlPanelNav" aria-label="Sections du panneau de contrôle">
  {item("catalog","📦 Catalogue","/admin")}
  {item("editor","🎨 Éditeur du site","/admin/editor")}
  {item("users","👥 Utilisateurs & Staff","/admin/users")}
  {item("requests","💬 Demandes clients","/admin/demandes")}
 </nav>;
}
