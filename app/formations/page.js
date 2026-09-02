import Header from "../ui/Header";
import Link from "next/link";
export default function Page() {
 return <><Header/><main className="subPage"><div className="subHero"><span className="sectionTag">NEXORA</span><h1>Apprenez. Créez. Progressez.</h1><p className="lead">Des formations pratiques pour développer vos compétences numériques, avec des parcours pensés pour passer de la théorie à la réalisation.</p>
<div className="cards">
{[
["Développement FiveM","Scripts, ressources, interfaces NUI et bonnes pratiques pour créer des expériences solides.","À partir de 19,90 €"],
["Développement GMod","Lua, addons, systèmes RP et architecture de projets Garry's Mod.","À partir de 19,90 €"],
["Java & Python","Apprenez les bases et construisez vos propres applications et outils.","À partir de 14,90 €"],
["Optimisation PC & Jeux","Réglages, performances, diagnostic et optimisation sans recettes miracles.","À partir de 14,90 €"]
].map(([a,b,c])=><article className="course" key={a}><span className="courseIcon">NX</span><h2>{a}</h2><p>{b}</p><strong>{c}</strong><Link href="/contact">En savoir plus →</Link></article>)}
</div></div></main><footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora. Tous droits réservés.</p></footer></>;
}
