# Nexora — V0.8

Nexora est une plateforme numérique moderne qui rassemble formations, services, projets et accompagnement. La V0.8 passe d'une simple interface de démonstration à une base d'authentification réelle prête pour la production avec Supabase.

## Nouveautés V0.8

- Authentification réelle avec Supabase.
- Connexion par email + mot de passe.
- Création de compte par email + mot de passe.
- Confirmation d'adresse email supportée.
- Connexion OAuth Google.
- Connexion OAuth Apple.
- Callback sécurisé `/auth/callback` pour les connexions OAuth.
- Middleware de rafraîchissement de session.
- `/compte` protégé : accès réservé aux utilisateurs connectés.
- Déconnexion réelle.
- Affichage du nom et de l'email du compte.
- Logo Nexora conservé dans le header, l'accueil et le footer.
- Aucun panier : les prestations, formations et projets passent par « Nous contacter ».
- Interface responsive conservée.

## Pages

- `/` — Accueil
- `/formations` — Formations
- `/formations/[slug]` — Détails d'une formation
- `/sites` — Projets et sites
- `/services` — Services
- `/contact` — Demandes et contact
- `/connexion` — Connexion réelle
- `/inscription` — Création de compte réelle
- `/compte` — Espace client protégé
- `/auth/callback` — Callback OAuth

## Configuration Supabase

1. Crée un projet sur Supabase.
2. Dans **Project Settings → API**, récupère l'URL du projet et la clé `anon`.
3. Copie `.env.example` vers `.env.local`.
4. Renseigne :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

5. Dans Supabase, active **Email** dans Authentication → Providers.
6. Pour Google, active le provider Google et renseigne les identifiants OAuth demandés par Supabase.
7. Pour Apple, active le provider Apple et renseigne les identifiants Apple demandés par Supabase.
8. Dans Authentication → URL Configuration, ajoute ton domaine de production et l'URL de callback :

```text
https://ton-domaine.fr/auth/callback
```

Pour le développement local :

```text
http://localhost:3000/auth/callback
```

## Installation

```bash
npm install
npm run dev
```

Pour vérifier la production :

```bash
npm run build
```

## Déploiement Vercel

Ajoute les deux variables suivantes dans les Environment Variables du projet Vercel :

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Puis redéploie le projet.

## Stack

- Next.js 15.5.24
- React 19.1.1
- Supabase Auth
- @supabase/ssr
- Lucide React
- CSS responsive

## Architecture

```text
app/
├── api/
│   ├── auth/logout/
│   └── contact/
├── auth/callback/
├── connexion/
├── inscription/
├── compte/
├── formations/
├── services/
├── sites/
├── contact/
└── ui/
lib/
└── supabase/
    ├── client.js
    └── server.js
middleware.js
.env.example
```

## Prochaine étape — V0.9

- Profil utilisateur éditable.
- Historique réel des demandes de contact.
- Base de données des formations et inscriptions.
- Espace admin Nexora.
- Gestion des demandes et statuts.
- Messagerie client / Nexora.
- Préparation des paiements au cas par cas, sans panier.
