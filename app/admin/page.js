"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Save, ShieldCheck, LogOut, GraduationCap, Wrench, Globe2, Sparkles, X, Upload, LoaderCircle, Trophy } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";
import Editor from "./EditorPanel";
import AdminUsers from "./users/page";
import AdminDemandes from "./demandes/page";
import AdminControlNav from "./AdminControlNav";

const empty={type:"formation",slug:"",title:"",name:"",full_name:"",category:"",level:"",icon:"✨",description:"",bullets:[],price:"",price_label:"",status:"",accent:"",url:"",image_url:"",active:true,sort_order:0};
const emptySubscription={slug:"",name:"",description:"",price:"",price_label:"",billing_period:"mois",features:[],highlighted:false,active:true,sort_order:0};
const labels={formation:"Formations",service:"Services",site:"Sites",subscription:"Abonnements"};
function ProjectsAdmin(){
 const [items,setItems]=useState([]),[editing,setEditing]=useState(null),[adding,setAdding]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(""),[form,setForm]=useState({slug:"",title:"",category:"",description:"",status:"Projet actif",accent:"",url:"",image_url:"",active:true,sort_order:0});
 async function load(){setLoading(true);setError("");const r=await fetch("/api/admin/projects");const j=await r.json();if(!r.ok)setError(j.error||"Erreur");else setItems(j.items||[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 function edit(x){setEditing(x.id);setAdding(false);setForm({...form,...x});window.scrollTo({top:0,behavior:"smooth"})}
 function add(){setEditing(null);setAdding(true);setForm({slug:"",title:"",category:"",description:"",status:"Projet actif",accent:"",url:"",image_url:"",active:true,sort_order:items.length+1});window.scrollTo({top:0,behavior:"smooth"})}
 async function save(e){e.preventDefault();setError("");const r=await fetch("/api/admin/projects",{method:editing?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(editing?{...form,id:editing}:form)});const j=await r.json();if(!r.ok){setError(j.error||"Impossible d’enregistrer");return}setEditing(null);setAdding(false);load()}
 async function remove(id){if(!confirm("Supprimer définitivement cette réalisation ?"))return;const r=await fetch("/api/admin/projects",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});const j=await r.json();if(!r.ok)setError(j.error||"Erreur");else load()}
 return <div className="projectsAdmin"><div className="adminHeader"><div><Trophy size={17}/><strong>Réalisations</strong><span>{items.length} projet(s)</span></div><button className="primary" onClick={add}><Plus size={16}/> Ajouter</button></div>
 {(editing!==null||adding)&&<form className="adminForm" onSubmit={save}><div className="adminFormTitle"><strong>{editing?"Modifier":"Ajouter"} — Réalisation</strong><button type="button" onClick={()=>{setEditing(null);setAdding(false)}}><X size={17}/></button></div><div className="adminFields">
 <label>Slug<input value={form.slug||""} onChange={e=>setForm({...form,slug:e.target.value})} required/></label><label>Titre<input value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})} required/></label><label>Catégorie<input value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>Statut<input value={form.status||""} onChange={e=>setForm({...form,status:e.target.value})}/></label><label>Accent<input value={form.accent||""} onChange={e=>setForm({...form,accent:e.target.value})}/></label><label>Ordre<input type="number" value={form.sort_order??0} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label><label className="wide">Description<textarea rows="4" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>URL du projet<input type="url" value={form.url||""} onChange={e=>setForm({...form,url:e.target.value})}/></label><label>Image de la réalisation<input type="url" value={form.image_url||""} onChange={e=>setForm({...form,image_url:e.target.value})}/></label><ProjectImageUpload onUploaded={v=>setForm(x=>({...x,image_url:v}))}/>{form.image_url&&<div className="projectAdminImagePreview"><img src={form.image_url} alt="Aperçu de la réalisation"/></div>}<label className="check"><input type="checkbox" checked={form.active!==false} onChange={e=>setForm({...form,active:e.target.checked})}/> Visible sur le site</label>
 </div><button className="primary" type="submit"><Save size={16}/> Enregistrer</button></form>}
 {error&&<div className="authError">{error}</div>}
 {loading?<p className="adminEmpty">Chargement…</p>:<div className="adminList">{items.map(x=><article className="adminItem" key={x.id}><div className="adminItemIcon">🏆</div><div className="adminItemBody"><div><span>{x.category||"RÉALISATION"}</span>{x.active===false&&<em>Masqué</em>}</div><h2>{x.title}</h2><p>{x.description}</p><strong>{x.status||"Projet"}</strong></div><div className="adminItemButtons"><button onClick={()=>edit(x)} aria-label="Modifier"><Pencil size={16}/></button><button onClick={()=>remove(x.id)} aria-label="Supprimer"><Trash2 size={16}/></button></div></article>)}</div>}
 </div>
}

