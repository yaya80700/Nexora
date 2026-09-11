# Nexora V1.6.8 — Demandes clients améliorées

Cette version améliore le suivi des demandes dans le panneau de contrôle.

## Demandes
- filtres par statut : toutes, nouvelles, en cours, répondues, clôturées
- compteur par statut
- affichage visuel différent selon le statut
- prise en charge explicite par un membre du staff
- bouton « Me l'attribuer »
- choix d'un membre du staff
- affichage du nom de la personne en charge et de la date de prise en charge
- passer une demande en « En cours » l'attribue automatiquement à l'admin qui effectue l'action si personne n'est déjà assigné
- répondre à une demande l'attribue automatiquement à l'admin qui répond et passe la demande en « Répondue »
- retrait d'une prise en charge possible via « Non attribuée »
- responsive mobile

## Supabase
Exécuter le SQL complet de `supabase/admin.sql` dans Supabase SQL Editor. Les deux nouvelles colonnes sont ajoutées de façon idempotente : `assigned_to` et `assigned_at`.

Version: 1.6.8
