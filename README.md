# Nexora V1.3.1

Plateforme Nexora — formations, services, projets, comptes et administration complète.

## V1.3 — ce qui est ajouté

- Compte Google administrateur principal : `nexora.plateforme@gmail.com`.
- Dans **Mon espace**, les utilisateurs gardent : Formations, Mes demandes, Mes informations.
- Pour l'administrateur : **Voir les utilisateurs**, **Voir les demandes**, **Accéder au panel éditeur**.
- Liste de tous les comptes créés sur Nexora via une table `profiles` synchronisée avec Supabase Auth.
- Vraies demandes de contact enregistrées dans Supabase.
- Conversation dans une demande : l'administrateur et le client peuvent répondre directement sur le site.
- Statuts de demande : Nouvelle, En cours, Répondue, Clôturée.
- Catalogue administrable : formations, services et sites, avec ajout / modification / suppression / masquage.
- Prix, descriptions, noms, catégories, niveaux, modules, icônes et liens modifiables.
- Images facultatives pour les sites via URL.
- **Éditeur complet** pour les pages Accueil, Formations, Nos services, Nos sites et Nous contacter.
- Édition des titres, textes, boutons, statistiques, étapes, coordonnées professionnelles et section « L’écosystème Nexora ».
- Blocs libres ajoutables à chaque page : titre, texte, image, bouton ou séparateur.
- Le contenu édité est stocké dans Supabase et les pages publiques le lisent automatiquement.
- Aucun panier : les demandes et échanges passent par le site.

## Important — Supabase

Après avoir déployé V1.3, exécuter **une fois** `supabase/admin.sql` dans **Supabase → SQL Editor**.

Ce script crée / met à jour :

- `admin_users`
- `profiles`
- `catalog_items`
- `contact_requests`
- `request_messages`
- `site_content`
- les politiques RLS
- les triggers de synchronisation des profils
- la promotion automatique du compte Google `nexora.plateforme@gmail.com` en administrateur

Le script fait aussi un backfill des utilisateurs déjà présents dans `auth.users`, afin qu'ils apparaissent dans la liste administrateur.

## Connexion admin

Le compte principal doit être connecté avec **Google** et utiliser l'adresse :

`nexora.plateforme@gmail.com`

Une fois le SQL exécuté, ce compte est autorisé dans `admin_users` automatiquement (ou immédiatement s'il existe déjà).

## Variables Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Ne jamais mettre de clé `sb_secret_...` ou de service role dans le navigateur.

## Déploiement

Le projet est compatible avec Next.js 15.5.24 et Vercel. Le dossier racine du projet doit contenir directement `app/`, `lib/`, `public/` et `supabase/`.

## Routes principales

- `/` — Accueil
- `/formations` — Formations
- `/services` — Services
- `/sites` — Sites / écosystème
- `/contact` — Demande de contact
- `/connexion` — Connexion
- `/inscription` — Inscription
- `/compte` — Espace client
- `/profil` — Profil
- `/demandes` — Demandes et échanges du client
- `/admin` — Catalogue admin
- `/admin/users` — Utilisateurs
- `/admin/demandes` — Demandes clients
- `/admin/editor` — Éditeur complet

## Note

Le build complet doit être vérifié dans l'environnement de déploiement après installation des dépendances. Les modifications de schéma Supabase sont indispensables pour activer les nouvelles fonctions.


## V1.4 — Responsive
- Interface responsive PC / tablette / mobile.
- Menu mobile accessible depuis le header.
- Profil, authentification, demandes et panel admin adaptés aux petits écrans.
- Grilles, formulaires, cartes, boutons et images redimensionnés sans débordement horizontal.


## V1.4.2 — Header mobile
- Les actions **Compte** et **Parlons projet** restent visibles sur mobile comme sur PC.
- Le profil connecté affiche un libellé mobile « Compte ».
- Le menu hamburger reste disponible pour la navigation principale.
- Ajustements supplémentaires pour les petits écrans (≤ 380px).


## V1.4.2 — Correction connexion mobile
- Le bouton **Compte** est maintenant explicitement affiché sur mobile lorsqu'un visiteur n'est pas connecté.
- Il ouvre `/connexion` pour se connecter ou créer un compte.
- Le bouton **Parlons projet** reste également accessible sur mobile.

## V1.5 — Éditeur de site avancé
- Création de nouvelles pages depuis l'administration.
- URL personnalisée avec slug, nom dans le menu et ordre.
- Publication / dépublication d'une page.
- Affichage / masquage d'une page dans la navigation.
- Champs SEO : titre et description.
- Hero personnalisable : petit titre, titre, accent, texte, bouton et image.
- Blocs libres ajoutables à volonté : titre, texte, image, bouton, séparateur.
- Réorganisation des blocs avec monter / descendre.
- Masquage ou suppression de chaque bloc.
- Upload d'images via Supabase Storage.
- Les nouvelles pages sont accessibles directement avec leur URL, sans modifier le code.
- Les nouvelles pages publiées apparaissent automatiquement dans le menu du site.

### Activation Supabase
Exécutez la section **Nexora V1.5 — constructeur de pages personnalisées** du fichier `supabase/admin.sql` dans Supabase → SQL Editor.


## V1.6.0 — Staff & éditeur réorganisé
- Système de rôles : Propriétaire, Administrateur, Éditeur, Support.
- Gestion du staff depuis Admin → Utilisateurs & Staff.
- Le compte `nexora.plateforme@gmail.com` reste Propriétaire.
- Permissions API appliquées selon le rôle.
- Éditeur réorganisé avec une navigation latérale : pages principales, pages personnalisées et création de page.
- Interface éditeur responsive desktop/tablette/mobile.
- Les pages personnalisées peuvent toujours être créées, publiées, ajoutées au menu et construites avec des blocs.

### SQL
Exécuter `supabase/admin.sql` (ou la migration `Nexora-V1.6.0-STAFF-EDITOR.sql`) dans Supabase → SQL Editor.
