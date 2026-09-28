"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <main className="errorPage">
          <div className="errorCard">
            <span className="sectionTag">NEXORA</span>
            <h1>Une erreur est <span>survenue.</span></h1>
            <p>
              Nexora rencontre un problème temporaire. Vous pouvez relancer la page
              ou revenir à l&apos;accueil.
            </p>
            <div className="notFoundActions">
              <button className="primary" type="button" onClick={() => reset()}>
                Réessayer
              </button>
              <a className="secondary" href="/">
                Accueil
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
