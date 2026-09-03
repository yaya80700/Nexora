# Nexora V0.6

Plateforme numérique Nexora — formations, services, projets et futur espace client.

## Nouveautés V0.6
- Logo officiel Nexora intégré dans le site et le favicon.
- Navigation modernisée avec accès Compte.
- Pages `/connexion`, `/inscription` et `/compte` préparées.
- Tableau de bord client prêt à accueillir formations, demandes, commandes et profil.
- Route API `/api/contact` préparée pour le futur backend.
- SEO et métadonnées renforcés.
- Design premium bleu/violet et responsive conservé.

> Les comptes, paiements et données clients ne sont pas encore persistants : V0.6 prépare l'interface et les points d'intégration. Il faudra brancher une vraie base de données et un système d'authentification avant la mise en production.

## Projets
- S.E.N — https://daily76.wixsite.com/sen-naruto-rp-1
- Echos WL — https://daily76.wixsite.com/echos-wl
- Axion Shop — https://daily76.wixsite.com/axion-shop

## Installation
```bash
npm install
npm run dev
```

Build de production :
```bash
npm run build
npm start
```

## Stack
- Next.js 15.5.24
- React 19.1.1
- Lucide React
- CSS custom

## Suite prévue
- Authentification réelle + base de données
- Espace client persistant
- Stripe / paiements
- Chat client ↔ Nexora
- Administration
- IA Nexora
- Déploiement et domaine personnalisé
