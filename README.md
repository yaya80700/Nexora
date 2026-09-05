# Nexora — V0.9.1

Nexora est une plateforme numérique moderne qui rassemble formations, services, projets et accompagnement. Cette version consolide l'authentification Supabase pour un déploiement GitHub/Vercel propre.

## Nouveautés V0.9.1

- Protection SSR de `/compte` avec `@supabase/ssr`.
- Vérification d'identité avec `supabase.auth.getClaims()` pour les décisions d'accès.
- Rafraîchissement des cookies Supabase via `getAll` / `setAll`.
- Middleware limité à l'espace privé `/compte`, donc les pages publiques ne dépendent pas de Supabase.
- Gestion propre des variables Supabase manquantes : redirection vers `/connexion` au lieu d'une erreur 500 globale.
- Callback OAuth protégé contre une configuration Supabase absente.
- Espace compte : vérification des claims puis récupération des informations utilisateur à jour.
- Connexion email/mot de passe, inscription, Google et Apple conservées.
- Profil utilisateur et réinitialisation du mot de passe conservés.
- Aucun panier : formations et prestations passent par la prise de contact.

## Configuration locale

Copie `.env.example` vers `.env.local` puis renseigne les variables :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

La clé Publishable peut être utilisée côté navigateur ; les accès aux données doivent être protégés par les politiques Row Level Security (RLS). N'ajoute jamais de clé `sb_secret_...` dans `.env.local`, GitHub ou le code client.

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

## Vercel

Dans **Vercel → Settings → Environment Variables**, ajoute :

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Active-les pour Production, Preview et Development selon tes besoins, puis fais un nouveau déploiement. Le fichier `.env.local` de ton PC n'est pas envoyé automatiquement à Vercel.

## Supabase Auth

Dans Supabase :

1. Active Email dans Authentication → Providers.
2. Configure Google et/ou Apple si souhaité.
3. Dans Authentication → URL Configuration, ajoute l'URL de ton site et le callback :

```text
https://ton-domaine.fr/auth/callback
http://localhost:3000/auth/callback
```

Pour protéger les pages côté serveur, Nexora utilise `getClaims()` conformément aux recommandations SSR actuelles de Supabase.

## Pages

- `/` — Accueil
- `/formations` — Formations
- `/formations/[slug]` — Détails
- `/sites` — Sites et projets
- `/services` — Services
- `/contact` — Contact
- `/connexion` — Connexion
- `/inscription` — Inscription
- `/mot-de-passe-oublie` — Mot de passe oublié
- `/reinitialiser-mot-de-passe` — Nouveau mot de passe
- `/compte` — Espace client protégé
- `/profil` — Profil
- `/auth/callback` — OAuth callback

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
- Les clés secrètes Supabase ne doivent être utilisées que côté serveur et ne doivent jamais être préfixées par `NEXT_PUBLIC_`.
