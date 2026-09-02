import Header from "../ui/Header";
import Link from "next/link";
export default function Page() {
 return <><Header/><main className="subPage"><div className="subHero"><span className="sectionTag">NEXORA</span><h1>Des services qui vont droit au but.</h1><p className="lead">Besoin de créer, améliorer ou débloquer un projet ? Nexora propose un accompagnement adapté à ton besoin.</p>
<div className="serviceList">
{[["Création de sites","Landing pages, sites vitrines et plateformes modernes, pensés pour être rapides et évolutifs."],["Développement","Scripts, automatisations, outils et fonctionnalités personnalisées pour tes projets."],["Optimisation","Analyse et amélioration des performances d’un PC, d’un jeu ou d’un projet web."],["Accompagnement","Un regard extérieur et des conseils concrets pour avancer étape par étape."]].map(([a,b],i)=><article className="service" key={a}><span>0{i+1}</span><div><h2>{a}</h2><p>{b}</p></div><Link href="/contact">Demander →</Link></article>)}
</div></div></main><footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora. Tous droits réservés.</p></footer></>;
}
