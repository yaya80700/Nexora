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
        <p>{c.text || "Deux formules simples pour profiter de Nexora et bénéficier d'un accompagnement adapté à vos besoins."}</p>
      </section>

      <section className="subscriptionGrid">
        {subscriptions.slice(0, 2).map((plan) => (
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
