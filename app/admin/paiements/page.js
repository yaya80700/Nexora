"use client";
import {useEffect,useState} from "react";
import {CreditCard,Plus,Save,Trash2,ShoppingCart,ToggleLeft,ToggleRight} from "lucide-react";
import AdminControlNav from "../AdminControlNav";
export default function PaymentAdmin(){
 const [settings,setSettings]=useState({enabled:true}),[methods,setMethods]=useState([]),[orders,setOrders]=useState([]),[editing,setEditing]=useState(null),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState("");
 const empty={name:"",description:"",icon:"💳",mode:"manual",instructions:"",payment_url:"",active:true,sort_order:0};
 const [form,setForm]=useState(empty);
 async function load(){setLoading(true);const [a,b]=await Promise.all([fetch("/api/admin/store"),fetch("/api/admin/orders")]);const aj=await a.json(),bj=await b.json();if(a.ok){setSettings(aj.settings||{enabled:true});setMethods(aj.methods||[])}else setError(aj.error||"Erreur");if(b.ok)setOrders(bj.orders||[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 async function toggle(v){setSaving(true);const r=await fetch("/api/admin/store",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({settings:{enabled:v}})});const j=await r.json();if(r.ok)setSettings(j.settings);else setError(j.error||"Erreur");setSaving(false)}
 async function save(e){e.preventDefault();setSaving(true);setError("");const url=editing?"/api/admin/store":"/api/admin/store";const r=await fetch(url,{method:editing?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(editing?{...form,id:editing}:form)});const j=await r.json();if(!r.ok)setError(j.error||"Erreur");else{setEditing(null);setForm(empty);load()}setSaving(false)}
 async function remove(id){if(!confirm("Supprimer ce moyen de paiement ?"))return;const r=await fetch("/api/admin/store",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});if(!r.ok){const j=await r.json();setError(j.error||"Erreur")}else load()}
 async function status(id,status){const r=await fetch("/api/admin/orders",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});if(!r.ok){const j=await r.json();setError(j.error||"Erreur")}else load()}
 return <main className="adminPage"><header className="adminTop"><div><span className="sectionTag">NEXORA ADMIN</span><h1>Panier & <span>paiements.</span></h1><p>Le propriétaire contrôle entièrement le panier et les moyens de paiement.</p></div></header><section className="adminWrap"><AdminControlNav active="payments"/>
 <div className="paymentAdminHero"><div><ShoppingCart size={20}/><strong>Panier client</strong><span>{settings.enabled?"Activé":"Désactivé"}</span></div><button className={settings.enabled?"secondary dangerBtn":"primary"} onClick={()=>toggle(!settings.enabled)} disabled={saving}>{settings.enabled?<><ToggleRight/> Désactiver le panier</>:<><ToggleLeft/> Activer le panier</>}</button></div>
 {error&&<p className="authError">{error}</p>}
 <section className="adminSection"><div className="adminHeader"><div><CreditCard size={17}/><strong>Moyens de paiement</strong><span>{methods.length} configuré(s)</span></div><button className="primary" onClick={()=>{setEditing(null);setForm(empty)}}><Plus size={16}/> Ajouter</button></div>
 <p className="adminHint">Tout est configurable ici : nom, description, icône, mode, instructions, lien et activation. Aucun moyen n'est imposé par Nexora.</p>
 {(editing!==null||form===empty)&&null}
 <form className="adminForm paymentMethodForm" onSubmit={save}><div className="adminFormTitle"><strong>{editing?"Modifier":"Ajouter"} un moyen de paiement</strong></div><div className="adminFields">
 <label>Nom<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex. SumUp" required/></label>
 <label>Icône<input value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} placeholder="💳"/></label>
 <label>Mode<select value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}><option value="manual">Manuel</option><option value="link">Lien de paiement</option><option value="external">Service externe</option></select></label>
 <label>Ordre<input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label>
 <label className="wide">Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Courte présentation"/></label>
 <label className="wide">Lien de paiement<input value={form.payment_url} onChange={e=>setForm({...form,payment_url:e.target.value})} placeholder="https://..."/></label>
 <label className="wide">Instructions<textarea rows="3" value={form.instructions} onChange={e=>setForm({...form,instructions:e.target.value})} placeholder="Ce que le client doit faire après sa commande"/></label>
 <label className="checkRow"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Actif sur le site</label>
 </div><div className="adminFormActions"><button className="primary" disabled={saving}><Save size={15}/> Enregistrer</button></div></form>
 <div className="paymentMethodList">{methods.map(m=><article className={`paymentMethodRow ${m.active?"":"inactive"}`} key={m.id}><div className="paymentMethodIcon">{m.icon||"💳"}</div><div className="paymentMethodText"><strong>{m.name}</strong><small>{m.mode} · {m.active?"Actif":"Désactivé"}</small><p>{m.description||"Aucune description"}</p></div><div className="paymentMethodActions"><button className="secondary" onClick={()=>{setEditing(m.id);setForm({...m})}}>Modifier</button><button className="secondary" onClick={()=>remove(m.id)}><Trash2 size={14}/></button></div></article>)}</div>
 </section>
 <section className="adminSection"><div className="adminHeader"><div><ShoppingCart size={17}/><strong>Commandes</strong><span>{orders.length} récente(s)</span></div></div>{loading?<p>Chargement...</p>:<div className="ordersAdminList">{orders.map(o=><article className="orderAdminRow" key={o.id}><div><strong>#{String(o.id).slice(0,8)}</strong><small>{new Date(o.created_at).toLocaleString("fr-FR")} · {o.payment_methods?.name||"Moyen supprimé"}</small><p>{(o.order_items||[]).map(i=>`${i.title} × ${i.quantity}`).join(" · ")}</p></div><div><strong>{Number(o.total).toFixed(2).replace(".",",")} €</strong><select value={o.status} onChange={e=>status(o.id,e.target.value)}><option value="pending">En attente</option><option value="confirmed">Confirmée</option><option value="processing">En traitement</option><option value="completed">Terminée</option><option value="cancelled">Annulée</option></select></div></article>)}</div>}</section>
 </section></main>
}
