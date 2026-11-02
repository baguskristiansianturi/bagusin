-- Bagusin backend foundation
-- PostgreSQL / Supabase migration. Apply only to a new Supabase project after reviewing.
-- Public content is readable; all writes require an authenticated Bagusin admin.
-- Never put the Supabase service_role key in frontend code.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_path text,
  role text not null default 'member' check (role in ('member','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_bagusin_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_bagusin on auth.users;
create trigger on_auth_user_created_bagusin after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.protect_profile_role()
returns trigger language plpgsql set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_bagusin_admin() and current_user not in ('postgres','supabase_admin') then
    raise exception 'Only a Bagusin admin can change account roles';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists protect_bagusin_profile_role on public.profiles;
create trigger protect_bagusin_profile_role before update on public.profiles
for each row execute procedure public.protect_profile_role();

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.article_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  cover_image_path text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_publication_idx on public.articles (published_at desc) where status = 'published';
create index if not exists articles_category_idx on public.articles (category_id);

create table if not exists public.article_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.article_tag_assignments (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.article_tags(id) on delete cascade,
  primary key (article_id, tag_id)
);
create index if not exists article_tag_assignments_tag_idx on public.article_tag_assignments (tag_id);

create table if not exists public.design_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.design_templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.design_categories(id) on delete set null,
  code text unique,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  price_amount bigint,
  currency char(3) not null default 'IDR',
  status text not null default 'draft' check (status in ('draft','available','unavailable','archived')),
  preview_path text,
  demo_url text,
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists design_templates_listing_idx on public.design_templates (status, sort_order, created_at desc);
create index if not exists design_templates_category_idx on public.design_templates (category_id);

create table if not exists public.design_template_images (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.design_templates(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists design_template_images_order_idx on public.design_template_images (template_id, sort_order);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description text,
  instructor_name text,
  cover_image_path text,
  price_amount bigint,
  currency char(3) not null default 'IDR',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists course_modules_order_idx on public.course_modules (course_id, sort_order);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  content text not null default '',
  video_url text,
  duration_minutes integer,
  is_preview boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists course_lessons_order_idx on public.course_lessons (module_id, sort_order);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','completed','cancelled')),
  enrolled_at timestamptz not null default now(),
  unique (course_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.article_categories enable row level security;
alter table public.article_tags enable row level security;
alter table public.article_tag_assignments enable row level security;
alter table public.articles enable row level security;
alter table public.design_categories enable row level security;
alter table public.design_templates enable row level security;
alter table public.design_template_images enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_enrollments enable row level security;

create policy "Public can read article categories" on public.article_categories for select using (true);
create policy "Admins manage article categories" on public.article_categories for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Public can read article tags" on public.article_tags for select using (true);
create policy "Admins manage article tags" on public.article_tags for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Public can read tags assigned to published articles" on public.article_tag_assignments for select using (
  exists (select 1 from public.articles a where a.id = article_id and ((a.status = 'published' and a.published_at <= now()) or public.is_bagusin_admin()))
);
create policy "Admins manage article tag assignments" on public.article_tag_assignments for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Public can read published articles" on public.articles for select using ((status = 'published' and published_at <= now()) or public.is_bagusin_admin());
create policy "Admins manage articles" on public.articles for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());

create policy "Public can read design categories" on public.design_categories for select using (true);
create policy "Admins manage design categories" on public.design_categories for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Public can read available templates" on public.design_templates for select using (status = 'available' or public.is_bagusin_admin());
create policy "Admins manage templates" on public.design_templates for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Public can read visible template images" on public.design_template_images for select using (
  exists (select 1 from public.design_templates t where t.id = template_id and (t.status = 'available' or public.is_bagusin_admin()))
);
create policy "Admins manage template images" on public.design_template_images for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());

create policy "Public can read published courses" on public.courses for select using (status = 'published' or public.is_bagusin_admin());
create policy "Admins manage courses" on public.courses for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Public can read modules for published courses" on public.course_modules for select using (
  exists (select 1 from public.courses c where c.id = course_id and (c.status = 'published' or public.is_bagusin_admin()))
);
create policy "Admins manage course modules" on public.course_modules for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Public can read preview lessons" on public.course_lessons for select using (
  exists (
    select 1 from public.course_modules m join public.courses c on c.id = m.course_id
    where m.id = module_id and ((c.status = 'published' and is_preview) or public.is_bagusin_admin())
  )
);
create policy "Admins manage course lessons" on public.course_lessons for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());
create policy "Users read own enrollments; admins read all" on public.course_enrollments for select using (user_id = auth.uid() or public.is_bagusin_admin());
create policy "Admins manage enrollments" on public.course_enrollments for all using (public.is_bagusin_admin()) with check (public.is_bagusin_admin());

create policy "Users read own profile; admins read all" on public.profiles for select using (id = auth.uid() or public.is_bagusin_admin());
create policy "Users update own profile; admins update all" on public.profiles for update using (id = auth.uid() or public.is_bagusin_admin()) with check (id = auth.uid() or public.is_bagusin_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('bagusin-article-media', 'bagusin-article-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']),
  ('bagusin-design-previews', 'bagusin-design-previews', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']),
  ('bagusin-course-media', 'bagusin-course-media', false, 10485760, array['image/jpeg','image/png','image/webp','image/avif','application/pdf'])
on conflict (id) do nothing;

create policy "Public can view Bagusin media" on storage.objects for select using (bucket_id in ('bagusin-article-media','bagusin-design-previews'));
create policy "Admins upload Bagusin media" on storage.objects for insert with check (bucket_id in ('bagusin-article-media','bagusin-design-previews','bagusin-course-media') and public.is_bagusin_admin());
create policy "Admins update Bagusin media" on storage.objects for update using (bucket_id in ('bagusin-article-media','bagusin-design-previews','bagusin-course-media') and public.is_bagusin_admin()) with check (bucket_id in ('bagusin-article-media','bagusin-design-previews','bagusin-course-media') and public.is_bagusin_admin());
create policy "Admins delete Bagusin media" on storage.objects for delete using (bucket_id in ('bagusin-article-media','bagusin-design-previews','bagusin-course-media') and public.is_bagusin_admin());
