-- Restrict checkout transaction execution to trusted server code.
alter function public.create_order(
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text,
  jsonb
) set search_path = '';

revoke all on function public.create_order(
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text,
  jsonb
) from public;

revoke all on function public.create_order(
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text,
  jsonb
) from anon, authenticated;

grant execute on function public.create_order(
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text,
  jsonb
) to service_role;

-- Keep storage setup reproducible across local, preview, and production projects.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'payment-proofs',
    'payment-proofs',
    false,
    1048576,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'avatars',
    'avatars',
    true,
    1048576,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'product-images',
    'product-images',
    true,
    1048576,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view public media" on storage.objects;
create policy "Public can view public media"
  on storage.objects for select
  to public
  using (bucket_id in ('avatars', 'product-images'));

drop policy if exists "Users can upload own avatars" on storage.objects;
create policy "Users can upload own avatars"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (storage.foldername(name))[2] = auth.uid()::text
    )
  );

drop policy if exists "Users can update own avatars" on storage.objects;
create policy "Users can update own avatars"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (storage.foldername(name))[2] = auth.uid()::text
    )
  )
  with check (
    bucket_id = 'avatars'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (storage.foldername(name))[2] = auth.uid()::text
    )
  );

drop policy if exists "Users can delete own avatars" on storage.objects;
create policy "Users can delete own avatars"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (storage.foldername(name))[2] = auth.uid()::text
    )
  );

drop policy if exists "Users can upload own payment proofs" on storage.objects;
create policy "Users can upload own payment proofs"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "Users and admins can view payment proofs" on storage.objects;
create policy "Users and admins can view payment proofs"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.is_admin()
    )
  );

drop policy if exists "Users and admins can delete payment proofs" on storage.objects;
create policy "Users and admins can delete payment proofs"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.is_admin()
    )
  );

drop policy if exists "Admins can manage product images" on storage.objects;
create policy "Admins can manage product images"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  )
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );