import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import ContentBlocks from "../ui/ContentBlocks";
import { getCustomPage } from "../../lib/nexora/siteContent";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) return {};
  return { title: page.seo_title || page.title, description: page.seo_description || undefined };
}

export default async function CustomPage({ params }) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) notFound();
  const c = page.content || {};
  return <main><Header/>
    {c.showHero !== false && <section className="hero customHero">
      <div className="orb orb1"/><div className="orb orb2"/>
      <div className="heroContent"><div className="eyebrow"><Sparkles size={16}/> {c.heroEyebrow || "NEXORA"}</div>
        <h1>{c.heroTitle || page.title}{c.heroAccent ? <><br/><span>{c.heroAccent}</span></> : null}</h1>
        {c.heroText && <p>{c.heroText}</p>}
        <div className="actions"><Link className="primary" href={c.primaryHref || "/contact"}>{c.primaryLabel || "Parlons de votre projet"}<ArrowRight size={18}/></Link></div>
      </div>
      {c.heroImage && <div className="heroCard customHeroImage"><Image src={c.heroImage} alt={c.heroImageAlt || page.title} width={700} height={520}/></div>}
    </section>}
    <ContentBlocks blocks={Array.isArray(c.customBlocks) ? c.customBlocks : []}/>
    <Footer/>
  </main>;
}
