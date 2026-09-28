# Nexora V1.6.63 — Panier & moyens de paiement configurables

## Ce qui est ajouté
- Panier utilisateur dans `/profil`.
- Boutons « Ajouter au panier » pour les formations et services à prix fixe.
- Quantités, suppression et total.
- Checkout depuis le profil.
- Moyens de paiement entièrement gérables par le propriétaire.
- Modes disponibles : Manuel, Lien de paiement, Service externe.
- Nom, description, icône, instructions, lien, ordre et activation modifiables.
- Interrupteur global pour activer/désactiver tout le panier.
- Commandes enregistrées dans Supabase et visibles dans `Admin > Panier & paiements`.
- Statuts de commande : en attente, confirmée, en traitement, terminée, annulée.
- Pour un moyen « Lien de paiement » ou « Service externe », le client est redirigé vers le lien configuré après création de la commande.

## Important
Ce système ne force aucun prestataire de paiement. Le propriétaire choisit ce qu'il veut afficher et peut tout désactiver.

La migration `supabase/migrations_v1.6.63_cart_payments.sql` doit être exécutée dans Supabase avant utilisation.

## Où gérer
`/admin/paiements`

Le propriétaire peut :
- activer/désactiver le panier globalement ;
- ajouter, modifier ou supprimer des moyens ;
- activer/désactiver chaque moyen ;
- configurer les instructions et liens ;
- suivre les commandes et leur statut.
