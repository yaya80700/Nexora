-- Nexora V1.6.64 — panier configurable article par article
-- À exécuter dans Supabase > SQL Editor.

alter table public.catalog_items
  add column if not exists purchase_mode text not null default 'contact';

alter table public.catalog_items
  drop constraint if exists catalog_items_purchase_mode_check;

alter table public.catalog_items
  add constraint catalog_items_purchase_mode_check
  check (purchase_mode in ('contact','cart','both'));

-- Sécurité : les éléments existants restent par défaut en mode contact.
-- Le propriétaire/staff peut ensuite choisir article par article depuis Admin > Panier & paiements.

-- Les modifications du panier et des moyens de paiement passent par la permission store_manage.
-- Le propriétaire garde toujours l'accès via la permission 'all'.
drop policy if exists "admins can manage store settings" on public.store_settings;
create policy "staff with store permission can manage store settings" on public.store_settings
  for all to authenticated
  using (public.nexora_caller_has_permission('store_manage'))
  with check (public.nexora_caller_has_permission('store_manage'));

drop policy if exists "admins can manage payment methods" on public.payment_methods;
create policy "staff with store permission can manage payment methods" on public.payment_methods
  for all to authenticated
  using (public.nexora_caller_has_permission('store_manage'))
  with check (public.nexora_caller_has_permission('store_manage'));

drop policy if exists "admins can manage orders" on public.orders;
create policy "staff with store permission can manage orders" on public.orders
  for all to authenticated
  using (public.nexora_caller_has_permission('store_manage'))
  with check (public.nexora_caller_has_permission('store_manage'));

drop policy if exists "admins can manage order items" on public.order_items;
create policy "staff with store permission can manage order items" on public.order_items
  for all to authenticated
  using (public.nexora_caller_has_permission('store_manage'))
  with check (public.nexora_caller_has_permission('store_manage'));

-- Le rôle Administrateur système reçoit la nouvelle permission.
update public.admin_roles
set permissions = case
  when jsonb_typeof(permissions) = 'array' and not (permissions ? 'store_manage')
    then permissions || '["store_manage"]'::jsonb
  else permissions
end
where key = 'admin';
