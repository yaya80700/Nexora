"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, UserRound, Sparkles, ShoppingCart, Trash2, Minus, Plus, CreditCard, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

function badgeHue(value) {
  let hash = 0;
  for (let i = 0; i < String(value).length; i++) hash = ((hash << 5) - hash + String(value).charCodeAt(i)) | 0;
  return Math.abs(hash) % 360;
}

function Profil() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [store, setStore] = useState({enabled:true,methods:[]});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/connexion"; return; }
      setEmail(user.email || "");
      setName(user.user_metadata?.full_name || "");
      try {
        const res = await fetch("/api/account/subscription", { cache: "no-store" });
        const json = await res.json();
        if (res.ok) setSubscription(json.subscription || null);
      } catch {}
      try { const [raw, cfg] = await Promise.all([Promise.resolve(localStorage.getItem("nexora_cart")), fetch("/api/store/config",{cache:"no-store"})]); setCart(raw?JSON.parse(raw):[]); const cj=await cfg.json(); if(cfg.ok)setStore(cj); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  useEffect(()=>{const sync=()=>{try{setCart(JSON.parse(localStorage.getItem("nexora_cart")||"[]"))}catch{setCart([])}};window.addEventListener("nexora-cart-updated",sync);return()=>window.removeEventListener("nexora-cart-updated",sync)},[]);
  const cartTotal=cart.reduce((s,x)=>s+Number(x.price||0)*Number(x.quantity||1),0);
  function updateQty(i,delta){const next=cart.map((x,n)=>n===i?{...x,quantity:Math.max(1,Math.min(99,(x.quantity||1)+delta))}:x);setCart(next);localStorage.setItem("nexora_cart",JSON.stringify(next));}
  function removeItem(i){const next=cart.filter((_,n)=>n!==i);setCart(next);localStorage.setItem("nexora_cart",JSON.stringify(next));}
  async function checkout(){setOrderMessage("");setError("");if(!cart.length)return;if(!paymentMethod){setError("Choisissez un moyen de paiement.");return}setOrdering(true);try{const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart.map(x=>({type:x.type,slug:x.slug,quantity:x.quantity})),payment_method_id:Number(paymentMethod)})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Impossible de créer la commande.");localStorage.removeItem("nexora_cart");setCart([]);setOrderMessage(`Commande ${j.orderId} enregistrée. Total : ${Number(j.total).toFixed(2).replace(".",",")} €.`);if(j.paymentMethod?.payment_url)window.open(j.paymentMethod.payment_url,"_blank","noopener,noreferrer");}catch(e){setError(e.message||"Erreur")}finally{setOrdering(false)}}
  async function submit(e) {
    e.preventDefault(); setSaving(true); setMessage(""); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    if (error) setError(error.message);
    else setMessage("Vos informations ont bien été enregistrées.");
    setSaving(false);
  }

  if (loading) return <main><Header/><section className="authPage"><div className="authCard"><LoaderCircle className="spin" size={24}/></div></section><Footer/></main>;

  const subscriptionClass = subscription?.subscription_slug || "default";
  const badgeStyle = subscription ? { "--badge-hue": `${badgeHue(subscription.subscription_slug || subscription.subscription_name || "abonnement")}` } : undefined;

  return <main><Header/><section className="authPage"><div className="authCard">
    <div className="authIcon"><UserRound size={22}/></div><span className="sectionTag">MON PROFIL</span>
    <h1>Vos informations <span>Nexora.</span></h1>
    <p className="lead">Modifiez les informations visibles dans votre espace client.</p>

    <section className={`profileSubscriptionCard ${subscriptionClass}`} style={badgeStyle}>
      <div className="profileSubscriptionIcon"><Sparkles size={18}/></div>
      <div className="profileSubscriptionText">
        <span>ABONNEMENT NEXORA</span>
        {subscription ? <><strong>{subscription.subscription_name}</strong><small>Votre formule est actuellement active sur votre compte.{subscription.expires_at ? ` Expire le ${new Date(subscription.expires_at).toLocaleDateString("fr-FR")}.` : ""}</small></> : <><strong>Aucun abonnement</strong><small>Vous n’avez pas encore d’abonnement attribué.</small></>}
      </div>
      {subscription && <span className="profileSubscriptionBadge">✦ {subscription.subscription_name}</span>}
    </section>

    {store.enabled && <section className="profileCart" id="panier">
      <div className="profileCartHead"><div><span className="sectionTag">MON PANIER</span><h2><ShoppingCart size={20}/> Vos articles</h2></div><strong>{cart.length} article{cart.length>1?"s":""}</strong></div>
      {!cart.length ? <p className="profileCartEmpty">Votre panier est vide. Ajoutez une formation ou un service depuis le catalogue.</p> : <>
        <div className="profileCartItems">{cart.map((x,i)=><div className="profileCartItem" key={`${x.type}-${x.slug}`}><div><strong>{x.title}</strong><small>{Number(x.price).toFixed(2).replace(".",",")} € · {x.type==="formation"?"Formation":"Service"}</small></div><div className="cartQty"><button type="button" onClick={()=>updateQty(i,-1)} aria-label="Retirer une unité"><Minus size={13}/></button><span>{x.quantity}</span><button type="button" onClick={()=>updateQty(i,1)} aria-label="Ajouter une unité"><Plus size={13}/></button><button type="button" onClick={()=>removeItem(i)} aria-label="Supprimer"><Trash2 size={14}/></button></div></div>)}</div>
        <div className="profileCartCheckout"><div className="cartTotal"><span>Total</span><strong>{cartTotal.toFixed(2).replace(".",",")} €</strong></div>
          {store.methods?.length ? <label className="cartPaymentSelect"><span><CreditCard size={15}/> Moyen de paiement</span><select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}><option value="">Choisir...</option>{store.methods.map(m=><option key={m.id} value={m.id}>{m.icon||"💳"} {m.name}</option>)}</select></label> : <p className="authError">Aucun moyen de paiement n'est actuellement disponible.</p>}
          {paymentMethod && <div className="cartPaymentInfo">{store.methods.find(m=>String(m.id)===String(paymentMethod))?.description}<small>{store.methods.find(m=>String(m.id)===String(paymentMethod))?.instructions}</small></div>}
          <button className="primary" type="button" onClick={checkout} disabled={ordering||!store.methods?.length}>{ordering?<><LoaderCircle className="spin" size={16}/> Traitement...</>:<>Valider ma commande <ArrowRight size={16}/></>}</button>
        </div>
      </>}
      {orderMessage&&<p className="demoNote"><CheckCircle2 size={15}/> {orderMessage}</p>}
    </section>}
    <form onSubmit={submit} className="authForm">
      <label>Nom<input value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" required/></label>
      <label>Email<input value={email} type="email" disabled/></label>
      <button className="primary" type="submit" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={16}/> Enregistrement...</> : <>Enregistrer <ArrowRight size={16}/></>}</button>
    </form>
    {error && <p className="authError">{error}</p>}
    {message && <p className="demoNote"><CheckCircle2 size={15}/> {message}</p>}
    <p className="authSwitch"><Link href="/compte"><ArrowLeft size={13}/> Retour à mon espace</Link></p>
  </div></section><Footer /></main>;
}
export default Profil;
