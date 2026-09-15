"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Circle, Clock3, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const KEY="nexora_academy_progress_v1";

export default function AcademyPanel({formations=[]}){
  const [progress,setProgress]=useState({});
  useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw)setProgress(JSON.parse(raw));}catch{}},[]);
  const save=(next)=>{setProgress(next);try{localStorage.setItem(KEY,JSON.stringify(next));}catch{}};
  const get=(slug,total)=>Math.max(0,Math.min(total,Number(progress[slug])||0));
  const totalModules=formations.reduce((n,f)=>n+(f.bullets||[]).length,0);
  const completed=formations.reduce((n,f)=>n+get(f.slug,(f.bullets||[]).length),0);
  const overall=totalModules?Math.round((completed/totalModules)*100):0;
  const active=useMemo(()=>formations.filter(f=>get(f.slug,(f.bullets||[]).length)>0 && get(f.slug,(f.bullets||[]).length)<(f.bullets||[]).length),[formations,progress]);
  function mark(slug,total,delta){const current=get(slug,total);const next=Math.max(0,Math.min(total,current+delta));save({...progress,[slug]:next});}
  function reset(){if(confirm("Réinitialiser toute la progression Academy ?"))save({});}
  return <section className="academyWrap">
    <div className="academyOverview"><div className="academyOverviewMain"><span className="sectionTag">MON PARCOURS</span><h2>{overall}% <span>de progression</span></h2><p>{completed} module{completed>1?"s":""} terminé{completed>1?"s":""} sur {totalModules}. La progression est enregistrée sur cet appareil.</p><div className="academyProgress"><i style={{width:`${overall}%`}}/></div></div><div className="academyOverviewStats"><div><BookOpen size={18}/><strong>{formations.length}</strong><span>formations</span></div><div><Trophy size={18}/><strong>{completed}</strong><span>modules validés</span></div><div><Clock3 size={18}/><strong>{active.length}</strong><span>en cours</span></div></div></div>
    <div className="academyHead"><div><span className="sectionTag">MES FORMATIONS</span><h2>Construisez votre parcours</h2></div><button className="academyReset" onClick={reset}><RotateCcw size={14}/> Réinitialiser</button></div>
    <div className="academyGrid">{formations.map(f=>{const total=(f.bullets||[]).length;const done=get(f.slug,total);const pct=total?Math.round(done/total*100):0;return <article className="academyCard" key={f.slug}><div className="academyCardTop"><span className="academyIcon">{f.icon||"◈"}</span><span className="academyPct">{pct}%</span></div><div className="cardMeta"><span>{f.category||"Formation"}</span><span>{f.level||"Progressif"}</span></div><h3>{f.title}</h3><p>{f.description||f.desc}</p><div className="academyMiniProgress"><i style={{width:`${pct}%`}}/></div><div className="academyModules"><strong>{done}/{total}</strong> modules terminés</div><div className="academyLessons">{(f.bullets||[]).slice(0,5).map((lesson,i)=><div key={lesson} className={i<done?"done":""}>{i<done?<CheckCircle2 size={15}/>:<Circle size={15}/>}<span>{lesson}</span></div>)}</div><div className="academyActions"><button onClick={()=>mark(f.slug,total,done<total?1:-done)}>{done<total?"Valider le prochain":"Recommencer"}</button><Link href={`/formations/${f.slug}`}>Programme <ArrowRight size={15}/></Link></div></article>})}</div>
    <div className="academyTip"><CheckCircle2 size={18}/><div><strong>Votre progression vous appartient</strong><p>Vous pouvez valider les modules depuis cette page. Pour une synchronisation entre appareils et un suivi pédagogique complet, la prochaine évolution pourra enregistrer la progression dans votre compte Nexora.</p></div></div>
  </section>;
}
