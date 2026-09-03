# Nexora V0.5

Plateforme web **Nexora**, pensée comme la base d'une future micro-entreprise numérique regroupant formations, services, développement, projets et accompagnement.

## ✨ Nouveautés V0.5

- 🏠 Accueil entièrement renforcé : hero, statistiques, univers Nexora, formations et CTA projet
- 🎓 Formations : catalogue plus complet, informations de parcours et CTA dédié
- 🛠️ Services : présentation des prestations + parcours en 3 étapes (échange → proposition → réalisation)
- 📩 Contact : type de demande, budget indicatif, sujet et message
- 📱 Navigation mobile avec menu responsive
- 🔎 Métadonnées SEO globales améliorées
- 🎨 Identité visuelle Nexora conservée : interface sombre premium, bleu/violet et effets modernes
- 🔗 Navigation réelle entre toutes les rubriques
- 🌐 Les trois projets Nexora restent accessibles depuis la page **Nos sites**

## 🌐 Projets présentés

### S.E.N — Shinobi Era Nations
Projet Naruto RP avec univers communautaire, boutique et services dédiés.

https://daily76.wixsite.com/sen-naruto-rp-1

### Echos WL — Echos Whitelist
Projet GTA RP Whitelist avec identité immersive, économie et univers communautaire.

https://daily76.wixsite.com/echos-wl

### Axion Shop
Boutique orientée développement, ressources, mapping et optimisation PC / jeux vidéo.

https://daily76.wixsite.com/axion-shop

## 🧰 Technologies

- **Next.js 15.5.24**
- **React 19**
- **Lucide React**
- **CSS personnalisé**
- Déploiement prévu sur **Vercel**

## 📁 Structure principale

```text
Nexora/
├── app/
│   ├── contact/
│   │   └── page.js
│   ├── formations/
│   │   ├── [slug]/
│   │   │   └── page.js
│   │   └── page.js
│   ├── services/
│   │   ├── page.js
│   │   └── ...
│   ├── sites/
│   │   └── page.js
│   ├── ui/
│   │   └── Header.js
│   ├── data.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── .gitignore
├── next.config.mjs
├── package.json
└── README.md
```

## 🚀 Installation

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse locale affichée par Next.js, généralement :

```text
http://localhost:3000
```

Pour vérifier la production :

```bash
npm run build
npm start
```

## ☁️ Déploiement Vercel

1. Envoyer le projet sur GitHub.
2. Importer le dépôt dans Vercel.
3. Vercel détecte automatiquement Next.js.
4. Déployer.

Aucune configuration serveur particulière n'est nécessaire pour la V0.5.

## 🧭 État des fonctionnalités

| Fonctionnalité | État |
|---|---|
| Pages principales | ✅ |
| Navigation réelle | ✅ |
| Catalogue formations | ✅ |
| Fiches formations | ✅ |
| Services | ✅ |
| Portfolio / sites | ✅ |
| Formulaire de contact | 🟡 Interface prête, envoi réel à connecter |
| Comptes utilisateurs | 🔴 Prévu |
| Espace client | 🔴 Prévu |
| Paiement en ligne | 🔴 Prévu |
| Chat réel | 🔴 Prévu |
| Administration | 🔴 Prévu |
| IA Nexora | 🔴 Prévu |

## 🔮 Prochaine évolution

La V0.6 pourra commencer à transformer Nexora en véritable plateforme avec un backend :

- 🔐 comptes et authentification
- 👤 espace client
- 💬 messagerie réelle
- 📨 réception des demandes côté administration
- 💳 paiements et commandes
- 📊 tableau de bord admin
- 📚 gestion dynamique des formations
- 🌍 nom de domaine personnalisé
- 🔎 SEO avancé et référencement Google
- 🤖 intégration de l'IA Nexora

## 📌 Version

**Nexora V0.5 — version de développement.**

Cette version améliore fortement l'expérience utilisateur et prépare la base de Nexora à l'arrivée d'un véritable backend dans les prochaines versions.
