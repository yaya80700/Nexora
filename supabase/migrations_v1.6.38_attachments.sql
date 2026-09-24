-- Nexora V1.6.38 — pièces jointes pour les demandes et messages
alter table public.contact_requests add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.request_messages add column if not exists attachments jsonb not null default '[]'::jsonb;

-- Bucket privé dédié aux fichiers clients/staff.
insert into storage.buckets (id, name, public)
values ('nexora-attachments', 'nexora-attachments', false)
on conflict (id) do update set public=false;

drop policy if exists "users can upload own nexora attachments" on storage.objects;
create policy "users can upload own nexora attachments"
on storage.objects for insert to authenticated
with check (
  bucket_id='nexora-attachments'
  and (storage.foldername(name))[1]=auth.uid()::text
);

drop policy if exists "users can read own nexora attachments" on storage.objects;
create policy "users can read own nexora attachments"
on storage.objects for select to authenticated
using (
  bucket_id='nexora-attachments'
  and (
    (storage.foldername(name))[1]=auth.uid()::text
    or exists(select 1 from public.admin_users a where a.user_id=auth.uid())
  )
);

drop policy if exists "users can delete own nexora attachments" on storage.objects;
create policy "users can delete own nexora attachments"
on storage.objects for delete to authenticated
using (
  bucket_id='nexora-attachments'
  and (storage.foldername(name))[1]=auth.uid()::text
);
