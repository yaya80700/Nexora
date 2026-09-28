"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, LockKeyhole, PlayCircle, Trophy } from "lucide-react";

export default function AcademyPanel({formations=[],enrollments=[]}){
  const active=enrollments.filter(x=>x.status!=="completed");
  const completed=enrollments.filter(x=>x.status==="completed");
  const total=active.reduce((n,x)=>n+(Number(x.module_count)||0),0)+completed.reduce((n,x)=>n+(Number(x.module_count)||0),0);
  const completedModules=enrollments.reduce((n,x)=>{
    const totalModules=Number(x.module_count)||0;
    return n+(x.status==="completed"?totalModules:Math.max(0,Math.min(totalModules,(Number(x.current_module)||1)-1)));
  },0);
  const overall=total?Math.round(completedModules/total*100):0;

  return <section className="academyWrap">
    <div className="academyOverview">
      <div className="academyOverviewMain">
        <span className="sectionTag">MON PARCOURS</span>
        <h2>{overall}% <span>de progression</span></h2>
        <p>{completedModules} module{completedModules>1?"s":""} validé{completedModules>1?"s":""} sur {total}. Votre progression est gérée et validée par l'équipe Nexora.</p>
        <div className="academyProgress"><i style={{width:`${overall}%`}}/></div>
      </div>
      <div className="academyOverviewStats">
        <div><BookOpen size={18}/><strong>{enrollments.length}</strong><span>formations activées</span></div>
        <div><Trophy size={18}/><strong>{completedModules}</strong><span>modules validés</span></div>
        <div><Clock3 size={18}/><strong>{active.length}</strong><span>en cours</span></div>
      </div>
    </div>

    <div className="academyHead"><div><span className="sectionTag">MES FORMATIONS</span><h2>Mon parcours de formation</h2></div></div>

    {!enrollments.length ? <div className="academyEmpty"><BookOpen size={24}/><h3>Aucune formation en cours</h3><p>Lorsqu'une formation vous est attribuée par l'équipe Nexora, elle apparaîtra ici avec votre module actuel et votre progression.</p><Link href="/contact">Demander une formation <ArrowRight size={15}/></Link></div> :
      <div className="academyGrid">{enrollments.map(e=>{
        const formation=formations.find(f=>f.slug===e.formation_slug);
        const modules=Array.isArray(formation?.bullets)?formation.bullets:[];
        const totalModules=Number(e.module_count)||modules.length;
        const current=Math.max(1,Math.min(totalModules,Number(e.current_module)||1));
        const isCompleted=e.status==="completed";
        const doneCount=isCompleted?totalModules:Math.max(0,current-1);
        const pct=totalModules?Math.round(doneCount/totalModules*100):0;
        const currentLabel=modules[current-1]||`Module ${current}`;
        return <article className="academyCard" key={e.id}>
          <div className="academyCardTop"><span className="academyIcon">{formation?.icon||"◈"}</span><span className={`academyStatus ${isCompleted?"complete":"current"}`}>{isCompleted?"FORMATION TERMINÉE":"EN FORMATION"}</span></div>
          <div className="cardMeta"><span>{formation?.category||"Formation"}</span><span>{formation?.level||"Progressif"}</span></div>
          <h3>{formation?.title||e.formation_title}</h3>
          <p>{formation?.description||"Votre parcours est suivi par l'équipe Nexora."}</p>
          <div className="academyMiniProgress"><i style={{width:`${pct}%`}}/></div>
          <div className="academyModules"><strong>{doneCount}/{totalModules}</strong> modules validés</div>
          <div className="academyCurrentModule"><div className="academyCurrentIcon">{isCompleted?<CheckCircle2 size={17}/>:<PlayCircle size={17}/>}</div><div><span>{isCompleted?"Parcours terminé":"MODULE ACTUEL"}</span><strong>{isCompleted?"Tous les modules sont validés.":currentLabel}</strong></div></div>
          <div className="academyLessons">{modules.map((lesson,i)=>{
            const state=isCompleted||i<doneCount?"done":i===current-1?"current":"locked";
            return <div key={`${e.id}-${i}`} className={state}><span className="academyLessonIcon">{state==="done"?<CheckCircle2 size={15}/>:state==="current"?<PlayCircle size={15}/>:<LockKeyhole size={14}/>}</span><span>{lesson}</span>{state==="current"&&<em>En cours</em>}</div>;
          })}</div>
          <div className="academyActions"><Link href={`/formations/${e.formation_slug}`}>Voir le programme <ArrowRight size={15}/></Link></div>
        </article>;
      })}</div>}

    <div className="academyTip"><LockKeyhole size={18}/><div><strong>Progression validée par Nexora</strong><p>Vous pouvez consulter votre avancement, mais la validation des modules et le passage au module suivant sont réservés à l'équipe Nexora.</p></div></div>
  </section>;
}
