"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {createClient} from "../../../lib/supabase/client";
import {ArrowLeft,Save,Plus,Trash2,GripVertical,Image as ImageIcon,Type,Heading,Link2,Minus,LoaderCircle,Upload} from "lucide-react";

const pages=["home","formations","services","sites","contact"];
const labels={home:"Accueil",formations:"Formations",services:"Nos services",sites:"Nos sites",contact:"Nous contacter"};
const block=(type="text")=>({id:crypto.randomUUID(),type,title:"",text:"",eyebrow:"",url:"",alt:"",href:"/contact",active:true});

export default function Editor(){
 const [page,setPage]=useState("home"),[data,setData]=useState({}),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(""),[ok,setOk]=useState("");
 useEffect(()=>{load()},[]);
 async function load(){setLoading(true);try{const r=await fetch("/api/admin/editor");const j=await r.json();if(!r.ok)throw new Error(j.error||"Erreur");const x={};(j.pages||[]).forEach(p=>x[p.page_key]=p.content||{});setData(x)}catch(e){setError(e.message||"Impossible de charger l'éditeur.")}finally{setLoading(false)}}
 const c=data[page]||{};
 const set=(key,val)=>setData(d=>({...d,[page]:{...(d[page]||{}),[key]:val}}));
 async function save(){setSaving(true);setError("");setOk("");try{const r=await fetch("/api/admin/editor",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({page_key:page,content:c})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Erreur");setOk("Modifications enregistrées. Actualisez le site pour les voir.")}catch(e){setError(e.message||"Impossible d'enregistrer")}finally{setSaving(false)}}
 function blocks(){return Array.isArray(c.customBlocks)?c.customBlocks:[]}
 function addBlock(type){set("customBlocks",[...blocks(),block(type)])}
 function updateBlock(id,key,val){set("customBlocks",blocks().map(b=>b.id===id?{...b,[key]:val}:b))}
 function delBlock(id){set("customBlocks",blocks().filter(b=>b.id!==id))}
 if(loading)return <main className="adminPage"><div className="adminEmpty"><LoaderCircle className="spin"/> Chargement de l'éditeur…</div></main>;
 return <main className="adminPage">
  <header className="adminTop"><div><Link href="/admin" className="editorBack"><ArrowLeft size={15}/> Admin</Link><span className="sectionTag">ÉDITEUR NEXORA</span><h1>Construisez le <span>site.</span></h1><p>Modifiez les pages sans toucher au code : textes, sections, boutons, cartes, catalogue et blocs libres.</p></div><div className="adminActions"><Link className="secondary" href="/">Voir le site</Link><button className="primary" onClick={save} disabled={saving}>{saving?<><LoaderCircle className="spin" size={16}/> Enregistrement</>:<><Save size={16}/> Enregistrer</>}</button></div></header>
  <section className="editorWrap">
   <div className="editorPageTabs">{pages.map(p=><button className={page===p?"active":""} key={p} onClick={()=>{setPage(p);setOk("");setError("")}}>{labels[p]}</button>)}</div>
   {error&&<p className="authError">{error}</p>}{ok&&<p className="successInline">{ok}</p>}
   <div className="editorCard"><div className="editorCardHead"><div><span className="sectionTag">PAGE</span><h2>{labels[page]}</h2></div><span className="editorHint">Tout ce qui est ici est sauvegardé dans Supabase.</span></div>
    {page==="home"&&<HomeEditor c={c} set={set}/>} 
    {page==="formations"&&<FormationsEditor c={c} set={set}/>} 
    {page==="services"&&<ServicesEditor c={c} set={set}/>} 
    {page==="sites"&&<SitesEditor c={c} set={set}/>} 
    {page==="contact"&&<ContactEditor c={c} set={set}/>} 
    <CustomBlocks page={page} blocks={blocks()} addBlock={addBlock} updateBlock={updateBlock} delBlock={delBlock}/>
   </div>
  </section>
 </main>
}

function HomeEditor({c,set}){return <>
 <Field label="Petit titre du hero" value={c.heroEyebrow} onChange={v=>set("heroEyebrow",v)}/>
 <div className="editorTwo"><Field label="Titre hero" value={c.heroTitle} onChange={v=>set("heroTitle",v)}/><Field label="Accent hero" value={c.heroAccent} onChange={v=>set("heroAccent",v)}/></div>
 <Field label="Texte hero" value={c.heroText} area onChange={v=>set("heroText",v)}/>
 <div className="editorTwo"><Field label="Bouton principal" value={c.primaryLabel} onChange={v=>set("primaryLabel",v)}/><Field label="Lien principal" value={c.primaryHref} onChange={v=>set("primaryHref",v)}/></div>
 <div className="editorTwo"><Field label="Second bouton" value={c.secondaryLabel} onChange={v=>set("secondaryLabel",v)}/><Field label="Lien secondaire" value={c.secondaryHref} onChange={v=>set("secondaryHref",v)}/></div>
 <ArrayEditor title="Arguments de confiance" values={c.trust||[]} onChange={v=>set("trust",v)}/>
 <div className="toggleGrid"><Toggle label="Afficher les statistiques" checked={c.showStats!==false} onChange={v=>set("showStats",v)}/><Toggle label="Afficher l'introduction" checked={c.showIntro!==false} onChange={v=>set("showIntro",v)}/><Toggle label="Afficher les blocs principaux" checked={c.showPillars!==false} onChange={v=>set("showPillars",v)}/><Toggle label="Afficher la section formations" checked={c.showFeature!==false} onChange={v=>set("showFeature",v)}/><Toggle label="Afficher le CTA final" checked={c.showCta!==false} onChange={v=>set("showCta",v)}/></div>
 <div className="editorTwo"><Field label="Intro — petit titre" value={c.introEyebrow} onChange={v=>set("introEyebrow",v)}/><Field label="Intro — titre" value={c.introTitle} onChange={v=>set("introTitle",v)}/></div><div className="editorTwo"><Field label="Intro — accent" value={c.introAccent} onChange={v=>set("introAccent",v)}/><Field label="Intro — texte" value={c.introText} area onChange={v=>set("introText",v)}/></div>
 <ArrayEditor title="Blocs principaux de l'accueil" values={c.pillars||[]} objectFields={["icon","title","text","href"]} onChange={v=>set("pillars",v)}/>
 <ArrayEditor title="Statistiques de l'accueil" values={c.stats||[]} objectFields={["value","label"]} onChange={v=>set("stats",v)}/>
 <div className="editorTwo"><Field label="Formation — petit titre" value={c.featureEyebrow} onChange={v=>set("featureEyebrow",v)}/><Field label="Formation — titre" value={c.featureTitle} onChange={v=>set("featureTitle",v)}/></div><div className="editorTwo"><Field label="Formation — accent" value={c.featureAccent} onChange={v=>set("featureAccent",v)}/><Field label="Formation — texte" value={c.featureText} area onChange={v=>set("featureText",v)}/></div>
 <div className="editorTwo"><Field label="CTA — petit titre" value={c.ctaEyebrow} onChange={v=>set("ctaEyebrow",v)}/><Field label="CTA — titre" value={c.ctaTitle} onChange={v=>set("ctaTitle",v)}/></div><div className="editorTwo"><Field label="CTA — accent" value={c.ctaAccent} onChange={v=>set("ctaAccent",v)}/><Field label="CTA — texte" value={c.ctaText} area onChange={v=>set("ctaText",v)}/></div>
 </>}

function FormationsEditor({c,set}){return <>
 <Field label="Petit titre" value={c.eyebrow} onChange={v=>set("eyebrow",v)}/><div className="editorTwo"><Field label="Titre" value={c.title} onChange={v=>set("title",v)}/><Field label="Accent" value={c.accent} onChange={v=>set("accent",v)}/></div><Field label="Description" value={c.text} area onChange={v=>set("text",v)}/>
 <div className="editorTwo"><Field label="Texte du nombre de formations" value={c.catalogCountLabel} onChange={v=>set("catalogCountLabel",v)}/><Field label="Sous-texte catalogue" value={c.catalogSubLabel} onChange={v=>set("catalogSubLabel",v)}/></div>
 <Toggle label="Afficher le catalogue des formations" checked={c.showCatalog!==false} onChange={v=>set("showCatalog",v)}/><Toggle label="Afficher le CTA final" checked={c.showCta!==false} onChange={v=>set("showCta",v)}/>
 <div className="editorTwo"><Field label="CTA — titre" value={c.ctaTitle} onChange={v=>set("ctaTitle",v)}/><Field label="CTA — texte" value={c.ctaText} area onChange={v=>set("ctaText",v)}/></div>
 <p className="editorNote"><b>Catalogue :</b> ajoutez, supprimez ou modifiez chaque formation depuis <b>Admin → Formations</b>. Le nombre réel de formations se recalcule automatiquement.</p>
 </>}

function ServicesEditor({c,set}){return <>
 <Field label="Petit titre" value={c.eyebrow} onChange={v=>set("eyebrow",v)}/><div className="editorTwo"><Field label="Titre" value={c.title} onChange={v=>set("title",v)}/><Field label="Accent" value={c.accent} onChange={v=>set("accent",v)}/></div><Field label="Description" value={c.text} area onChange={v=>set("text",v)}/>
 <div className="editorTwo"><Field label="Processus — petit titre" value={c.processEyebrow} onChange={v=>set("processEyebrow",v)}/><Field label="Processus — titre" value={c.processTitle} onChange={v=>set("processTitle",v)}/></div><Field label="Processus — accent" value={c.processAccent} onChange={v=>set("processAccent",v)}/>
 <Toggle label="Afficher le processus" checked={c.showProcess!==false} onChange={v=>set("showProcess",v)}/><Toggle label="Afficher les services" checked={c.showCatalog!==false} onChange={v=>set("showCatalog",v)}/><Toggle label="Afficher le CTA final" checked={c.showCta!==false} onChange={v=>set("showCta",v)}/>
 <ArrayEditor title="Étapes du processus" values={c.steps||[]} objectFields={["number","title","text"]} onChange={v=>set("steps",v)}/>
 <div className="editorTwo"><Field label="CTA — petit titre" value={c.ctaEyebrow} onChange={v=>set("ctaEyebrow",v)}/><Field label="CTA — titre" value={c.ctaTitle} onChange={v=>set("ctaTitle",v)}/></div><Field label="CTA — texte" value={c.ctaText} onChange={v=>set("ctaText",v)}/>
 <p className="editorNote"><b>Catalogue :</b> gérez les noms, icônes, descriptions, prix, ordre et visibilité depuis <b>Admin → Services</b>.</p>
 </>}

function SitesEditor({c,set}){return <>
 <Field label="Petit titre" value={c.eyebrow} onChange={v=>set("eyebrow",v)}/><div className="editorTwo"><Field label="Titre" value={c.title} onChange={v=>set("title",v)}/><Field label="Accent" value={c.accent} onChange={v=>set("accent",v)}/></div><Field label="Description" value={c.text} area onChange={v=>set("text",v)}/>
 <Toggle label="Afficher les sites" checked={c.showCatalog!==false} onChange={v=>set("showCatalog",v)}/><Toggle label="Afficher L'écosystème Nexora" checked={c.showEcosystem!==false} onChange={v=>set("showEcosystem",v)}/>
 <div className="editorTwo"><Field label="Écosystème — petit titre" value={c.ecoEyebrow} onChange={v=>set("ecoEyebrow",v)}/><Field label="Écosystème — titre" value={c.ecoTitle} onChange={v=>set("ecoTitle",v)}/></div><div className="editorTwo"><Field label="Écosystème — accent" value={c.ecoAccent} onChange={v=>set("ecoAccent",v)}/><Field label="Écosystème — texte" value={c.ecoText} area onChange={v=>set("ecoText",v)}/></div>
 <p className="editorNote"><b>Sites :</b> ajoutez/supprimez/modifiez les sites, leurs liens, descriptions et images depuis <b>Admin → Sites</b>.</p>
 </>}

function ContactEditor({c,set}){return <>
 <Field label="Petit titre" value={c.eyebrow} onChange={v=>set("eyebrow",v)}/><div className="editorTwo"><Field label="Titre" value={c.title} onChange={v=>set("title",v)}/><Field label="Accent" value={c.accent} onChange={v=>set("accent",v)}/></div><Field label="Description" value={c.text} area onChange={v=>set("text",v)}/>
 <div className="toggleGrid"><Toggle label="Afficher les coordonnées" checked={c.showContactInfo!==false} onChange={v=>set("showContactInfo",v)}/><Toggle label="Afficher le formulaire" checked={c.showForm!==false} onChange={v=>set("showForm",v)}/></div>
 <div className="editorTwo"><Field label="Bloc introduction — titre" value={c.leadTitle} onChange={v=>set("leadTitle",v)}/><Field label="Bloc introduction — texte" value={c.leadText} area onChange={v=>set("leadText",v)}/></div>
 <div className="editorTwo"><Field label="Email professionnel" value={c.email} onChange={v=>set("email",v)}/><Field label="Téléphone professionnel" value={c.phone} onChange={v=>set("phone",v)}/></div><Field label="Texte du bloc Chat" value={c.chatText} onChange={v=>set("chatText",v)}/>
 </>}

function Toggle({label,checked,onChange}){return <label className="toggleField"><input type="checkbox" checked={checked!==false} onChange={e=>onChange(e.target.checked)}/><span>{label}</span></label>}
function Field({label,value,onChange,area=false}){return <label className="editorField">{label}{area?<textarea rows={4} value={value||""} onChange={e=>onChange(e.target.value)}/>:<input value={value||""} onChange={e=>onChange(e.target.value)}/>}</label>}
function ArrayEditor({title,values,onChange,objectFields=[]}){const arr=Array.isArray(values)?values:[];function update(i,key,val){const n=[...arr];if(objectFields.length)n[i]={...n[i],[key]:val};else n[i]=val;onChange(n)}return <div className="arrayEditor"><div className="arrayHead"><strong>{title}</strong><button type="button" onClick={()=>onChange([...arr,objectFields.length?Object.fromEntries(objectFields.map(k=>[k,""])):""])}><Plus size={14}/> Ajouter</button></div>{arr.map((v,i)=><div className="arrayRow" key={i}>{objectFields.length?objectFields.map(k=><input key={k} placeholder={k} value={v?.[k]||""} onChange={e=>update(i,k,e.target.value)}/>):<input value={v||""} onChange={e=>update(i,null,e.target.value)}/>}<button type="button" onClick={()=>onChange(arr.filter((_,x)=>x!==i))}><Trash2 size={15}/></button></div>)}</div>}
function CustomBlocks({page,blocks,addBlock,updateBlock,delBlock}){return <div className="customEditor"><div className="arrayHead"><div><span className="sectionTag">BLOCS LIBRES</span><strong>Ajouter une zone personnalisée</strong></div><div className="blockAdd"><button type="button" onClick={()=>addBlock("heading")}><Heading size={14}/> Titre</button><button type="button" onClick={()=>addBlock("text")}><Type size={14}/> Texte</button><button type="button" onClick={()=>addBlock("image")}><ImageIcon size={14}/> Image</button><button type="button" onClick={()=>addBlock("button")}><Link2 size={14}/> Bouton</button><button type="button" onClick={()=>addBlock("divider")}><Minus size={14}/> Séparateur</button></div></div>{blocks.map((b,i)=><article className="blockEditor" key={b.id}><div className="blockBar"><GripVertical size={15}/><strong>Bloc {i+1} · {b.type}</strong><button type="button" onClick={()=>delBlock(b.id)}><Trash2 size={15}/></button></div>{b.type!=="divider"&&<div className="editorTwo"><Field label="Titre" value={b.title} onChange={v=>updateBlock(b.id,"title",v)}/><Field label="Petit titre" value={b.eyebrow} onChange={v=>updateBlock(b.id,"eyebrow",v)}/></div>}{b.type!=="divider"&&b.type!=="button"&&<Field label="Texte" value={b.text} area onChange={v=>updateBlock(b.id,"text",v)}/>} {b.type==="image"&&<div className="editorTwo"><Field label="URL de l'image" value={b.url} onChange={v=>updateBlock(b.id,"url",v)}/><Field label="Texte alternatif" value={b.alt} onChange={v=>updateBlock(b.id,"alt",v)}/><ImageUpload page={page} onUploaded={v=>updateBlock(b.id,"url",v)}/></div>} {b.type==="button"&&<Field label="Lien du bouton" value={b.href} onChange={v=>updateBlock(b.id,"href",v)}/>} {b.type!=="divider"&&<Toggle label="Afficher ce bloc" checked={b.active!==false} onChange={v=>updateBlock(b.id,"active",v)}/>}</article>)}</div>}
function ImageUpload({page,onUploaded}){const [loading,setLoading]=useState(false),[error,setError]=useState("");async function upload(e){const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){setError("Sélectionnez une image.");return}setLoading(true);setError("");try{const s=createClient();const ext=file.name.split(".").pop()?.toLowerCase()||"png";const path=`site/${page}/${crypto.randomUUID()}.${ext}`;const {error:up}=await s.storage.from("nexora-media").upload(path,file,{contentType:file.type,upsert:false});if(up)throw up;const {data}=s.storage.from("nexora-media").getPublicUrl(path);onUploaded(data.publicUrl)}catch(e){setError(e.message||"Upload impossible")}finally{setLoading(false)}}return <label className="imageUpload">{loading?<><LoaderCircle className="spin" size={14}/> Téléversement…</>:<><Upload size={14}/> Importer une image<input type="file" accept="image/*" onChange={upload}/></>}{error&&<small>{error}</small>}</label>}
