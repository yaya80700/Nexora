"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, MessageCircle, Send, Search, Filter, Paperclip, X } from "lucide-react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

const status = {
  new: "Nouvelle",
  in_progress: "En cours",
  answered: "Réponse Nexora",
  closed: "Clôturée",
};

function AttachmentList({ attachments }) {
  if (!Array.isArray(attachments) || !attachments.length) return null;
  return <div className="attachmentList">{attachments.map((file, i) => <a key={`${file.path}-${i}`} href={`/api/attachments?path=${encodeURIComponent(file.path)}`} target="_blank" rel="noreferrer"><Paperclip size={13}/><span>{file.name}</span></a>)}</div>;
}

export default function Demandes() {
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [files, setFiles] = useState({});

  async function load() {
    try {
      const r = await fetch("/api/demandes");
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "Erreur");
      } else {
        setError("");
        setRequests(j.requests || []);
        setMessages(j.messages || []);
      }
    } catch {
      setError("Impossible de charger vos demandes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  const visible = useMemo(() => {
    return requests.filter((r) => {
      const q = query.trim().toLowerCase();
      const matches =
        !q ||
        [r.subject, r.request_type, r.message].some((v) =>
          String(v || "").toLowerCase().includes(q)
        );
      const matchesStatus = filter === "all" || r.status === filter;
      return matches && matchesStatus;
    });
  }, [requests, query, filter]);

  async function reply(id) {
    const message = text[id]?.trim();
    if (!message) return;

    const form = new FormData();
    form.append("request_id", id);
    form.append("message", message);
    (files[id] || []).forEach((file) => form.append("attachments", file));
    const r = await fetch("/api/demandes", {
      method: "POST",
      body: form,
    });
    const j = await r.json();

    if (!r.ok) {
      setError(j.error || "Erreur");
      return;
    }

    setText((x) => ({ ...x, [id]: "" }));
    setFiles((x) => ({ ...x, [id]: [] }));
    await load();
  }

  return (
    <main>
      <Header />
      <section className="subPage">
        <div className="subHero">
          <Link href="/compte" className="editorBack">
            <ArrowLeft size={15} /> Mon espace
          </Link>

          <span className="sectionTag">MES DEMANDES</span>
          <h1>
            Vos échanges
            <br />
            <span>avec Nexora.</span>
          </h1>
          <p className="lead">
            Retrouvez vos demandes, les réponses de Nexora et poursuivez la
            conversation directement ici. Les échanges se mettent à jour
            automatiquement.
          </p>

          {loading ? (
            <div className="adminEmpty">
              <LoaderCircle className="spin" /> Chargement…
            </div>
          ) : error ? (
            <p className="authError">{error}</p>
          ) : requests.length === 0 ? (
            <div className="emptyState">
              <MessageCircle size={30} />
              <h2>Aucune demande</h2>
              <p>Vous n'avez pas encore envoyé de demande.</p>
              <Link href="/contact" className="primary">
                Créer une demande <Send size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div className="requestToolbar">
                <label>
                  <Search size={15} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une demande…"
                  />
                </label>
                <label>
                  <Filter size={15} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="new">Nouvelle</option>
                    <option value="in_progress">En cours</option>
                    <option value="answered">Réponse Nexora</option>
                    <option value="closed">Clôturée</option>
                  </select>
                </label>
              </div>

              <div className="requestResultsCount">
                {visible.length} demande{visible.length > 1 ? "s" : ""} affichée
                {visible.length > 1 ? "s" : ""}
              </div>

              <div className="requestList">
                {visible.map((r) => (
                  <article className="requestCard" key={r.id}>
                    <div className="requestHead">
                      <div>
                        <span className="sectionTag">{r.request_type}</span>
                        <h2>{r.subject}</h2>
                      </div>
                      <span className={`requestStatus ${r.status}`}>
                        {status[r.status] || r.status}
                      </span>
                    </div>

                    <p className="requestOriginal">{r.message}</p>
                    <AttachmentList attachments={r.attachments} />

                    <div className="requestMessages">
                      {messages
                        .filter((m) => m.request_id === r.id)
                        .map((m) => (
                          <div
                            className={`requestMessage ${m.sender_role}`}
                            key={m.id}
                          >
                            <b>{m.sender_role === "admin" ? "Nexora" : "Vous"}</b>
                            <p>{m.message}</p>
                            <small>{new Date(m.created_at).toLocaleString("fr-FR")}</small>
                            <AttachmentList attachments={m.attachments} />
                          </div>
                        ))}
                    </div>

                    <div className="requestReply">
                      <div className="replyComposer">
                        <textarea rows="3" placeholder="Votre réponse…" value={text[r.id] || ""} onChange={(e) => setText((x) => ({ ...x, [r.id]: e.target.value }))} />
                        <label className="fileUploadButton small"><Paperclip size={14}/> Ajouter un fichier<input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg,.webp,.gif" onChange={(e) => { const selected=Array.from(e.target.files||[]); const current=files[r.id]||[]; const next=[...current,...selected]; if(next.length>3){setError("3 fichiers maximum par message.");return} if(next.some(f=>f.size>10*1024*1024)){setError("Chaque fichier doit faire 10 Mo maximum.");return} setError(""); setFiles(x=>({...x,[r.id]:next})); e.target.value=""; }} /></label>
                        {(files[r.id]||[]).length>0&&<div className="selectedFiles">{(files[r.id]||[]).map((file,i)=><div key={`${file.name}-${i}`}><Paperclip size={12}/><span>{file.name}</span><button type="button" onClick={()=>setFiles(x=>({...x,[r.id]:(x[r.id]||[]).filter((_,n)=>n!==i)}))} aria-label={`Retirer ${file.name}`}><X size={13}/></button></div>)}</div>}
                      </div>
                      <button className="primary" onClick={() => reply(r.id)} disabled={!text[r.id]?.trim()}>Répondre <Send size={15} /></button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
