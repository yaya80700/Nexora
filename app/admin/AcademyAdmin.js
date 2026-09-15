"use client";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, GraduationCap, LockKeyhole, PlayCircle, Plus, RefreshCw, Trash2, Users } from "lucide-react";

export default function AcademyAdmin(){
  const [data,setData]=useState({users:[],formations:[],enrollments:[]});
  const [loading,setLoading]=useState(true),[error,setError]=useState(""),[saving,setSaving]=useState("");
  const [userId,setUserId]=useState(""),[formationSlug,setFormationSlug]=useState("");
  async function load(){
    setLoading(true);setError("");
    try{const r=await fetch("/api/admin/academy",{cache:"no-store"});const j=await r.json();if(!r.ok)throw Error(j.error||"Impossible de charger Academy");setData(j);}
    catch(e){setError(e.message||"Erreur réseau");}finally{setLoading(false)}
  }
  useEffect(()=>{load()},[]);
  const userMap=useMemo(()=>Object.fromEntries(data.users.map(x=>[x.user_id,x])),[data.users]);
  const formationMap=useMemo(()=>Object.fromEntries(data.formations.map(x=>[x.slug,x])),[data.formations]);
  const activeCount=data.enrollments.filter(x=>x.status!=="completed").length;
  const completedCount=data.enrollments.filter(x=>x.status==="completed").length;
  async function activate(e){
    e.preventDefault();setError("");
    if(!userId||!formationSlug)return setError("Sélectionnez un utilisateur et une formation.");
    setSaving("activate");
    try{const r=await fetch("/api/admin/academy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:userId,formation_slug:formationSlug})});const j=await r.json();if(!r.ok)throw Error(j.error||"Impossible d'activer la formation");setUserId("");setFormationSlug("");await load();}
    catch(e){setError(e.message||"Erreur");}finally{setSaving("")}
  }
  async function validate(enrollment){
    const total=Number(enrollment.module_count)||1,current=Number(enrollment.current_module)||1;
    const last=current>=total;
    if(!confirm(last?"Valider le dernier module et terminer cette formation ?":"Valider ce module et débloquer le suivant ?"))return;
    setSaving(enrollment.id);setError("");
    try{const r=await fetch("/api/admin/academy",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:enrollment.id})});const j=await r.json();if(!r.ok)throw Error(j.error||"Impossible de valider le module");await load();}
    catch(e){setError(e.message||"Erreur");}finally{setSaving("")}
  }
  async function remove(enrollment){
    const user=userMap[enrollment.user_id];
    if(!confirm(`Retirer la formation « ${enrollment.formation_title} » de ${user?.full_name||user?.email||"cet utilisateur"} ?`))return;
    setSaving(`delete:${enrollment.id}`);setError("");
    try{const r=await fetch("/api/admin/academy",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:enrollment.id})});const j=await r.json();if(!r.ok)throw Error(j.error||"Impossible de retirer la formation");await load();}
    catch(e){setError(e.message||"Erreur");}finally{setSaving("")}
  }
  return <div className="academyAdmin">
    <div className="adminSectionHeading academyAdminHeading"><div><span className="sectionTag">NEXORA ACADEMY</span><h2>Suivi des <span>formations.</span></h2><p>Les utilisateurs voient leur progression, mais seuls les membres autorisés du staff peuvent activer et valider les modules.</p></div><button className="secondary" onClick={load}><RefreshCw size={14}/> Actualiser</button></div>
    <div className="academyAdminStats"><div><Users size={17}/><strong>{data.users.length}</strong><span>comptes</span></div><div><PlayCircle size={17}/><strong>{activeCount}</strong><span>formations en cours</span></div><div><CheckCircle2 size={17}/><strong>{completedCount}</strong><span>formations terminées</span></div></div>
    <form className="academyAssign" onSubmit={activate}><div><GraduationCap size={19}/><div><span>ACTIVER UNE FORMATION</span><strong>Attribuer un parcours à un utilisateur</strong></div></div><div className="academyAssignFields"><label>Utilisateur<select value={userId} onChange={e=>setUserId(e.target.value)} required><option value="">Choisir un utilisateur…</option>{data.users.map(u=><option key={u.user_id} value={u.user_id}>{u.full_name||u.email} — {u.email}</option>)}</select></label><label>Formation<select value={formationSlug} onChange={e=>setFormationSlug(e.target.value)} required><option value="">Choisir une formation…</option>{data.formations.map(f=><option key={f.slug} value={f.slug}>{f.title||f.name} · {Array.isArray(f.bullets)?f.bullets.length:0} modules</option>)}</select></label><button className="primary" type="submit" disabled={saving==="activate"}>{saving==="activate"?<RefreshCw className="spin" size={15}/>:<Plus size={15}/>} Activer</button></div></form>
    {error&&<div className="authError">{error}</div>}
    <div className="academyAdminList"><div className="academyAdminListHead"><div><span className="sectionTag">SUIVI PÉDAGOGIQUE</span><h3>Formations des utilisateurs</h3></div><span>{data.enrollments.length} parcours</span></div>
      {loading?<p className="adminEmpty">Chargement…</p>:!data.enrollments.length?<div className="academyAdminEmpty"><LockKeyhole size={22}/><p>Aucune formation n'est encore activée.</p></div>:data.enrollments.map(e=>{
        const user=userMap[e.user_id],formation=formationMap[e.formation_slug];const total=Number(e.module_count)||0,current=Math.max(1,Math.min(total,Number(e.current_module)||1));const done=e.status==="completed"?total:Math.max(0,current-1);const pct=total?Math.round(done/total*100):0;const currentLesson=formation?.bullets?.[current-1]||`Module ${current}`;const last=current>=total;
        return <article className="academyAdminItem" key={e.id}><div className="academyAdminUser"><div className="academyAdminAvatar">{(user?.full_name||user?.email||"?").slice(0,1).toUpperCase()}</div><div><strong>{user?.full_name||"Utilisateur"}</strong><span>{user?.email||e.user_id}</span></div></div><div className="academyAdminCourse"><div><span>{formation?.category||"FORMATION"}</span><h4>{formation?.title||e.formation_title}</h4></div><div className="academyAdminProgress"><div><span>{done}/{total} modules</span><strong>{pct}%</strong></div><div><i style={{width:`${pct}%`}}/></div></div><div className="academyAdminCurrent">{e.status==="completed"?<><CheckCircle2 size={17}/><div><span>FORMATION TERMINÉE</span><strong>Tous les modules sont validés.</strong></div></>:<><PlayCircle size={17}/><div><span>MODULE ACTUEL</span><strong>{currentLesson}</strong></div></>}</div><div className="academyAdminActions">{e.status!=="completed"&&<button className="primary" onClick={()=>validate(e)} disabled={saving===e.id}>{saving===e.id?<RefreshCw className="spin" size={14}/>:<CheckCircle2 size={14}/>} {last?"Valider et terminer":"Valider le module"}</button>}<button className="adminDangerButton" onClick={()=>remove(e)} disabled={saving===`delete:${e.id}`}><Trash2 size={14}/> Retirer</button></div></article>;
      })}</div>
  </div>;
}
