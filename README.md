# Nexora — V0.7

Nexora est une plateforme numérique moderne qui rassemble formations, services, projets et accompagnement.

## Nouveautés V0.7

- Logo Nexora officiel utilisé dans l'interface et le footer.
- Footer premium commun sur les pages principales et les pages de compte/authentification.
- Suppression de la logique de panier : Nexora fonctionne sur une prise de contact pour les prestations et demandes.
- L'espace client ne présente plus de rubrique panier/commandes.
- Connexion avec email + mot de passe.
- Création de compte avec email + mot de passe.
- Options de connexion/création via Google et Apple ajoutées à l'interface.
- Les boutons Google/Apple sont préparés côté interface ; leur authentification réelle nécessitera le branchement OAuth/backend et les identifiants des fournisseurs.
- Navigation et design responsive conservés.

## Pages

- `/` — Accueil
- `/formations` — Formations
- `/formations/[slug]` — Détails d'une formation
- `/sites` — Projets et sites
- `/services` — Services
- `/contact` — Demandes et contact
- `/connexion` — Connexion
- `/inscription` — Création de compte
- `/compte` — Espace client

## Projets

- S.E.N — https://daily76.wixsite.com/sen-naruto-rp-1
- Echos WL — https://daily76.wixsite.com/echos-wl
- Axion Shop — https://daily76.wixsite.com/axion-shop

## Installation

```bash
npm install
npm run dev
```

Pour vérifier la production :

```bash
npm run build
```

## Stack

- Next.js 15.5.24
- React
- Lucide React
- CSS responsive

## Prochaine étape

V0.8 pourra connecter les comptes à une vraie base de données et activer OAuth Google/Apple, puis ajouter la messagerie client/admin. Les demandes et paiements resteront pilotés par contact avec Nexora, sans panier.
