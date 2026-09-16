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


## V1.6.42 — Espace client
- Refonte de `/compte` en tableau de bord utilisateur.
- Synthèse des demandes, formations, abonnement et activité.
- Progression Academy calculée à partir des modules suivis.
- Aperçu des demandes récentes avec statuts.
- Raccourcis rapides vers profil, demandes, Academy et contact.
- Interface responsive desktop/mobile.
- Accès administrateur conservé uniquement pour les comptes staff.

## V1.6.44 — Audit & corrections
- Dashboard admin : le compteur d’abonnements utilise désormais la table `subscriptions`, cohérente avec le système d’abonnements public/admin.
- Compte : libellé de la statistique ajusté pour refléter les dernières réponses administratives sans présenter cela comme un système de lecture persistant.
- Paramètres : après une demande de changement d’email, l’interface conserve l’adresse actuelle tant que la confirmation Supabase n’est pas finalisée.
- Nettoyage CSS des paramètres et contrôle des extensions : `next.config.js` reste en `.js`.


## V1.6.45 — Correction compte / Synthèse
- Correction du compteur « Modules suivis » dans `/compte`.
- Une formation avec le statut `completed` compte désormais tous ses modules comme terminés.
- La progression globale Academy reste cohérente avec le statut de formation.


## V1.6.46 — Préparation production
- Ajout d’un endpoint de santé `/api/health` pour vérifier rapidement que l’application répond correctement.
- Réponse de santé désactivant le cache pour refléter l’état réel du déploiement.
- Ajout d’un `global-error.js` pour afficher une page de secours même lorsqu’une erreur touche le layout racine.
- Version du projet mise à jour en `1.6.46`.
- Aucun fichier `.js` renommé en `.mjs` : `next.config.js` reste en `.js`.
