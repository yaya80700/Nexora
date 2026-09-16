import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Clock3, FileText, LogOut, MessageSquare, Sparkles, UserRound } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon espace" };

function badgeHue(value) {
  let hash = 0;
  for (let i = 0; i < String(value).length; i++) hash = ((hash << 5) - hash + String(value).charCodeAt(i)) | 0;
  return Math.abs(hash) % 360;
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function statusLabel(status) {
  return ({ new: "Nouvelle", in_progress: "En cours", answered: "Répondue", closed: "Terminée" })[status] || status || "En attente";
}

function statusClass(status) {
  return status === "closed" ? "closed" : status === "answered" ? "answered" : status === "in_progress" ? "progress" : "new";
}

export default async function Compte() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/connexion");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: requests }, { data: enrollments }, { data: accountSubscription }, { data: admin }] = await Promise.all([
    supabase.from("contact_requests").select("id,subject,request_type,status,created_at,updated_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("academy_enrollments").select("id,formation_slug,formation_title,module_count,current_module,status,started_at,completed_at,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("user_subscriptions").select("subscription_slug,subscription_name,assigned_at").eq("user_id", user.id).maybeSingle(),
    supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle(),
  ]);

  const requestList = requests || [];
  const academyList = enrollments || [];
  const isAdmin = !!admin;
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Membre Nexora";
  const activeFormations = academyList.filter((x) => x.status === "active");
  const completedFormations = academyList.filter((x) => x.status === "completed");
  const openRequests = requestList.filter((x) => x.status !== "closed").length;
  const answeredRequests = requestList.filter((x) => x.status === "answered").length;
  const totalModules = academyList.reduce((sum, x) => sum + Math.max(0, Number(x.module_count || 0)), 0);
  const completedModules = academyList.reduce((sum, x) => {
    const count = Math.max(0, Number(x.module_count || 0));
    const done = x.status === "completed" ? count : Math.max(0, Math.min(count, Number(x.current_module || 1) - 1));
    return sum + done;
  }, 0);
  const globalProgress = totalModules ? Math.round((completedModules / totalModules) * 100) : 0;

  let unread = 0;
  if (requestList.length) {
    const ids = requestList.map((x) => x.id);
    const { data: messages } = await supabase.from("request_messages").select("request_id,sender_role,created_at").in("request_id", ids).order("created_at", { ascending: false });
    const latest = new Map();
    for (const message of messages || []) if (!latest.has(message.request_id)) latest.set(message.request_id, message);
    unread = [...latest.values()].filter((message) => message.sender_role === "admin").length;
  }

  const subscriptionClass = accountSubscription?.subscription_slug || "default";
  const subscriptionStyle = accountSubscription ? { "--badge-hue": badgeHue(accountSubscription.subscription_slug || accountSubscription.subscription_name || "abonnement") } : undefined;

  return <main><Header />
    <section className="subPage accountPage">
      <div className="subHero accountHero">
        <span className="sectionTag">ESPACE CLIENT</span>
        <h1>Bonjour,<br /><span>{name}.</span></h1>
        <p className="lead">Votre espace Nexora, centralisé au même endroit : profil, demandes, formations et abonnement.</p>

        <div className="accountBar">
          <div className="accountIdentity"><div className="accountAvatar"><UserRound size={18} /></div><div><span>COMPTE CONNECTÉ</span><strong>{user.email}</strong></div></div>
          {accountSubscription && <span className={`accountSubscriptionBadge ${subscriptionClass}`} style={subscriptionStyle}>✦ {accountSubscription.subscription_name}</span>}
          <form action="/api/auth/logout" method="post"><button className="secondary" type="submit"><LogOut size={15} /> Se déconnecter</button></form>
        </div>

        <div className="accountStatsGrid">
          <Stat icon={<MessageSquare />} value={requestList.length} label="Demandes" hint={openRequests ? `${openRequests} en cours` : "Aucune en cours"} />
          <Stat icon={<BookOpen />} value={activeFormations.length} label="Formations" hint={completedFormations.length ? `${completedFormations.length} terminée(s)` : "Parcours actifs"} />
          <Stat icon={<Sparkles />} value={accountSubscription ? "1" : "0"} label="Abonnement" hint={accountSubscription ? accountSubscription.subscription_name : "Aucune formule"} />
          <Stat icon={<Clock3 />} value={unread} label="Réponses" hint={unread ? "Dernières réponses de Nexora" : "Aucune réponse récente"} />
        </div>

        <div className="accountMainGrid">
          <section className="accountBox accountActivityBox">
            <div className="accountBoxHead"><div><span className="sectionTag">ACTIVITÉ</span><h2>Votre activité récente</h2></div><Link href="/demandes" className="dashboardLink">Toutes mes demandes <ArrowUpRight size={13} /></Link></div>
            {requestList.length ? <div className="accountRequestsList">{requestList.slice(0, 4).map((request) => <Link className="accountRequestRow" href={`/demandes?request=${request.id}`} key={request.id}>
              <div className="accountRequestIcon"><FileText size={16} /></div><div className="accountRequestContent"><span>{request.request_type || "Demande"} · {formatDate(request.created_at)}</span><strong>{request.subject || "Demande Nexora"}</strong></div><b className={`accountStatus ${statusClass(request.status)}`}>{statusLabel(request.status)}</b><ArrowRight size={14} className="accountRequestArrow" />
            </Link>)}</div> : <Empty icon={<MessageSquare size={22} />} title="Aucune demande" text="Votre prochaine demande apparaîtra ici." href="/contact" label="Contacter Nexora" />}
          </section>

          <section className="accountBox accountOverviewBox">
            <div className="accountBoxHead"><div><span className="sectionTag">SYNTHÈSE</span><h2>Mon espace</h2></div></div>
            <div className="accountOverviewList">
              <Overview icon={<MessageSquare />} label="Demandes ouvertes" value={openRequests} href="/demandes" />
              <Overview icon={<CheckCircle2 />} label="Demandes répondues" value={answeredRequests} href="/demandes" />
              <Overview icon={<BookOpen />} label="Modules suivis" value={completedModules + "/" + totalModules} href="/academy" />
              <Overview icon={<Sparkles />} label="Progression Academy" value={globalProgress + "%"} href="/academy" />
            </div>
            <Link className="accountPrimaryLink" href="/profil">Gérer mon profil <ArrowRight size={14} /></Link>
          </section>
        </div>

        <div className="accountBottomGrid">
          <section className="accountBox">
            <div className="accountBoxHead"><div><span className="sectionTag">ACADEMY</span><h2>Mes formations</h2></div><Link href="/academy" className="dashboardLink">Ouvrir Academy <ArrowUpRight size={13} /></Link></div>
            {academyList.length ? <div className="accountFormationList">{academyList.slice(0, 3).map((formation) => { const count = Number(formation.module_count || 0); const done = Math.max(0, Math.min(count, Number(formation.current_module || 1) - 1)); const pct = count ? Math.round(done / count * 100) : 0; return <Link className="accountFormationRow" href="/academy" key={formation.id}><div className="accountFormationIcon"><BookOpen size={16} /></div><div className="accountFormationBody"><strong>{formation.formation_title}</strong><span>{formation.status === "completed" ? "Formation terminée" : `Module ${Math.min(formation.current_module || 1, Math.max(1, count))} sur ${count || "—"}`}</span><div className="accountProgress"><i style={{ width: `${formation.status === "completed" ? 100 : pct}%` }} /></div></div><b>{formation.status === "completed" ? "100%" : `${pct}%`}</b></Link> })}</div> : <Empty icon={<BookOpen size={22} />} title="Aucune formation activée" text="Vos formations apparaîtront ici lorsqu'une formation sera activée par l'équipe Nexora." href="/formations" label="Découvrir les formations" />}
          </section>

          <section className="accountBox">
            <div className="accountBoxHead"><div><span className="sectionTag">ABONNEMENT</span><h2>Ma formule</h2></div><Link href="/abonnements" className="dashboardLink">Voir les formules <ArrowUpRight size={13} /></Link></div>
            <div className={`accountPlan ${subscriptionClass}`} style={subscriptionStyle}><div className="accountPlanIcon"><Sparkles size={19} /></div><div><span>FORMULE ACTUELLE</span><strong>{accountSubscription?.subscription_name || "Aucun abonnement"}</strong><p>{accountSubscription ? `Attribué le ${formatDate(accountSubscription.assigned_at)}` : "Choisissez une formule adaptée à vos besoins."}</p></div></div>
            <Link className="accountPrimaryLink" href={accountSubscription ? "/abonnements" : "/abonnements"}>{accountSubscription ? "Consulter mon abonnement" : "Découvrir les abonnements"} <ArrowRight size={14} /></Link>
          </section>
        </div>

        <section className="accountQuickLinks"><Quick href="/profil" icon={<UserRound />} title="Mon profil" text="Informations du compte" /><Quick href="/parametres" icon={<Sparkles />} title="Paramètres" text="Sécurité et préférences" /><Quick href="/demandes" icon={<MessageSquare />} title="Mes demandes" text="Suivi et conversations" badge={unread} /><Quick href="/academy" icon={<BookOpen />} title="Nexora Academy" text="Formations et progression" /><Quick href="/contact" icon={<FileText />} title="Nouvelle demande" text="Parler à l'équipe Nexora" /></section>

        {isAdmin && <div className="adminAccountHeader"><Sparkles size={17} /><div><span>ADMINISTRATEUR NEXORA</span><strong>Les outils de gestion restent disponibles dans le panel privé.</strong></div><Link href="/admin">Ouvrir le panel <ArrowUpRight size={13} /></Link></div>}
      </div>
    </section><Footer /></main>;
}

function Stat({ icon, value, label, hint }) { return <article className="accountStat"><div className="accountStatIcon">{icon}</div><div><strong>{value}</strong><span>{label}</span><small>{hint}</small></div></article>; }
function Overview({ icon, label, value, href }) { return <Link href={href} className="accountOverviewRow"><i>{icon}</i><span>{label}</span><strong>{value}</strong><ArrowUpRight size={12} /></Link>; }
function Quick({ href, icon, title, text, badge }) { return <Link href={href} className="accountQuick"><div>{icon}</div><section><strong>{title}</strong><span>{text}</span></section>{badge > 0 && <b>{badge}</b>}<ArrowUpRight size={13} /></Link>; }
function Empty({ icon, title, text, href, label }) { return <div className="accountEmpty"><div>{icon}</div><strong>{title}</strong><p>{text}</p><Link href={href}>{label}<ArrowRight size={13} /></Link></div>; }
