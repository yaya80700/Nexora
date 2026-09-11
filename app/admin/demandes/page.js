"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {createClient} from "../../../lib/supabase/client";
import {LoaderCircle,Send,MessageCircle,LogOut,UserCheck,Clock3,CheckCircle2,Archive,Inbox,UserRound,ChevronDown} from "lucide-react";
import AdminControlNav from "../AdminControlNav";

const STATUS={
 new:{label:"Nouvelle",icon:Inbox,cls:"new",hint:"À traiter"},
 in_progress:{label:"En cours",icon:Clock3,cls:"progress",hint:"Prise en charge"},
 answered:{label:"Répondue",icon:CheckCircle2,cls:"answered",hint:"En attente du client"},
 closed:{label:"Clôturée",icon:Archive,cls:"closed",hint:"Terminée"}
};

export default function AdminDemandes({embedded=false}){
 const [requests,setRequests]=useState([]),[messages,setMessages]=useState([]),[staff,setStaff]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[text,setText]=useState({}),[filter,setFilter]=useState("all"),[busy,setBusy]=useState("");
 async function load(){setLoading(true);setError("");try{const r=await fetch("/api/admin/demandes");const j=await r.json();if(!r.ok)throw new Error(j.error||"Erreur");setRequests(j.requests||[]);setMessages(j.messages||[]);setStaff(j.staff||[]);}catch(e){setError(e.message||"Erreur réseau")}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 async function updateRequest(id,patch){setBusy(id);setError("");try{const r=await fetch("/api/admin/demandes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,...patch})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Impossible de modifier la demande");await load()}catch(e){setError(e.message)}finally{setBusy("")}}
 async function reply(id){if(!text[id]?.trim())return;setBusy(id);setError("");try{const r=await fetch("/api/admin/demandes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:id,message:text[id]})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Erreur");setText(x=>({...x,[id]:""}));await load()}catch(e){setError(e.message)}finally{setBusy("")}}
 const counts=useMemo(()=>({all:requests.length,new:requests.filter(r=>r.status==="new").length,in_progress:requests.filter(r=>r.status==="in_progress").length,answered:requests.filter(r=>r.status==="answered").length,closed:requests.filter(r=>r.status==="closed").length}),[requests]);
 const visible=useMemo(()=>filter==="all"?requests:requests.filter(r=>r.status===filter),[requests,filter]);
 const content=<>
  <div className="adminSectionHeading"><div><span className="sectionTag">DEMANDES CLIENTS</span><h2>Les demandes <span>Nexora.</span></h2><p>Suivez chaque demande, son statut et la personne qui la prend en charge.</p></div></div>
  <div className="requestStats">{[["all","Toutes",MessageCircle],["new","Nouvelles",Inbox],["in_progress","En cours",Clock3],["answered","Répondues",CheckCircle2],["closed","Clôturées",Archive]].map(([key,label,Icon])=><button key={key} className={`requestStat ${filter===key?"active":""}`} onClick={()=>setFilter(key)}><Icon size={16}/><span><b>{counts[key]}</b>{label}</span></button>)}</div>
  {error&&<p className="authError">{error}</p>}
  {loading?<div className="adminEmpty"><LoaderCircle className="spin"/> Chargement…</div>:visible.length===0?<div className="adminEmpty"><MessageCircle size={30}/> Aucune demande dans cette catégorie.</div>:<div className="requestList adminRequests">{visible.map(r=>{const st=STATUS[r.status]||STATUS.new;const Icon=st.icon;const assigned=r.assigned_profile;const isBusy=busy===r.id;return <article className={`requestCard request-${st.cls}`} key={r.id}>
    <div className="requestStatusBar"><div className="requestStatusLabel"><Icon size={15}/><div><strong>{st.label}</strong><small>{st.hint}</small></div></div><select value={r.status} disabled={isBusy} onChange={e=>updateRequest(r.id,{status:e.target.value})}><option value="new">Nouvelle</option><option value="in_progress">En cours</option><option value="answered">Répondue</option><option value="closed">Clôturée</option></select></div>
    <div className="requestHead"><div><span className="sectionTag">{r.request_type} · {r.email}</span><h2>{r.subject}</h2><p className="requestMeta">{r.name} · créée le {new Date(r.created_at).toLocaleString("fr-FR")}</p></div></div>
    <div className="requestAssignment"><div className="assignmentInfo"><UserCheck size={17}/><div><span>PRISE EN CHARGE</span><strong>{assigned?.full_name||assigned?.email||"Non attribuée"}</strong>{r.assigned_at&&<small>depuis le {new Date(r.assigned_at).toLocaleString("fr-FR")}</small>}</div></div><div className="assignmentControls"><select value={r.assigned_to||""} disabled={isBusy} onChange={e=>updateRequest(r.id,{assigned_to:e.target.value||null})}><option value="">Non attribuée</option>{staff.map(s=><option key={s.user_id} value={s.user_id}>{s.full_name||s.email} · {s.role_label}</option>)}</select>{!r.assigned_to&&<button className="secondary small" disabled={isBusy} onClick={()=>updateRequest(r.id,{assigned_to:"__me__"})}><UserCheck size={14}/> Me l'attribuer</button>}</div></div>
    <p className="requestOriginal">{r.message}</p>
    <div className="requestMessages">{messages.filter(m=>m.request_id===r.id).map(m=><div className={`requestMessage ${m.sender_role}`} key={m.id}><b>{m.sender_role==="admin"?"Nexora":"Client"}</b><p>{m.message}</p><small>{new Date(m.created_at).toLocaleString("fr-FR")}</small></div>)}</div>
    <div className="requestReply"><textarea rows="3" placeholder="Répondre au client…" value={text[r.id]||""} onChange={e=>setText(x=>({...x,[r.id]:e.target.value}))}/><button className="primary" disabled={isBusy} onClick={()=>reply(r.id)}>{isBusy?<LoaderCircle className="spin" size={15}/>:<Send size={15}/>} Envoyer la réponse</button></div>
  </article>})}</div>}
 </>;
 if(embedded)return <div className="adminSubpage">{content}</div>;
 return <main className="adminPage"><header className="adminTop"><div><span className="sectionTag">NEXORA ADMIN</span><h1>Les demandes <span>Nexora.</span></h1><p>Consultez les demandes et répondez directement depuis votre compte administrateur.</p></div><div className="adminActions"><Link href="/" className="secondary">Voir le site</Link><button className="secondary" onClick={async()=>{await createClient().auth.signOut();location.href="/admin/connexion"}}><LogOut size={15}/> Déconnexion</button></div></header><section className="adminWrap"><AdminControlNav active="requests" />{content}</section></main>;
}
