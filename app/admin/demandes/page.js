"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {CheckCircle2,Clock3,Inbox,LoaderCircle,MessageCircle,Send,ShieldCheck, XCircle,LogOut} from "lucide-react";
import {createClient} from "../../../lib/supabase/client";
import AdminControlNav from "../AdminControlNav";

const STATUS={
 new:{label:"Nouvelle",desc:"La demande vient d'arriver.",icon:Inbox},
 in_progress:{label:"En cours",desc:"La demande est actuellement traitée.",icon:Clock3},
 answered:{label:"Répondue",desc:"Nexora a envoyé une réponse.",icon:MessageCircle},
 closed:{label:"Clôturée",desc:"Cette demande est terminée.",icon:CheckCircle2}
};
const ORDER=["new","in_progress","answered","closed"];
const FILTERS=["all",...ORDER];

function StatusBadge({status}){const s=STATUS[status]||STATUS.new;const Icon=s.icon;return <span className={`requestStatus ${status}`}><Icon size={13}/>{s.label}</span>}
function StatusTimeline({status,admin=false,onChange}){const current=Math.max(0,ORDER.indexOf(status));return <div className={`statusTimeline ${admin?"adminTimeline":""}`}>
 {ORDER.map((key,i)=>{const s=STATUS[key],Icon=s.icon,done=i<=current,active=i===current;return <div className={`statusStep ${done?"done":""} ${active?"active":""}`} key={key}>
   <div className="statusDot"><Icon size={14}/></div><div className="statusStepText"><strong>{s.label}</strong><span>{s.desc}</span></div>
   {i<ORDER.length-1&&<div className={`statusLine ${i<current?"filled":""}`}/>} 
   {admin&&<button type="button" className="statusStepButton" onClick={()=>onChange?.(key)}>{active?"Actuel":"Passer ici"}</button>}
 </div>})}
 </div>}

export default function AdminDemandes({embedded=false}){
 const [requests,setRequests]=useState([]),[messages,setMessages]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[text,setText]=useState({}),[filter,setFilter]=useState("all"),[updating,setUpdating]=useState("");
 async function load(){setLoading(true);setError("");const r=await fetch("/api/admin/demandes");const j=await r.json();if(!r.ok)setError(j.error||"Erreur");else{setRequests(j.requests||[]);setMessages(j.messages||[])}setLoading(false)}
 useEffect(()=>{load()},[]);
 async function reply(id){if(!text[id]?.trim())return;setUpdating(id);const r=await fetch("/api/admin/demandes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:id,message:text[id]})});const j=await r.json();if(!r.ok)setError(j.error||"Erreur");else{setText(x=>({...x,[id]:""}));await load()}setUpdating("")}
 async function status(id,value){setUpdating(id);const r=await fetch("/api/admin/demandes",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status:value})});const j=await r.json();if(!r.ok)setError(j.error||"Impossible de modifier le statut");else setRequests(x=>x.map(item=>item.id===id?{...item,...j.request}:item));setUpdating("")}
 const counts=useMemo(()=>Object.fromEntries(FILTERS.map(k=>[k,k==="all"?requests.length:requests.filter(r=>r.status===k).length])),[requests]);
 const filtered=filter==="all"?requests:requests.filter(r=>r.status===filter);
 const content=<>
  <div className="adminSectionHeading"><div><span className="sectionTag">DEMANDES CLIENTS</span><h2>Suivi des <span>demandes.</span></h2><p>Un suivi clair de chaque demande, de sa réception jusqu'à sa clôture.</p></div></div>
  <div className="requestStats">{FILTERS.map(k=><button key={k} type="button" className={filter===k?"active":""} onClick={()=>setFilter(k)}><span>{k==="all"?"Toutes":STATUS[k].label}</span><strong>{counts[k]}</strong></button>)}</div>
  {error&&<p className="authError">{error}</p>}
  {loading?<div className="adminEmpty"><LoaderCircle className="spin"/> Chargement…</div>:filtered.length===0?<div className="adminEmpty"><MessageCircle size={30}/> Aucune demande dans ce statut.</div>:<div className="requestList adminRequests">{filtered.map(r=>{
   const msgs=messages.filter(m=>m.request_id===r.id), busy=updating===r.id;
   return <article className="requestCard requestAdminCard" key={r.id}>
    <div className="requestHead"><div><span className="sectionTag">{r.request_type} · {r.email}</span><h2>{r.subject}</h2><p className="requestMeta">{r.name} · Reçue le {new Date(r.created_at).toLocaleString("fr-FR")} · Mise à jour le {new Date(r.updated_at||r.created_at).toLocaleString("fr-FR")}</p></div><StatusBadge status={r.status}/></div>
    <StatusTimeline status={r.status} admin onChange={v=>status(r.id,v)}/>
    <div className="requestAdminInfo"><div><span>STATUT ACTUEL</span><strong>{STATUS[r.status]?.label||r.status}</strong></div><div><span>MESSAGES</span><strong>{msgs.length}</strong></div><div><span>DERNIÈRE ACTION</span><strong>{r.status==="new"?"Réception":r.status==="answered"?"Réponse Nexora":r.status==="closed"?"Clôture":"Traitement"}</strong></div></div>
    <p className="requestOriginal">{r.message}</p>
    <div className="requestMessages">{msgs.map(m=><div className={`requestMessage ${m.sender_role}`} key={m.id}><b>{m.sender_role==="admin"?<><ShieldCheck size={12}/> Nexora</>:"Client"}</b><p>{m.message}</p><small>{new Date(m.created_at).toLocaleString("fr-FR")}</small></div>)}</div>
    {r.status!=="closed"?<div className="requestReply"><textarea rows="3" placeholder="Répondre au client…" value={text[r.id]||""} onChange={e=>setText(x=>({...x,[r.id]:e.target.value}))}/><button className="primary" disabled={busy||!text[r.id]?.trim()} onClick={()=>reply(r.id)}>{busy?<LoaderCircle className="spin" size={15}/>:<Send size={15}/>} Envoyer la réponse</button></div>:<div className="requestClosedNote"><CheckCircle2 size={16}/><span>Cette demande est clôturée. Vous pouvez la rouvrir en cliquant sur un autre statut.</span></div>}
   </article>})}</div>}
 </>;
 if(embedded)return <div className="adminSubpage">{content}</div>;
 return <main className="adminPage"><header className="adminTop"><div><span className="sectionTag">NEXORA ADMIN</span><h1>Suivi des <span>demandes.</span></h1><p>Gérez les statuts et répondez aux clients depuis votre espace administrateur.</p></div><div className="adminActions"><Link href="/" className="secondary">Voir le site</Link><button className="secondary" onClick={async()=>{await createClient().auth.signOut();location.href="/admin/connexion"}}><LogOut size={15}/> Déconnexion</button></div></header><section className="adminWrap"><AdminControlNav active="requests"/>{content}</section></main>;
}
