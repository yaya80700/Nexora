# Nexora — V1.0.0

Nexora est une plateforme numérique moderne qui rassemble formations, services, projets et accompagnement. La V1.0 marque le passage à une première version stable de la plateforme avec authentification réelle via Supabase et connexion Google opérationnelle.

## Nouveautés V1.0

- Authentification réelle Supabase : email / mot de passe.
- Connexion et inscription avec Google via OAuth.
- Callback OAuth sécurisé avec échange de code PKCE.
- Protection SSR de `/compte` avec `@supabase/ssr` et `getClaims()`.
- Rafraîchissement des cookies Supabase via `getAll` / `setAll`.
- Gestion des variables Supabase manquantes et des erreurs OAuth.
- Espace client protégé avec informations du compte et déconnexion.
- Modification du profil utilisateur.
- Réinitialisation du mot de passe.
- Apple volontairement laissé de côté pour cette V1.0 afin de garder uniquement les fournisseurs réellement configurés.
- Aucun panier : formations et prestations passent par la prise de contact.
- Interface responsive et identité visuelle Nexora conservées.

## Configuration locale

Copie `.env.example` vers `.env.local` puis renseigne :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

La Publishable key peut être utilisée côté navigateur. Les données doivent être protégées par les politiques Row Level Security (RLS). N'ajoute jamais de clé `sb_secret_...` dans `.env.local`, GitHub ou le code client.

## Installation

```bash
npm install
npm run dev
```

Production :

```bash
npm run build
npm start
```

## GitHub + Vercel

1. Envoie le contenu du projet sur ton dépôt GitHub.
2. Importe le dépôt dans Vercel.
3. Dans **Vercel → Settings → Environment Variables**, ajoute :

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Active-les pour Production, Preview et Development selon tes besoins, puis redéploie.

Le fichier `.env.local` de ton PC n'est pas envoyé automatiquement à Vercel.

## Supabase Auth

Dans Supabase :

1. Active **Email** dans Authentication → Providers.
2. Active **Google** et renseigne le Client ID + Client Secret créés dans Google Cloud.
3. Dans Authentication → URL Configuration, ajoute :

```text
https://nexoraplateforme.vercel.app
https://nexoraplateforme.vercel.app/auth/callback
http://localhost:3000
http://localhost:3000/auth/callback
```

Le callback OAuth utilisé par Nexora est :

```text
/auth/callback
```

Pour Google Cloud, l'URI de redirection autorisée doit pointer vers le callback Supabase de ton projet, par exemple :

```text
https://votre-projet.supabase.co/auth/v1/callback
```

## Pages

- `/` — Accueil
- `/formations` — Formations
- `/formations/[slug]` — Détails d'une formation
- `/sites` — Sites et projets
- `/services` — Services
- `/contact` — Contact
- `/connexion` — Connexion
- `/inscription` — Inscription
- `/mot-de-passe-oublie` — Mot de passe oublié
- `/reinitialiser-mot-de-passe` — Nouveau mot de passe
- `/compte` — Espace client protégé
- `/profil` — Profil
- `/auth/callback` — Callback OAuth

## Stack

- Next.js 15.5.24
- React 19.1.1
- Supabase Auth
- `@supabase/ssr`
- Lucide React
- CSS responsive

## Sécurité

- `.env*` est ignoré par Git.
- Aucune clé Supabase réelle n'est incluse dans ce ZIP.
- La Publishable key est la seule clé Supabase attendue côté application.
- Les clés secrètes Supabase ne doivent jamais être préfixées par `NEXT_PUBLIC_`.
