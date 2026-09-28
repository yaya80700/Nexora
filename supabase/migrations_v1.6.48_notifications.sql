-- ============================================================
-- Nexora V1.6.48 — système de notifications utilisateur
-- À exécuter dans Supabase > SQL Editor.
-- Aucun paiement n'est utilisé par ce système.
-- ============================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'system',
  title text not null,
  message text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);
create index if not exists notifications_user_unread_idx
  on public.notifications(user_id, read_at, created_at desc);

drop policy if exists "users can read own notifications" on public.notifications;
create policy "users can read own notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "users can mark own notifications" on public.notifications;
create policy "users can mark own notifications"
  on public.notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "admins can manage notifications" on public.notifications;
create policy "admins can manage notifications"
  on public.notifications for all to authenticated
  using (exists(select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists(select 1 from public.admin_users a where a.user_id = auth.uid()));

create or replace function public.nexora_create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_href text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is null then return; end if;
  insert into public.notifications(user_id,type,title,message,href)
  values (p_user_id, coalesce(nullif(p_type,''),'system'), p_title, p_message, p_href);
end;
$$;

-- Réponse d'un membre du staff à une demande.
create or replace function public.nexora_notify_admin_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user uuid;
  request_subject text;
begin
  if new.sender_role <> 'admin' then return new; end if;
  select user_id, subject into target_user, request_subject
  from public.contact_requests where id = new.request_id;
  perform public.nexora_create_notification(
    target_user,
    'message',
    'Nouvelle réponse de Nexora',
    coalesce(nullif(request_subject,''),'Votre demande') || ' a reçu une nouvelle réponse.',
    '/demandes?request=' || new.request_id::text
  );
  return new;
end;
$$;

drop trigger if exists nexora_notify_admin_message on public.request_messages;
create trigger nexora_notify_admin_message
after insert on public.request_messages
for each row execute function public.nexora_notify_admin_message();

-- Changement de statut d'une demande.
create or replace function public.nexora_notify_request_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  label text;
begin
  if new.user_id is null or old.status is not distinct from new.status then return new; end if;
  label := case new.status
    when 'new' then 'Nouvelle'
    when 'in_progress' then 'En cours'
    when 'answered' then 'Répondue'
    when 'closed' then 'Terminée'
    else new.status
  end;
  perform public.nexora_create_notification(
    new.user_id,
    'request',
    'Statut de votre demande mis à jour',
    coalesce(nullif(new.subject,''),'Votre demande') || ' est maintenant : ' || label || '.',
    '/demandes?request=' || new.id::text
  );
  return new;
end;
$$;

drop trigger if exists nexora_notify_request_status on public.contact_requests;
create trigger nexora_notify_request_status
after update of status on public.contact_requests
for each row execute function public.nexora_notify_request_status();

-- Mise à jour de progression Academy par le staff.
create or replace function public.nexora_notify_academy_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_value integer;
  new_value integer;
begin
  old_value := coalesce(old.current_module, 1);
  new_value := coalesce(new.current_module, 1);
  if new.status = old.status and new_value = old_value then return new; end if;
  perform public.nexora_create_notification(
    new.user_id,
    'academy',
    case when new.status = 'completed' then 'Formation terminée' else 'Academy mise à jour' end,
    case when new.status = 'completed'
      then coalesce(new.formation_title,'Votre formation') || ' est terminée. Félicitations !'
      else coalesce(new.formation_title,'Votre formation') || ' : votre progression a été mise à jour.'
    end,
    '/academy'
  );
  return new;
end;
$$;

drop trigger if exists nexora_notify_academy_update on public.academy_enrollments;
create trigger nexora_notify_academy_update
after update of current_module,status on public.academy_enrollments
for each row execute function public.nexora_notify_academy_update();

-- Attribution ou modification d'un abonnement (gestion manuelle uniquement).
create or replace function public.nexora_notify_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.nexora_create_notification(
    new.user_id,
    'subscription',
    'Votre abonnement a été mis à jour',
    coalesce(new.subscription_name,'Votre formule Nexora') || ' est maintenant associé à votre compte.',
    '/abonnements'
  );
  return new;
end;
$$;

drop trigger if exists nexora_notify_subscription on public.user_subscriptions;
create trigger nexora_notify_subscription
after insert or update of subscription_id,subscription_slug,subscription_name on public.user_subscriptions
for each row execute function public.nexora_notify_subscription();