export default function Admin(){
 const [items,setItems]=useState([]); const [subscriptions,setSubscriptions]=useState([]); const [tab,setTab]=useState("formation"); const [panel,setPanel]=useState("catalog"); const [editing,setEditing]=useState(null); const [adding,setAdding]=useState(false); const [form,setForm]=useState(empty); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
 async function load(){setLoading(true);setError(""); const [r,sr]=await Promise.all([fetch("/api/admin/catalog"),fetch("/api/admin/subscriptions")]); const j=await r.json(); const sj=await sr.json(); if(!r.ok){setError(j.error||"Erreur catalogue");}else setItems(j.items||[]); if(!sr.ok){setError(sj.error||"Erreur abonnements");}else setSubscriptions(sj.items||[]); setLoading(false);}
 useEffect(()=>{load()},[]);
 const visible=useMemo(()=>tab==="subscription"?subscriptions:items.filter(x=>x.type===tab),[items,subscriptions,tab]);
 function edit(item){setAdding(false);setEditing(item.id);setForm(tab==="subscription"?{...emptySubscription,...item,features:Array.isArray(item.features)?item.features:[]}:{...empty,...item,bullets:Array.isArray(item.bullets)?item.bullets:[]}); window.scrollTo({top:0,behavior:"smooth"});}
 function add(){if(tab==="subscription"&&subscriptions.length>=5){setError("Nexora est limité à 5 abonnements. Supprimez ou modifiez une formule existante avant d’en créer une nouvelle.");return;} setError("");setEditing(null);setAdding(true);setForm(tab==="subscription"?{...emptySubscription,sort_order:visible.length+1}:{...empty,type:tab,sort_order:visible.length+1});window.scrollTo({top:0,behavior:"smooth"});}
 async function save(e){e.preventDefault();setError("");const isSubscription=tab==="subscription";const method=editing?"PATCH":"POST";const payload=editing?{...form,id:editing}:form;const r=await fetch(isSubscription?"/api/admin/subscriptions":"/api/admin/catalog",{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok){setError(j.error||"Impossible d’enregistrer");return;}setEditing(null);setAdding(false);setForm(isSubscription?emptySubscription:empty);load();}
 async function remove(id){if(!confirm("Supprimer définitivement cet élément ?"))return;const isSubscription=tab==="subscription";const r=await fetch(isSubscription?"/api/admin/subscriptions":"/api/admin/catalog",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});const j=await r.json();if(!r.ok)setError(j.error||"Erreur");else load();}
 async function logout(){await createClient().auth.signOut();location.href="/admin/connexion"}
 return <main className="adminPage"><header className="adminTop"><div><span className="sectionTag">NEXORA ADMIN</span><h1>Panneau de <span>contrôle.</span></h1><p>Gérez tout votre site depuis un seul espace.</p></div><div className="adminActions"><Link href="/" className="secondary">Voir le site</Link><button className="secondary" onClick={logout}><LogOut size={15}/> Déconnexion</button></div></header>
 <section className="adminWrap">
  <AdminControlNav active={panel} onPanelChange={setPanel} />
  {panel==="editor"?<Editor />:panel==="projects"?<ProjectsAdmin />:panel==="users"?<AdminUsers embedded />:panel==="requests"?<AdminDemandes embedded />:<>
  <div className="adminTabs">{[["formation",GraduationCap],["service",Wrench],["site",Globe2],["subscription",Sparkles]].map(([key,Icon])=><button key={key} className={tab===key?"active":""} onClick={()=>{setTab(key);setEditing(null);setAdding(false);setError("");setForm(key==="subscription"?emptySubscription:{...empty,type:key})}}><Icon size={16}/>{labels[key]}</button>)}</div>
  <div className="adminHeader"><div><ShieldCheck size={17}/><strong>{labels[tab]}</strong><span>{visible.length} élément(s){tab==="subscription"?" · maximum 5":""}</span></div><button className="primary" onClick={add}><Plus size={16}/> Ajouter</button></div>
  {(editing!==null || adding) && <form className="adminForm" onSubmit={save}><div className="adminFormTitle"><strong>{editing?"Modifier":"Ajouter"} — {labels[tab]}</strong><button type="button" onClick={()=>{setEditing(null);setAdding(false);setForm({...empty,type:tab})}}><X size={17}/></button></div>
   {tab==="subscription"?<div className="adminFields">
    <label>Slug<input value={form.slug||""} onChange={e=>setForm({...form,slug:e.target.value})} required/></label>
    <label>Nom de l'abonnement<input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} required/></label>
    <label>Période<input value={form.billing_period||"mois"} onChange={e=>setForm({...form,billing_period:e.target.value})}/></label>
    <label>Prix (€)<input type="number" step="0.01" value={form.price??""} onChange={e=>setForm({...form,price:e.target.value})}/></label>
    <label>Prix affiché<input value={form.price_label||""} onChange={e=>setForm({...form,price_label:e.target.value})}/></label>
    <label>Ordre<input type="number" value={form.sort_order??0} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label>
    <label className="wide">Description<textarea value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} rows="4"/></label>
    <label className="wide">Avantages (un par ligne)<textarea value={(form.features||[]).join("\n")} onChange={e=>setForm({...form,features:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})} rows="5"/></label>
    <label className="check"><input type="checkbox" checked={form.highlighted===true} onChange={e=>setForm({...form,highlighted:e.target.checked})}/> Mettre en avant comme formule recommandée</label>
    <label className="check"><input type="checkbox" checked={form.active!==false} onChange={e=>setForm({...form,active:e.target.checked})}/> Visible sur le site</label>
   </div>:<div className="adminFields"><label>Slug<input value={form.slug||""} onChange={e=>setForm({...form,slug:e.target.value})} required/></label><label>{tab==="site"?"Nom":"Titre"}<input value={(tab==="site"?form.name:form.title)||""} onChange={e=>setForm({...form,[tab==="site"?"name":"title"]:e.target.value})} required/></label><label>Icône<input value={form.icon||""} onChange={e=>setForm({...form,icon:e.target.value})}/></label><label>Ordre<input type="number" value={form.sort_order??0} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label>
   {tab==="formation"&&<><label>Catégorie<input value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>Niveau<input value={form.level||""} onChange={e=>setForm({...form,level:e.target.value})}/></label><label>Prix (€)<input type="number" step="0.01" value={form.price??""} onChange={e=>setForm({...form,price:e.target.value})}/></label></>}
   {tab!=="formation"&&<label>Prix affiché<input value={form.price_label||""} onChange={e=>setForm({...form,price_label:e.target.value})}/></label>}
   {tab==="service" && (<>
    <label>Image du service (URL)<input type="url" value={form.image_url||""} onChange={e=>setForm({...form,image_url:e.target.value})}/></label>
    <ServiceImageUpload onUploaded={v=>setForm(x=>({...x,image_url:v}))}/>
    {form.image_url && <div className="projectAdminImagePreview"><img src={form.image_url} alt="Aperçu du service"/></div>}
   </>)}
   {tab==="site"&&<><label>Nom complet<input value={form.full_name||""} onChange={e=>setForm({...form,full_name:e.target.value})}/></label><label>Type<input value={form.category||form.typeLabel||""} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>URL<input type="url" value={form.url||""} onChange={e=>setForm({...form,url:e.target.value})}/></label><label>Image (URL)<input type="url" value={form.image_url||""} onChange={e=>setForm({...form,image_url:e.target.value})}/><SiteImageUpload onUploaded={v=>setForm(x=>({...x,image_url:v}))}/></label><label>Statut<input value={form.status||""} onChange={e=>setForm({...form,status:e.target.value})}/></label><label>Accent<input value={form.accent||""} onChange={e=>setForm({...form,accent:e.target.value})}/></label></>}
   <label className="wide">Description<textarea value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} rows="4"/></label>
   {tab==="formation"&&<label className="wide">Modules (un par ligne)<textarea value={(form.bullets||[]).join("\n")} onChange={e=>setForm({...form,bullets:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})} rows="5"/></label>}
   <label className="check"><input type="checkbox" checked={form.active!==false} onChange={e=>setForm({...form,active:e.target.checked})}/> Visible sur le site</label>
   </div>}
   <button className="primary" type="submit"><Save size={16}/> Enregistrer</button></form>}
  {error&&<div className="authError">{error}</div>}
  {loading?<p className="adminEmpty">Chargement…</p>:<div className="adminList">{visible.map(item=><article className="adminItem" key={item.id||item.slug}><div className="adminItemIcon">{tab==="subscription"?"✦":(item.icon||"✨")}</div><div className="adminItemBody"><div><span>{tab==="subscription"?"ABONNEMENT":(item.category||item.type)}</span>{item.active===false&&<em>Masqué</em>}{tab==="subscription"&&item.highlighted&&<em>Recommandé</em>}</div><h2>{item.title||item.name}</h2><p>{item.description}</p><strong>{tab==="formation"&&item.price!=null?`${Number(item.price).toFixed(2).replace(".",",")} €`:tab==="subscription"&&item.price!=null?`${Number(item.price).toFixed(2).replace(".",",")} € / ${item.billing_period||"mois"}`:item.price_label||item.url||"—"}</strong></div><div className="adminItemButtons"><button onClick={()=>edit(item)} aria-label="Modifier"><Pencil size={16}/></button><button onClick={()=>remove(item.id)} aria-label="Supprimer"><Trash2 size={16}/></button></div></article>)}</div>}
 </>}
 </section></main>
}


