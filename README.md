# Nexora V0.4

Plateforme web **Nexora**, pensée comme la base d'une future micro-entreprise numérique regroupant formations, services, projets et accompagnement.

## ✨ Fonctionnalités actuelles

- 🏠 **Accueil** — présentation de Nexora et de son univers
- 🎓 **Formations** — catalogue de formations avec fiches individuelles dynamiques
- 🌐 **Nos sites** — vitrine des projets et sites déjà réalisés
- 🛠️ **Nos services** — présentation des prestations proposées
- 📩 **Nous contacter** — interface de contact avec confirmation côté client
- 🧭 **Navigation réelle** entre les différentes pages
- 📱 **Design responsive** pour ordinateur, tablette et mobile
- 🎨 **Interface premium** avec identité bleu/violet et effets modernes
- 🔗 **Liens externes fonctionnels** vers les projets Nexora

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
- **React**
- **Lucide React** pour les icônes
- **CSS** personnalisé
- Déploiement prévu sur **Vercel**

> Next.js 15.5.24 est conservé dans cette version afin d'utiliser le patch Maintenance LTS recommandé pour la release de sécurité d'août 2026.

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
│   │   └── page.js
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

Cloner ou importer le projet puis lancer :

```bash
npm install
npm run dev
```

Le site sera ensuite disponible en local sur l'adresse affichée par Next.js, généralement :

```text
http://localhost:3000
```

## ☁️ Déploiement Vercel

1. Envoyer le projet sur GitHub.
2. Importer le dépôt dans Vercel.
3. Vercel détectera automatiquement Next.js.
4. Lancer le déploiement.

Aucune configuration serveur particulière n'est nécessaire pour cette version.

## 🔮 Prévu pour les prochaines versions

- 🔐 Comptes utilisateurs
- 👤 Espace client
- 💳 Paiements en ligne
- 💬 Messagerie / chat réel
- 📨 Gestion des demandes côté administration
- 🤖 Intégration de l'IA Nexora
- 🛒 Gestion plus complète des formations et services
- 📊 Tableau de bord administrateur
- 🌍 Nom de domaine personnalisé
- 🔎 Optimisation SEO et référencement Google

## 📌 Version

**Nexora V0.4** — version de développement.

Cette version constitue une base fonctionnelle destinée à continuer l'évolution du projet vers une véritable plateforme professionnelle.
