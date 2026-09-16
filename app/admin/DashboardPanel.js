"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {Activity, ArrowUpRight, BriefcaseBusiness, Clock3, FolderKanban, GraduationCap, LoaderCircle, MessageCircle, Package, Sparkles, Users} from "lucide-react";

const STATUS={new:"Nouvelle",in_progress:"En cours",answered:"Répondue",closed:"Clôturée"};

function StatCard({icon:Icon,label,value,detail}){return <article className="dashboardStat"><div className="dashboardStatIcon"><Icon size={17}/></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>}
function RequestRow({item}){return <Link href="/admin" className="dashboardRequest"><div><span>{item.request_type||"Demande"}</span><strong>{item.subject||"Sans objet"}</strong><small>{item.name||item.email||"Client"} · {new Date(item.created_at).toLocaleDateString("fr-FR")}</small></div><b className={`requestStatus ${item.status||"new"}`}>{STATUS[item.status]||item.status||"Nouvelle"}</b></Link>}

export default function DashboardPanel(){
 const [data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 async function load(){setLoading(true);setError("");try{const r=await fetch("/api/admin/dashboard",{cache:"no-store"});const j=await r.json();if(!r.ok)throw new Error(j.error||"Impossible de charger le tableau de bord");setData(j)}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 if(loading)return <div className="dashboardLoading"><LoaderCircle className="spin" size={22}/> Chargement du tableau de bord…</div>;
 if(error)return <div className="authError">{error}</div>;
 const s=data.stats;
 return <div className="dashboardPanel">
   <div className="dashboardIntro"><div><span className="sectionTag">VUE D’ENSEMBLE</span><h2>Bienvenue dans votre <span>centre de contrôle.</span></h2><p>Retrouvez en un coup d’œil l’activité de Nexora et les derniers éléments à traiter.</p></div><button className="secondary" onClick={load}><Activity size={15}/> Actualiser</button></div>
   <div className="dashboardStatsGrid">
    <StatCard icon={Users} label="Utilisateurs" value={s.users} detail="comptes enregistrés"/>
    <StatCard icon={MessageCircle} label="Demandes" value={s.requests} detail={`${s.newRequests} nouvelle(s)`}/>
    <StatCard icon={Clock3} label="À traiter" value={s.inProgress+s.newRequests} detail={`${s.inProgress} en cours · ${s.newRequests} nouvelle(s)`}/>
    <StatCard icon={FolderKanban} label="Réalisations" value={s.projects} detail="projets visibles"/>
   </div>
   <div className="dashboardColumns">
    <section className="dashboardBox"><div className="dashboardBoxHead"><div><span className="sectionTag">ACTIVITÉ RÉCENTE</span><h3>Dernières demandes</h3></div><Link href="/admin" className="dashboardLink">Gérer <ArrowUpRight size={14}/></Link></div>
      {data.recentRequests.length?<div className="dashboardRequests">{data.recentRequests.map(x=><RequestRow item={x} key={x.id}/>)}</div>:<div className="dashboardEmpty"><MessageCircle size={22}/>Aucune demande pour le moment.</div>}
    </section>
    <section className="dashboardBox"><div className="dashboardBoxHead"><div><span className="sectionTag">CATALOGUE</span><h3>Contenu actif</h3></div><Link href="/admin" className="dashboardLink">Modifier <ArrowUpRight size={14}/></Link></div>
      <div className="dashboardMiniGrid"><div><W icon={BriefcaseBusiness} label="Services" value={s.services}/><W icon={GraduationCap} label="Formations" value={s.formations}/><W icon={Package} label="Sites" value={s.sites}/><W icon={Sparkles} label="Abonnements" value={s.subscriptions}/></div></div>
    </section>
   </div>
 </div>
}
function W({icon:Icon,label,value}){return <div className="dashboardMini"><span className="dashboardMiniIcon"><Icon size={15}/></span><span>{label}</span><strong>{value}</strong></div>}
