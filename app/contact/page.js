"use client";
import { useState } from "react";
import { CheckCircle2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import Header from "../ui/Header";

export default function Contact(){
 const [sent,setSent]=useState(false);
 return <main><Header/><section className="pageHero"><span className="sectionTag">NOUS CONTACTER</span><h1>Un projet ?<br/><span>Parlons-en.</span></h1><p>Expliquez-nous votre besoin. Pour l'instant, ce formulaire prépare la future messagerie Nexora.</p></section>
 <section className="contactLayout"><div className="contactInfo"><div className="contactMethod"><div className="icon"><MessageCircle size={20}/></div><div><strong>Chat Nexora</strong><span>La future messagerie directement sur la plateforme.</span></div></div><div className="contactMethod"><div className="icon"><Mail size={20}/></div><div><strong>Email professionnel</strong><span>Votre adresse professionnelle sera ajoutée ici.</span></div></div><div className="contactMethod"><div className="icon"><Phone size={20}/></div><div><strong>Téléphone</strong><span>Votre numéro professionnel sera ajouté ici.</span></div></div></div>
 <form className="contactForm" onSubmit={(e)=>{e.preventDefault();setSent(true)}}>{sent?<div className="success"><CheckCircle2 size={44}/><h2>Demande préparée !</h2><p>La connexion à l'envoi réel sera ajoutée avec le backend Nexora.</p><button type="button" className="secondary" onClick={()=>setSent(false)}>Envoyer une autre demande</button></div>:<><div className="formRow"><label>Nom<input required placeholder="Votre nom"/></label><label>Email<input required type="email" placeholder="vous@exemple.fr"/></label></div><label>Sujet<select defaultValue="Projet"><option>Projet</option><option>Formation</option><option>Développement</option><option>Site web</option><option>Autre</option></select></label><label>Votre message<textarea required rows="7" placeholder="Expliquez-nous votre besoin..."/></label><button className="primary" type="submit">Envoyer la demande <Send size={17}/></button></>}</form></section>
 <footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora.</p></footer></main>
}
