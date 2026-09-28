# Nexora V1.6.62 — Audit #1

- Validation et limitation des champs des demandes côté serveur.
- Validation stricte du lien de soutien (`http`/`https`).
- L'API de l'éditeur n'accepte plus de `page_key` arbitraire : uniquement les pages fixes Nexora.
- Validation du JSON reçu par l'éditeur.
- Ajout de `X-Permitted-Cross-Domain-Policies: none`.
- Aucun système de paiement ajouté.

Le build Next.js doit être vérifié dans l'environnement de déploiement si les dépendances ne sont pas installées localement.
