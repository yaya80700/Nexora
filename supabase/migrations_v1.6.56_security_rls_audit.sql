-- Nexora V1.6.56 — audit sécurité / RLS
-- Renforce les contrôles DB sans modifier les données existantes.
-- Aucun système de paiement n'est ajouté.

-- ============================================================
-- Helper centralisé pour les permissions staff.
-- Les contrôles restent basés sur le système multi-rôles Nexora.
-- ============================================================
create or replace function public.nexora_caller_has_permission(p_permission text)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1
    from public.admin_users a
    where a.user_id=auth.uid()
      and (
        a.role='owner'
        or (a.permissions ? 'all')
        or (a.permissions ? p_permission)
        or exists(
          select 1
          from public.admin_user_roles ur
          join public.admin_roles r on r.id=ur.role_id
          where ur.user_id=auth.uid()
            and (r.permissions ? 'all' or r.permissions ? p_permission)
        )
      )
  );
$$;

revoke execute on function public.nexora_caller_has_permission(text) from public, anon;
grant execute on function public.nexora_caller_has_permission(text) to authenticated;

-- ============================================================
-- Les fonctions SECURITY DEFINER qui exposent des données staff
-- ne doivent pas être appelables par n'importe quel utilisateur.
-- ============================================================
create or replace function public.nexora_get_roles()
returns setof public.admin_roles
language plpgsql
security definer
set search_path=public
as $$
begin
  if not public.nexora_caller_has_permission('staff_manage') then
    raise exception 'Permission insuffisante';
  end if;
  return query select * from public.admin_roles order by is_system desc, created_at asc;
end;
$$;

grant execute on function public.nexora_get_roles() to authenticated;

create or replace function public.nexora_get_staff_v2()
returns table(user_id uuid, role_ids uuid[], role_names text[], is_owner boolean, created_at timestamptz)
language plpgsql
security definer
set search_path=public
as $$
begin
  if not (public.nexora_caller_has_permission('users_read') or public.nexora_caller_has_permission('staff_manage')) then
    raise exception 'Permission insuffisante';
  end if;
  return query
    select a.user_id,
      coalesce(array_agg(r.id order by r.created_at) filter(where r.id is not null),'{}'::uuid[]),
      coalesce(array_agg(r.name order by r.created_at) filter(where r.name is not null),'{}'::text[]),
      coalesce(bool_or(r.key='owner'),false),
      a.created_at
    from public.admin_users a
    left join public.admin_user_roles ur on ur.user_id=a.user_id
    left join public.admin_roles r on r.id=ur.role_id
    group by a.user_id,a.created_at
    order by a.created_at asc;
end;
$$;

grant execute on function public.nexora_get_staff_v2() to authenticated;

-- Cette fonction est uniquement appelée par les triggers de notifications.
-- Elle ne doit pas être exécutable directement par un utilisateur connecté.
revoke execute on function public.nexora_create_notification(uuid,text,text,text,text) from public, anon, authenticated;

-- ============================================================
-- Pièces jointes : vérifier que le chemin correspond bien à une
-- demande appartenant à l'utilisateur, et appliquer la permission
-- requests côté staff pour les accès directs au Storage.
-- ============================================================
drop policy if exists "users can upload own nexora attachments" on storage.objects;
create policy "users can upload own nexora attachments"
on storage.objects for insert to authenticated
with check (
  bucket_id='nexora-attachments'
  and (storage.foldername(name))[1]='requests'
  and (storage.foldername(name))[2]=auth.uid()::text
  and exists (
    select 1 from public.contact_requests r
    where r.user_id=auth.uid()
      and r.id::text=(storage.foldername(name))[3]
  )
);

drop policy if exists "users can read own nexora attachments" on storage.objects;
create policy "users can read own nexora attachments"
on storage.objects for select to authenticated
using (
  bucket_id='nexora-attachments'
  and (
    (
      (storage.foldername(name))[1]='requests'
      and (storage.foldername(name))[2]=auth.uid()::text
      and exists (
        select 1 from public.contact_requests r
        where r.user_id=auth.uid()
          and r.id::text=(storage.foldername(name))[3]
      )
    )
    or public.nexora_caller_has_permission('requests')
    or public.nexora_caller_has_permission('requests_manage')
  )
);

drop policy if exists "users can delete own nexora attachments" on storage.objects;
create policy "users can delete own nexora attachments"
on storage.objects for delete to authenticated
using (
  bucket_id='nexora-attachments'
  and (
    (
      (storage.foldername(name))[1]='requests'
      and (storage.foldername(name))[2]=auth.uid()::text
      and exists (
        select 1 from public.contact_requests r
        where r.user_id=auth.uid()
          and r.id::text=(storage.foldername(name))[3]
      )
    )
    or public.nexora_caller_has_permission('requests_manage')
  )
);

-- ============================================================
-- Médias CMS : les accès Storage suivent les permissions du CMS.
-- ============================================================
drop policy if exists "admins can upload nexora media" on storage.objects;
create policy "admins can upload nexora media"
on storage.objects for insert to authenticated
with check (
  bucket_id='nexora-media'
  and (
    public.nexora_caller_has_permission('editor')
    or public.nexora_caller_has_permission('catalog')
    or public.nexora_caller_has_permission('site_pages')
  )
);

drop policy if exists "admins can update nexora media" on storage.objects;
create policy "admins can update nexora media"
on storage.objects for update to authenticated
using (
  bucket_id='nexora-media'
  and (
    public.nexora_caller_has_permission('editor')
    or public.nexora_caller_has_permission('catalog')
    or public.nexora_caller_has_permission('site_pages')
  )
)
with check (
  bucket_id='nexora-media'
  and (
    public.nexora_caller_has_permission('editor')
    or public.nexora_caller_has_permission('catalog')
    or public.nexora_caller_has_permission('site_pages')
  )
);

drop policy if exists "admins can delete nexora media" on storage.objects;
create policy "admins can delete nexora media"
on storage.objects for delete to authenticated
using (
  bucket_id='nexora-media'
  and (
    public.nexora_caller_has_permission('editor')
    or public.nexora_caller_has_permission('catalog')
    or public.nexora_caller_has_permission('site_pages')
  )
);

-- ============================================================
-- Sécurité supplémentaire : aucun utilisateur standard ne doit
-- pouvoir modifier directement sa progression Academy ou son abonnement.
-- Les politiques existantes ne donnent déjà que SELECT aux utilisateurs;
-- on les réaffirme ici pour les environnements ayant été migrés partiellement.
-- ============================================================
alter table public.academy_enrollments enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.user_subscription_history enable row level security;
alter table public.notifications enable row level security;

-- Historique : lecture propriétaire uniquement côté client.
drop policy if exists "users can read own subscription history" on public.user_subscription_history;
create policy "users can read own subscription history"
on public.user_subscription_history for select to authenticated
using (user_id=auth.uid());

drop policy if exists "staff can manage subscription history" on public.user_subscription_history;
create policy "staff can manage subscription history"
on public.user_subscription_history for all to authenticated
using (
  public.nexora_caller_has_permission('users_manage')
  or public.nexora_caller_has_permission('catalog')
  or public.nexora_caller_has_permission('requests_manage')
  or public.nexora_caller_has_permission('all')
)
with check (
  public.nexora_caller_has_permission('users_manage')
  or public.nexora_caller_has_permission('catalog')
  or public.nexora_caller_has_permission('requests_manage')
  or public.nexora_caller_has_permission('all')
);
