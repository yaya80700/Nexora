-- Nexora V1.6.53 — correction RLS des pièces jointes
-- Les fichiers sont stockés sous requests/{userId}/{requestId}/...
-- La politique V1.6.38 vérifiait par erreur le premier dossier comme étant userId.

alter table public.contact_requests enable row level security;

insert into storage.buckets (id, name, public)
values ('nexora-attachments', 'nexora-attachments', false)
on conflict (id) do update set public=false;

drop policy if exists "users can upload own nexora attachments" on storage.objects;
create policy "users can upload own nexora attachments"
on storage.objects for insert to authenticated
with check (
  bucket_id='nexora-attachments'
  and (storage.foldername(name))[1]='requests'
  and (storage.foldername(name))[2]=auth.uid()::text
);

drop policy if exists "users can read own nexora attachments" on storage.objects;
create policy "users can read own nexora attachments"
on storage.objects for select to authenticated
using (
  bucket_id='nexora-attachments'
  and (
    ((storage.foldername(name))[1]='requests' and (storage.foldername(name))[2]=auth.uid()::text)
    or exists(select 1 from public.admin_users a where a.user_id=auth.uid())
  )
);

drop policy if exists "users can delete own nexora attachments" on storage.objects;
create policy "users can delete own nexora attachments"
on storage.objects for delete to authenticated
using (
  bucket_id='nexora-attachments'
  and (storage.foldername(name))[1]='requests'
  and (storage.foldername(name))[2]=auth.uid()::text
);
