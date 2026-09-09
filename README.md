# Nexora V1.2.0 — Administration

Nexora est une plateforme Next.js 15 + Supabase. V1.2 ajoute un véritable espace d'administration privé pour gérer les formations, services et sites depuis le navigateur.

## Nouveautés V1.2
- `/admin/connexion` : connexion dédiée à l'administration.
- `/admin` : dashboard privé.
- Ajout / modification / suppression de formations.
- Modification des prix des formations.
- Ajout / modification / suppression de services.
- Ajout / modification / suppression de sites/projets.
- Activation / masquage d'un élément.
- Catalogue stocké dans Supabase.
- Contrôle admin côté middleware + API + RLS.
- Les pages publiques utilisent le catalogue Supabase avec fallback local si la base n'est pas encore configurée.
- Aucun panier : les demandes passent par contact Nexora.

## Installation
```bash
npm install
npm run dev
```

## Variables Vercel
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## Activer l'administration
1. Crée ton compte Nexora avec `/inscription` (email/mot de passe ou Google).
2. Dans Supabase, ouvre **SQL Editor**.
3. Copie-colle le contenu de `supabase/admin.sql` et exécute-le.
4. Dans **Authentication > Users**, copie l'UUID de TON compte.
5. Dans SQL Editor, exécute :
```sql
insert into public.admin_users (user_id) values ('TON-USER-UUID');
```
6. Connecte-toi sur `/admin/connexion` avec ce même compte.

Le compte ajouté dans `admin_users` est le seul compte autorisé à administrer le catalogue. Ne partage jamais ton mot de passe.

## Google OAuth
Le callback applicatif reste : `https://TON-DOMAINE/auth/callback`. Dans Supabase et Google Cloud, conserve les URLs de redirection configurées pour ton domaine Vercel.

## Important
Le fichier `.env.local` ne doit jamais être envoyé sur GitHub. Le `.gitignore` l'exclut.


## Auth V1.2.2
- Inscription email/mot de passe durcie et messages d'erreur plus clairs.
- Connexion email/mot de passe avec gestion des erreurs courantes.
- Connexion Google conservée.
- Pour une création de compte sans email de confirmation, désactiver **Confirm email** dans Supabase → Authentication → Providers → Email.
- La création redirige automatiquement vers `/compte` uniquement lorsqu'une session Supabase est réellement disponible.


## Administrateur principal

Le compte **nexora.plateforme@gmail.com** est configuré comme administrateur principal.

Dans Supabase → SQL Editor, exécute une fois le fichier `supabase/admin.sql`. Il :
- ajoute immédiatement ce compte à `admin_users` s'il existe déjà ;
- l'ajoute automatiquement s'il est créé plus tard ;
- conserve la protection RLS du catalogue.

Ensuite, utilise `/admin/connexion` avec ce compte.


## V1.2.0 — Navigation connectée
- La session Supabase est rafraîchie sur l’ensemble du site pour éviter de perdre l’état de connexion pendant la navigation.
- Le header détecte automatiquement l’utilisateur connecté.
- Une fois connecté, « Compte » est remplacé par le nom du profil (avec icône profil).
- Le nom du profil est cliquable et ouvre `/compte`.
- Déconnexion disponible directement depuis le header.
- Les pages publiques restent entièrement accessibles lorsque l’utilisateur est connecté.
- `/compte` et `/profil` restent protégées.
- Le panneau `/admin` reste protégé par l’authentification et la table `admin_users`.
