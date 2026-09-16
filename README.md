# Nexora V1.6.36 — SEO & visibilité

Base : Nexora V1.6.35 Academy Staff Fix.

## Nouveautés
- Métadonnées SEO globales enrichies.
- Canonical URL configurable avec `NEXT_PUBLIC_SITE_URL`.
- Open Graph et Twitter metadata.
- Instructions robots avec exclusion des espaces privés.
- Sitemap automatique `/sitemap.xml` avec routes publiques et pages personnalisées publiées.
- Manifest `/manifest.webmanifest` pour une meilleure intégration mobile.
- Données structurées Schema.org pour Nexora et le site.
- Mots-clés orientés développement FiveM/GMod, sites web, formations et services numériques.

## Configuration Vercel
Ajouter si besoin :
`NEXT_PUBLIC_SITE_URL=https://nexora-plateforme.fr`

Sans variable, le projet utilise l'URL Vercel de production actuelle comme valeur de secours.

## Important
- Aucun fichier `.js` n'a été renommé en `.mjs`.
- `next.config.js` reste en `.js`.

## V1.6.40 — Abonnements complets
- Affichage de toutes les formules actives (jusqu'à 5) sur la page Abonnements.
- Tableau de comparaison généré automatiquement à partir des fonctionnalités de chaque formule.
- Mise en page responsive pour plusieurs abonnements.
- Le bouton « Choisir cette formule » conserve l'ouverture d'une demande Nexora avec la formule sélectionnée.
