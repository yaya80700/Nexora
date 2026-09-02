import Header from "../ui/Header";
import Link from "next/link";
export default function Page() {
 return <><Header/><main className="subPage"><div className="subHero"><span className="sectionTag">NEXORA</span><h1>Nos projets</h1><p className="lead">Un espace pour découvrir les projets, plateformes et sites créés dans l’écosystème Nexora.</p>
<div className="projectHero"><div><span className="sectionTag">PORTFOLIO</span><h2>Des idées transformées<br/>en projets concrets.</h2><p>Cette section accueillera progressivement tes différents sites et projets avec leurs descriptions, liens et visuels.</p></div><div className="projectMock">NEXORA<br/><span>PROJECT HUB</span></div></div></div></main><footer><div className="brand"><span className="brandMark">N</span><span>NEXORA</span></div><p>© 2026 Nexora. Tous droits réservés.</p></footer></>;
}
