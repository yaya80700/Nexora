"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, MessageCircle, Send, Search, Filter } from "lucide-react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

const status = {
  new: "Nouvelle",
  in_progress: "En cours",
  answered: "Réponse Nexora",
  closed: "Clôturée",
};

export default function Demandes() {
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

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

    const r = await fetch("/api/demandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: id, message }),
    });
    const j = await r.json();

    if (!r.ok) {
      setError(j.error || "Erreur");
      return;
    }

    setText((x) => ({ ...x, [id]: "" }));
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
                            <small>
                              {new Date(m.created_at).toLocaleString("fr-FR")}
                            </small>
                          </div>
                        ))}
                    </div>

                    <div className="requestReply">
                      <textarea
                        rows="3"
                        placeholder="Votre réponse…"
                        value={text[r.id] || ""}
                        onChange={(e) =>
                          setText((x) => ({ ...x, [r.id]: e.target.value }))
                        }
                      />
                      <button
                        className="primary"
                        onClick={() => reply(r.id)}
                      >
                        Répondre <Send size={15} />
                      </button>
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
