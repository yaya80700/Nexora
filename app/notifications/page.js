"use client";
import Link from "next/link";
import { Bell, Check, ChevronRight, MessageSquare, BookOpen, Sparkles, Inbox, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

const icons = { message: MessageSquare, request: Inbox, academy: BookOpen, subscription: Sparkles, system: Bell };
function formatDate(value) { return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=100", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Impossible de charger les notifications.");
      setItems(json.notifications || []); setUnread(Number(json.unread) || 0);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function markRead(item) {
    if (item.read_at) return;
    setItems((current) => current.map((x) => x.id === item.id ? { ...x, read_at: new Date().toISOString() } : x));
    setUnread((value) => Math.max(0, value - 1));
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) });
  }
  async function markAll() {
    setItems((current) => current.map((x) => ({ ...x, read_at: x.read_at || new Date().toISOString() })));
    setUnread(0);
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) });
  }

  return <main><Header /><section className="subPage notificationsPage"><div className="subHero notificationsHero">
    <span className="sectionTag">CENTRE DE NOTIFICATIONS</span>
    <div className="notificationsTitleRow"><div><h1>Vos notifications.</h1><p className="lead">Retrouvez ici les réponses, changements de demandes et mises à jour de votre espace Nexora.</p></div>{unread > 0 && <button className="secondary" onClick={markAll}><Check size={14}/> Tout marquer comme lu</button>}</div>
    <div className="notificationsSummary"><div><Bell size={17}/><strong>{unread}</strong><span>non lue{unread > 1 ? "s" : ""}</span></div><div><Inbox size={17}/><strong>{items.length}</strong><span>notification{items.length > 1 ? "s" : ""}</span></div></div>
    {loading ? <div className="notificationsEmpty"><Bell size={24}/><strong>Chargement…</strong></div> : error ? <div className="notificationsEmpty"><Bell size={24}/><strong>Notifications indisponibles</strong><p>{error}</p></div> : items.length ? <div className="notificationsList">{items.map((item) => { const Icon = icons[item.type] || Bell; const content = <><div className={`notificationIcon ${item.type}`}><Icon size={17}/></div><div className="notificationContent"><div><strong>{item.title}</strong>{!item.read_at && <b>NOUVEAU</b>}</div><p>{item.message}</p><small>{formatDate(item.created_at)}</small></div><ChevronRight size={15} className="notificationArrow"/></>; return item.href ? <Link key={item.id} href={item.href} className={`notificationRow ${item.read_at ? "read" : "unread"}`} onClick={() => markRead(item)}>{content}</Link> : <button key={item.id} className={`notificationRow ${item.read_at ? "read" : "unread"}`} onClick={() => markRead(item)}>{content}</button>; })}</div> : <div className="notificationsEmpty"><div className="notificationsEmptyIcon"><Bell size={23}/></div><strong>Aucune notification</strong><p>Les nouvelles réponses et mises à jour importantes apparaîtront ici.</p></div>}
    <Link href="/compte" className="secondary notificationsBack"><ArrowLeft size={14}/> Retour à mon espace</Link>
  </div></section><Footer/></main>
}