function ServiceImageUpload({onUploaded}){
 const [loading,setLoading]=useState(false),[error,setError]=useState("");
 async function upload(e){
   const file=e.target.files?.[0];
   if(!file)return;
   if(!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)){setError("PNG, JPG, WEBP ou GIF uniquement.");return}
   if(file.size>8*1024*1024){setError("Image trop lourde (8 Mo maximum).");return}
   setLoading(true);setError("");
   try{
     const s=createClient();
     const ext=file.name.split(".").pop()?.toLowerCase()||"png";
     const path=`catalog/services/${crypto.randomUUID()}.${ext}`;
     const {error:up}=await s.storage.from("nexora-media").upload(path,file,{contentType:file.type,upsert:false});
     if(up)throw up;
     const {data}=s.storage.from("nexora-media").getPublicUrl(path);
     onUploaded(data.publicUrl)
   }catch(e){setError(e.message||"Upload impossible")}
   finally{setLoading(false);e.target.value=""}
 }
 return <label className="imageUpload">
   {loading?<><LoaderCircle className="spin" size={14}/> Téléversement…</>:<><Upload size={14}/> Importer une image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload}/></>}
   {error&&<small>{error}</small>}
 </label>
}

function ProjectImageUpload({onUploaded}){const [loading,setLoading]=useState(false),[error,setError]=useState("");async function upload(e){const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){setError("Sélectionnez une image.");return}if(file.size>8*1024*1024){setError("Image trop lourde (8 Mo maximum).");return}setLoading(true);setError("");try{const s=createClient();const ext=file.name.split(".").pop()?.toLowerCase()||"png";const path=`catalog/projects/${crypto.randomUUID()}.${ext}`;const {error:up}=await s.storage.from("nexora-media").upload(path,file,{contentType:file.type,upsert:false});if(up)throw up;const {data}=s.storage.from("nexora-media").getPublicUrl(path);onUploaded(data.publicUrl)}catch(e){setError(e.message||"Upload impossible")}finally{setLoading(false);e.target.value=""}}return <label className="imageUpload">{loading?<><LoaderCircle className="spin" size={14}/> Téléversement…</>:<><Upload size={14}/> Importer une image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload}/></>}{error&&<small>{error}</small>}</label>}

function SiteImageUpload({onUploaded}){const [loading,setLoading]=useState(false),[error,setError]=useState("");async function upload(e){const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){setError("Sélectionnez une image.");return}setLoading(true);setError("");try{const s=createClient();const ext=file.name.split(".").pop()?.toLowerCase()||"png";const path=`catalog/sites/${crypto.randomUUID()}.${ext}`;const {error:up}=await s.storage.from("nexora-media").upload(path,file,{contentType:file.type,upsert:false});if(up)throw up;const {data}=s.storage.from("nexora-media").getPublicUrl(path);onUploaded(data.publicUrl)}catch(e){setError(e.message||"Upload impossible")}finally{setLoading(false)}}return <label className="imageUpload">{loading?<><LoaderCircle className="spin" size={14}/> Téléversement…</>:<><Upload size={14}/> Importer une image<input type="file" accept="image/*" onChange={upload}/></>}{error&&<small>{error}</small>}</label>}
