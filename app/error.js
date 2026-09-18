"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="errorPage"><div className="errorCard">
    <span className="sectionTag">NEXORA</span>
    <h1>Une erreur est <span>survenue.</span></h1>
    <p>La page n'a pas pu être chargée correctement. Vous pouvez réessayer ou revenir à l'accueil.</p>
    <div className="notFoundActions"><button className="primary" type="button" onClick={() => reset()}>Réessayer</button><Link className="secondary" href="/">Accueil</Link></div>
  </div></main>;
}
