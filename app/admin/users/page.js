"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {Users,LoaderCircle,ShieldCheck,Save,Trash2,LogOut,Search,UserRound,CheckCircle2,Clock3,ChevronDown,KeyRound} from "lucide-react";
import {createClient} from "../../../lib/supabase/client";
import AdminControlNav from "../AdminControlNav";

const roles={
 owner:{label:"Propriétaire",short:"OWNER",desc:"Accès total et gestion du staff.",tone:"owner",permissions:["Tout le panneau","Gestion du staff","Catalogue & éditeur","Demandes clients"]},
 admin:{label:"Administrateur",short:"ADMIN",desc:"Gestion complète du site hors propriétaire.",tone:"admin",permissions:["Utilisateurs & staff","Catalogue & éditeur","Demandes clients","Paramètres admin"]},
 editor:{label:"Éditeur",short:"EDITOR",desc:"Création et modification du contenu.",tone:"editor",permissions:["Éditeur du site","Catalogue","Pages & blocs","Pas de gestion du staff"]},
 support:{label:"Support",short:"SUPPORT",desc:"Accompagnement des utilisateurs et demandes.",tone:"support",permissions:["Voir les utilisateurs","Demandes clients","Répondre aux demandes","Pas d'édition du site"]}
};

export default function AdminUsers({embedded=false}){
 const [users,setUsers]=useState([]),[staff,setStaff]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[saving,setSaving]=useState(""),[role,setRole]=useState({}),[query,setQuery]=useState(""),[filter,setFilter]=useState("all"),[open,setOpen]=useState(null);
 async function load(){setLoading(true);setError("");try{const [u,s]=await Promise.all([fetch("/api/admin/users"),fetch("/api/admin/staff")]);const uj=await u.json(),sj=await s.json();if(!u.ok)throw new Error(uj.error||"Erreur");if(!s.ok)throw new Error(sj.error||"Erreur");setUsers(uj.users||[]);setStaff(sj.staff||[]);const map={};(sj.staff||[]).forEach(x=>map[x.user_id]=x.role);setRole(map)}catch(e){setError(e.message||"Erreur réseau")}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 const staffMap=useMemo(()=>Object.fromEntries(staff.map(x=>[x.user_id,x])),[staff]);
 const counts=useMemo(()=>({all:users.length,staff:staff.length,owners:staff.filter(x=>x.role==="owner").length,admins:staff.filter(x=>x.role==="admin").length,editors:staff.filter(x=>x.role==="editor").length,support:staff.filter(x=>x.role==="support").length}),[users,staff]);
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return users.filter(u=>{const s=staffMap[u.user_id];const matchesFilter=filter==="all"||(filter==="users"&&!s)||(filter==="staff"&&!!s)||(s?.role===filter);const hay=[u.full_name,u.email,u.provider,s?.role].filter(Boolean).join(" ").toLowerCase();return matchesFilter&&(!q||hay.includes(q))})},[users,staffMap,query,filter]);
 async function assign(user){setSaving(user.user_id);setError("");try{const selected=role[user.user_id]||"support";const r=await fetch("/api/admin/staff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:user.user_id,role:selected})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Impossible");setStaff(s=>[...s.filter(x=>x.user_id!==user.user_id),j.staff]);setOpen(null)}catch(e){setError(e.message)}finally{setSaving("")}}
 async function remove(user){if(!confirm(`Retirer les droits staff de ${user.full_name||user.email} ?`))return;setSaving(user.user_id);setError("");try{const r=await fetch("/api/admin/staff",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:user.user_id})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Impossible");setStaff(s=>s.filter(x=>x.user_id!==user.user_id));setRole(m=>({...m,[user.user_id]:""}));setOpen(null)}catch(e){setError(e.message)}finally{setSaving("")}}
 const content=<>
  <div className="adminSectionHeading usersHeading"><div><span className="sectionTag">UTILISATEURS & STAFF</span><h2>Les comptes <span>Nexora.</span></h2><p>Un espace clair pour voir les comptes, les rôles et les accès de chaque membre.</p></div><div className="usersHeaderCount"><Users size={17}/><strong>{counts.all}</strong><span>comptes</span></div></div>
  <div className="userStats">
   {[['all','Tous',counts.all,Users],['staff','Staff',counts.staff,ShieldCheck],['admin','Admins',counts.admins,KeyRound],['editor','Éditeurs',counts.editors,CheckCircle2],['support','Support',counts.support,Clock3]].map(([key,label,count,Icon])=><button key={key} className={filter===key?"active":""} onClick={()=>setFilter(key)}><Icon size={15}/><span>{label}</span><strong>{count}</strong></button>)}
  </div>
  <div className="usersToolbar"><label className="usersSearch"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un nom ou une adresse e-mail…"/></label><span>{filtered.length} résultat{filtered.length>1?"s":""}</span></div>
  <div className="staffLegend">{Object.entries(roles).map(([k,v])=><button type="button" key={k} className={`roleLegend ${v.tone}`} onClick={()=>setFilter(k)}><span className="roleLegendDot"/><div><b>{v.label}</b><small>{v.desc}</small></div></button>)}</div>
  {error&&<p className="authError">{error}</p>}
  {loading?<div className="adminEmpty"><LoaderCircle className="spin"/> Chargement des comptes…</div>:filtered.length===0?<div className="emptyState"><UserRound size={30}/><h2>Aucun compte trouvé</h2><p>Modifiez votre recherche ou votre filtre.</p></div>:<div className="usersGrid">{filtered.map(u=>{const s=staffMap[u.user_id],r=s?.role?roles[s.role]:null,isOpen=open===u.user_id;return <article className={`userCard staffUser ${isOpen?"expanded":""}`} key={u.user_id}>
   <div className="userAvatar"><Users size={19}/></div>
   <div className="userMain"><div className="userNameLine"><h2>{u.full_name||u.email?.split("@")[0]||"Utilisateur"}</h2>{s?<span className={`rolePill ${r?.tone||""}`}><ShieldCheck size={11}/>{r?.label||s.role}</span>:<span className="rolePill user"><UserRound size={11}/>Utilisateur</span>}</div><p>{u.email}</p><span>{u.provider||"email"} · inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR")}</span></div>
   <div className="staffControls">{s?.role==="owner"?<b className="adminBadge"><ShieldCheck size={13}/> PROPRIÉTAIRE</b>:<><select value={role[u.user_id]||""} onChange={e=>setRole(m=>({...m,[u.user_id]:e.target.value}))}><option value="">Utilisateur</option>{Object.entries(roles).filter(([k])=>k!=="owner").map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select><button className="primary small" onClick={()=>assign(u)} disabled={saving===u.user_id}><Save size={14}/>{saving===u.user_id?"…":s?"Enregistrer":"Ajouter au staff"}</button>{s&&<button className="dangerButton" onClick={()=>remove(u)} disabled={saving===u.user_id}><Trash2 size={14}/> Retirer</button>}</>}</div>
   <button type="button" className="userDetailsToggle" onClick={()=>setOpen(isOpen?null:u.user_id)}>{isOpen?"Masquer les accès":"Voir les accès"}<ChevronDown size={14} className={isOpen?"rotated":""}/></button>
   {isOpen&&<div className="userAccessPanel">{s&&r?<><div><span>Rôle actuel</span><strong className={`roleText ${r.tone}`}>{r.label}</strong></div><div className="accessPermissions"><span>Accès associés</span><div>{r.permissions.map(p=><em key={p}>{p}</em>)}</div></div></>:<div><span>Accès actuel</span><strong>Compte utilisateur standard</strong><small>Aucun accès au panneau d'administration.</small></div>}</div>}
  </article>})}</div>}
 </>;
 if(embedded)return <div className="adminSubpage">{content}</div>;
 return <main className="adminPage"><header className="adminTop"><div><span className="sectionTag">NEXORA ADMIN</span><h1>Les comptes <span>Nexora.</span></h1><p>Gérez les membres de l'équipe et leurs niveaux d'accès.</p></div><div className="adminActions"><Link href="/" className="secondary">Voir le site</Link><button className="secondary" onClick={async()=>{await createClient().auth.signOut();location.href="/admin/connexion"}}><LogOut size={15}/> Déconnexion</button></div></header><section className="adminWrap"><AdminControlNav active="users" />{content}</section></main>;
}
