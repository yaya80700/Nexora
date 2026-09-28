import {notFound} from "next/navigation";import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { getSubscriptions } from "../../lib/nexora/subscriptions";
import { getSiteContent, isStaffUser } from "../../lib/nexora/siteContent";
import ContentBlocks from "../ui/ContentBlocks";

export default async function Abonnements() {
  const [subscriptions, c] = await Promise.all([
    getSubscriptions(),
    getSiteContent("abonnements"),
  ]);
  const allowed = c.published !== false || await isStaffUser();
  if (!allowed) notFound();

  return (
    <main>
      <Header />
      <section className="pageHero">
        <span className="sectionTag">{c.eyebrow || "ABONNEMENTS NEXORA"}</span>
        <h1>{c.title || "Choisissez votre"}<br /><span>{c.accent || "formule."}</span></h1>
        <p>{c.text || "Des formules claires pour accéder aux ressources Nexora et bénéficier d’un accompagnement adapté à vos besoins."}</p>
      </section>

      <section className="subscriptionGrid">
        {subscriptions.map((plan) => (
          <article className={`subscriptionCard${plan.highlighted ? " featured" : ""}`} key={plan.slug}>
            {plan.highlighted && <div className="subscriptionBadge"><Sparkles size={13} /> Recommandé</div>}
            <div className="subscriptionTop">
              <span className="subscriptionIcon"><Sparkles size={18} /></span>
              <span className="subscriptionPeriod">{plan.billing_period || "mois"}</span>
            </div>
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <div className="subscriptionPrice">
              <strong>{plan.price != null ? `${Number(plan.price).toFixed(2).replace(".", ",")} €` : plan.price_label || "Sur devis"}</strong>
              {plan.price != null && <span>/ {plan.billing_period || "mois"}</span>}
            </div>
            <ul>
              {(Array.isArray(plan.features) ? plan.features : []).map((feature) => (
                <li key={feature}><Check size={15} /> {feature}</li>
              ))}
            </ul>
            <Link className={plan.highlighted ? "primary" : "secondary"} href={`/contact?type=Abonnement&subject=${encodeURIComponent(`Abonnement ${plan.name}`)}`}>
              Choisir cette formule <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </section>

      {subscriptions.length > 0 && (
        <section className="subscriptionCompare">
          <div className="sectionIntro">
            <span className="sectionTag">COMPARER LES FORMULES</span>
            <h2>Choisissez selon vos besoins.</h2>
            <p>Comparez les fonctionnalités incluses dans chaque abonnement avant de faire votre demande.</p>
          </div>
          <div className="subscriptionTableWrap">
            <table className="subscriptionTable">
              <thead>
                <tr>
                  <th>Fonctionnalité</th>
                  {subscriptions.map((plan) => <th key={plan.slug}>{plan.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(subscriptions.flatMap((plan) => Array.isArray(plan.features) ? plan.features : []))).map((feature) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    {subscriptions.map((plan) => <td key={`${plan.slug}-${feature}`}>{Array.isArray(plan.features) && plan.features.includes(feature) ? <Check size={15} /> : <span className="subscriptionDash">—</span>}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="serviceCTA subscriptionCTA">
        <div>
          <span className="sectionTag">BESOIN D'UN CONSEIL ?</span>
          <h2>Vous ne savez pas laquelle choisir ?</h2>
          <p>Contactez-nous et nous vous orienterons vers la formule la plus adaptée à votre projet.</p>
        </div>
        <Link className="primary" href="/contact">Parler à Nexora <ArrowRight size={17} /></Link>
      </section>

      <ContentBlocks blocks={c.customBlocks} />
      <Footer />
    </main>
  );
}
