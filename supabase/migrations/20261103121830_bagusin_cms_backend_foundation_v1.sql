-- Bagusin CMS backend foundation v1.
-- Adds business/editorial/course management structures; no My Bali or social features.
-- Legacy social/community tables are retained for rollback safety but removed from API access.

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  description text, sort_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.article_tags (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.article_tag_assignments (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.article_tags(id) on delete cascade, primary key (article_id, tag_id)
);
alter table public.articles
  add column if not exists category_id uuid references public.article_categories(id) on delete set null,
  add column if not exists language text not null default 'id',
  add column if not exists seo_title text, add column if not exists seo_description text,
  add column if not exists reading_time_minutes integer, add column if not exists is_featured boolean not null default false;

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  description text, sort_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.service_categories(id) on delete set null,
  slug text not null unique, name text not null, short_description text, description text not null default '',
  status text not null default 'draft' check (status in ('draft','published','coming_soon','archived')),
  sort_order integer not null default 0, is_featured boolean not null default false,
  seo_title text, seo_description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  project_type text not null default 'concept' check (project_type in ('client','concept','internal','experiment')),
  industry text, summary text, description text not null default '', cover_image_path text,
  gallery_paths text[] not null default '{}', demo_url text, live_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean not null default false, sort_order integer not null default 0, completed_at date,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.course_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  description text, sort_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.course_categories(id) on delete set null,
  slug text not null unique, title text not null, short_description text, description text not null default '',
  delivery_mode text not null default 'private' check (delivery_mode in ('private','online','onsite','hybrid')),
  instructor_name text, meeting_count integer, duration_hours numeric(7,2), max_sessions_per_week integer,
  price_amount numeric(14,2), currency text not null default 'IDR', schedule_note text, cover_image_url text,
  outcomes text[] not null default '{}', requirements text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','coming_soon','archived')),
  is_featured boolean not null default false, sort_order integer not null default 0,
  seo_title text, seo_description text, published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint courses_meeting_count_nonnegative check (meeting_count is null or meeting_count >= 0),
  constraint courses_duration_nonnegative check (duration_hours is null or duration_hours >= 0),
  constraint courses_price_nonnegative check (price_amount is null or price_amount >= 0)
);
create table if not exists public.course_curriculum (
  id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id) on delete cascade,
  session_number integer not null, title text not null, description text,
  is_review_session boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), unique (course_id, session_number),
  constraint course_curriculum_session_positive check (session_number > 0)
);
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  request_type text not null default 'project' check (request_type in ('project','consultation','course','template','general')),
  full_name text not null check (length(trim(full_name)) between 2 and 120),
  email text not null check (length(trim(email)) <= 254), phone text, company_name text,
  service_id uuid references public.services(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  subject text, message text not null check (length(trim(message)) between 5 and 10000),
  budget_range text, desired_timeline text, locale text not null default 'id' check (locale in ('id','en')),
  source_path text, status text not null default 'new' check (status in ('new','in_review','replied','qualified','closed','spam')),
  admin_notes text, assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null check (bucket_id in ('bagusin-public','bagusin-private')),
  object_path text not null, file_name text not null, mime_type text, file_size_bytes bigint,
  alt_text text, caption text, uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), unique (bucket_id, object_path),
  constraint media_assets_file_size_positive check (file_size_bytes is null or file_size_bytes > 0)
);
create table if not exists public.site_settings (
  setting_key text primary key, setting_value jsonb not null default '{}'::jsonb,
  description text, updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.design_items
  add column if not exists item_code text, add column if not exists platform text,
  add column if not exists use_case text, add column if not exists industry text,
  add column if not exists price_amount numeric(14,2), add column if not exists currency text not null default 'IDR',
  add column if not exists demo_url text, add column if not exists order_url text,
  add column if not exists badge_label text, add column if not exists is_featured boolean not null default false,
  add column if not exists sort_order integer not null default 0, add column if not exists license_summary text;
create unique index if not exists design_items_item_code_unique on public.design_items(item_code) where item_code is not null;

create index if not exists articles_category_published_idx on public.articles(category_id, published_at desc) where status = 'published';
create index if not exists services_status_sort_idx on public.services(status, sort_order, name);
create index if not exists portfolio_projects_public_idx on public.portfolio_projects(status, is_featured desc, sort_order, created_at desc);
create index if not exists courses_status_sort_idx on public.courses(status, sort_order, title);
create index if not exists course_curriculum_course_sort_idx on public.course_curriculum(course_id, sort_order, session_number);
create index if not exists inquiries_inbox_idx on public.inquiries(status, created_at desc);
create index if not exists media_assets_uploader_idx on public.media_assets(uploaded_by, created_at desc);

alter table public.article_categories enable row level security;
alter table public.article_tags enable row level security;
alter table public.article_tag_assignments enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.course_categories enable row level security;
alter table public.courses enable row level security;
alter table public.course_curriculum enable row level security;
alter table public.inquiries enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists articles_insert_self on public.articles;
drop policy if exists articles_update_self on public.articles;
drop policy if exists articles_delete_self on public.articles;
drop policy if exists articles_read_published on public.articles;
create policy articles_public_read on public.articles for select to anon, authenticated using (
  status = 'published' or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy articles_admin_insert on public.articles for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy articles_admin_update on public.articles for update to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy articles_admin_delete on public.articles for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists design_items_insert_self on public.design_items;
drop policy if exists design_items_update_self on public.design_items;
drop policy if exists design_items_delete_self on public.design_items;
drop policy if exists design_items_read_published on public.design_items;
create policy design_items_public_read on public.design_items for select to anon, authenticated using (
  status='published' or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy design_items_admin_insert on public.design_items for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy design_items_admin_update on public.design_items for update to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy design_items_admin_delete on public.design_items for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

create policy article_categories_public_read on public.article_categories for select to anon, authenticated
  using (is_active or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_categories_admin_write on public.article_categories for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_tags_public_read on public.article_tags for select to anon, authenticated using (
  exists (select 1 from public.article_tag_assignments ata join public.articles a on a.id=ata.article_id where ata.tag_id=id and a.status='published')
  or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy article_tags_admin_write on public.article_tags for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_tag_assignments_public_read on public.article_tag_assignments for select to anon, authenticated using (
  exists (select 1 from public.articles a where a.id=article_id and a.status='published')
  or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy article_tag_assignments_admin_write on public.article_tag_assignments for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

create policy service_categories_public_read on public.service_categories for select to anon, authenticated
  using (is_active or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy service_categories_admin_write on public.service_categories for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy services_public_read on public.services for select to anon, authenticated using (
  status='published' or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy services_admin_write on public.services for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

create policy portfolio_public_read on public.portfolio_projects for select to anon, authenticated using (
  status='published' or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy portfolio_admin_write on public.portfolio_projects for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

create policy course_categories_public_read on public.course_categories for select to anon, authenticated
  using (is_active or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_categories_admin_write on public.course_categories for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy courses_public_read on public.courses for select to anon, authenticated using (
  status='published' or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy courses_admin_write on public.courses for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_curriculum_public_read on public.course_curriculum for select to anon, authenticated using (
  exists (select 1 from public.courses c where c.id=course_id and c.status='published')
  or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
create policy course_curriculum_admin_write on public.course_curriculum for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

create policy inquiries_public_insert on public.inquiries for insert to anon, authenticated
  with check (status='new' and admin_notes is null and assigned_to is null);
create policy inquiries_admin_read on public.inquiries for select to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy inquiries_admin_update on public.inquiries for update to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy inquiries_admin_delete on public.inquiries for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

create policy media_assets_admin_read on public.media_assets for select to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy media_assets_admin_write on public.media_assets for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy site_settings_admin_all on public.site_settings for all to authenticated
  using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

revoke all on public.posts, public.post_comments, public.post_reactions, public.communities,
  public.community_members, public.article_comments from anon, authenticated, public;

grant select on public.article_categories, public.article_tags, public.article_tag_assignments,
  public.service_categories, public.services, public.portfolio_projects, public.course_categories,
  public.courses, public.course_curriculum to anon;
grant insert on public.inquiries to anon;
grant select, insert, update, delete on public.articles, public.article_categories, public.article_tags,
  public.article_tag_assignments, public.services, public.service_categories, public.portfolio_projects,
  public.course_categories, public.courses, public.course_curriculum, public.design_items,
  public.media_assets, public.site_settings to authenticated;
grant select, insert, update, delete on public.inquiries to authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('bagusin-public','bagusin-public',true,8388608,array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
on conflict (id) do nothing;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('bagusin-private','bagusin-private',false,15728640,array['application/pdf','image/jpeg','image/png','image/webp','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

drop policy if exists bagusin_public_media_admin_list on storage.objects;
create policy bagusin_public_media_admin_list on storage.objects for select to authenticated
  using (bucket_id='bagusin-public' and exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists bagusin_public_media_admin_insert on storage.objects;
create policy bagusin_public_media_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id='bagusin-public' and exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists bagusin_public_media_admin_update on storage.objects;
create policy bagusin_public_media_admin_update on storage.objects for update to authenticated
  using (bucket_id='bagusin-public' and exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (bucket_id='bagusin-public' and exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists bagusin_public_media_admin_delete on storage.objects;
create policy bagusin_public_media_admin_delete on storage.objects for delete to authenticated
  using (bucket_id='bagusin-public' and exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists bagusin_private_media_admin_all on storage.objects;
create policy bagusin_private_media_admin_all on storage.objects for all to authenticated
  using (bucket_id='bagusin-private' and exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
  with check (bucket_id='bagusin-private' and exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now(); return new; end;
$$;
revoke all on function private.set_updated_at() from public,anon,authenticated;
drop trigger if exists article_categories_set_updated_at on public.article_categories;
create trigger article_categories_set_updated_at before update on public.article_categories for each row execute function private.set_updated_at();
drop trigger if exists service_categories_set_updated_at on public.service_categories;
create trigger service_categories_set_updated_at before update on public.service_categories for each row execute function private.set_updated_at();
drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at before update on public.services for each row execute function private.set_updated_at();
drop trigger if exists portfolio_projects_set_updated_at on public.portfolio_projects;
create trigger portfolio_projects_set_updated_at before update on public.portfolio_projects for each row execute function private.set_updated_at();
drop trigger if exists course_categories_set_updated_at on public.course_categories;
create trigger course_categories_set_updated_at before update on public.course_categories for each row execute function private.set_updated_at();
drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at before update on public.courses for each row execute function private.set_updated_at();
drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at before update on public.inquiries for each row execute function private.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function private.set_updated_at();
