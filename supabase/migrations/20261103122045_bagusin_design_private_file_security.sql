-- Bagusin private template-file handling.
-- Keep downloadable source files out of the public design catalogue API.
create table if not exists public.design_item_private_files (
  id uuid primary key default gen_random_uuid(),
  design_item_id uuid not null references public.design_items(id) on delete cascade,
  bucket_id text not null default 'bagusin-private' check (bucket_id = 'bagusin-private'),
  object_path text not null, file_name text not null, version_label text,
  is_current boolean not null default true, file_size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), unique (bucket_id, object_path),
  constraint design_item_private_file_size_positive check (file_size_bytes is null or file_size_bytes > 0)
);
create index if not exists design_item_private_files_item_idx
  on public.design_item_private_files(design_item_id, is_current desc, created_at desc);
alter table public.design_item_private_files enable row level security;
create policy design_item_private_files_admin_read on public.design_item_private_files for select to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy design_item_private_files_admin_insert on public.design_item_private_files for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy design_item_private_files_admin_update on public.design_item_private_files for update to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy design_item_private_files_admin_delete on public.design_item_private_files for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
grant select, insert, update, delete on public.design_item_private_files to authenticated;
-- Revoke table-wide SELECT so legacy resource_url cannot be read from browser clients.
revoke select on public.design_items from anon, authenticated, public;
grant select (
  id, category_id, author_id, title, slug, description, preview_image_url, preview_images,
  status, created_at, updated_at, item_code, platform, use_case, industry, price_amount,
  currency, demo_url, order_url, badge_label, is_featured, sort_order, license_summary
) on public.design_items to anon, authenticated;
