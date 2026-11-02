-- Bagusin foundation schema v1
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username is null or username ~ '^[a-zA-Z0-9_]{3,30}$')
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text,
  media_urls text[] not null default '{}',
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')),
  status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_content_required check (nullif(trim(coalesce(body,'')), '') is not null or cardinality(media_urls) > 0)
);
create index posts_feed_idx on public.posts (created_at desc) where status = 'published' and visibility = 'public';
create index posts_author_idx on public.posts (author_id, created_at desc);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index post_comments_post_idx on public.post_comments (post_id, created_at);

create table public.post_reactions (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null default 'like' check (reaction in ('like','love','insightful')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 180),
  slug text not null unique,
  excerpt text,
  body text not null default '',
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index articles_published_idx on public.articles (published_at desc) where status = 'published';

create table public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index article_comments_article_idx on public.article_comments (article_id, created_at);

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) between 2 and 100),
  slug text not null unique,
  description text,
  avatar_url text,
  is_public boolean not null default true,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now()
);

create table public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'member' check (member_role in ('member','moderator')),
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table public.design_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.design_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.design_categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null check (length(trim(title)) between 1 and 180),
  slug text not null unique,
  description text,
  preview_image_url text,
  preview_images text[] not null default '{}',
  resource_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index design_items_category_idx on public.design_items (category_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.articles enable row level security;
alter table public.article_comments enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.design_categories enable row level security;
alter table public.design_items enable row level security;

create policy "profiles_select_public" on public.profiles for select to anon, authenticated using (true);
create policy "profiles_insert_self" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_self" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "posts_read_public" on public.posts for select to anon, authenticated using (status = 'published' and visibility = 'public' or (select auth.uid()) = author_id);
create policy "posts_insert_self" on public.posts for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "posts_update_self" on public.posts for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "posts_delete_self" on public.posts for delete to authenticated using ((select auth.uid()) = author_id);

create policy "post_comments_read_visible" on public.post_comments for select to anon, authenticated
using (exists (select 1 from public.posts p where p.id = post_id and p.status = 'published' and p.visibility = 'public') or (select auth.uid()) = author_id);
create policy "post_comments_insert_self" on public.post_comments for insert to authenticated
with check ((select auth.uid()) = author_id and exists (select 1 from public.posts p where p.id = post_id and p.status = 'published' and p.visibility = 'public'));
create policy "post_comments_delete_self" on public.post_comments for delete to authenticated using ((select auth.uid()) = author_id);

create policy "post_reactions_read_visible" on public.post_reactions for select to anon, authenticated
using (exists (select 1 from public.posts p where p.id = post_id and p.status = 'published' and p.visibility = 'public') or (select auth.uid()) = user_id);
create policy "post_reactions_insert_self" on public.post_reactions for insert to authenticated
with check ((select auth.uid()) = user_id and exists (select 1 from public.posts p where p.id = post_id and p.status = 'published' and p.visibility = 'public'));
create policy "post_reactions_delete_self" on public.post_reactions for delete to authenticated using ((select auth.uid()) = user_id);

create policy "articles_read_published" on public.articles for select to anon, authenticated using (status = 'published' or (select auth.uid()) = author_id);
create policy "articles_insert_self" on public.articles for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "articles_update_self" on public.articles for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "articles_delete_self" on public.articles for delete to authenticated using ((select auth.uid()) = author_id);

create policy "article_comments_read_published" on public.article_comments for select to anon, authenticated
using (exists (select 1 from public.articles a where a.id = article_id and a.status = 'published') or (select auth.uid()) = author_id);
create policy "article_comments_insert_self" on public.article_comments for insert to authenticated
with check ((select auth.uid()) = author_id and exists (select 1 from public.articles a where a.id = article_id and a.status = 'published'));
create policy "article_comments_delete_self" on public.article_comments for delete to authenticated using ((select auth.uid()) = author_id);

create policy "communities_read_active" on public.communities for select to anon, authenticated
using (status = 'active' and is_public = true or (select auth.uid()) = owner_id);
create policy "communities_insert_owner" on public.communities for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "communities_update_owner" on public.communities for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "communities_delete_owner" on public.communities for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "community_members_read_self" on public.community_members for select to authenticated using ((select auth.uid()) = user_id);
create policy "community_members_join_self" on public.community_members for insert to authenticated
with check ((select auth.uid()) = user_id and member_role = 'member' and exists (select 1 from public.communities c where c.id = community_id and c.status = 'active' and c.is_public = true));
create policy "community_members_leave_self" on public.community_members for delete to authenticated using ((select auth.uid()) = user_id);

create policy "design_categories_read_active" on public.design_categories for select to anon, authenticated using (is_active = true);
create policy "design_items_read_published" on public.design_items for select to anon, authenticated
using (status = 'published' or (select auth.uid()) = author_id);
create policy "design_items_insert_self" on public.design_items for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "design_items_update_self" on public.design_items for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "design_items_delete_self" on public.design_items for delete to authenticated using ((select auth.uid()) = author_id);

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.posts, public.post_comments, public.post_reactions,
  public.articles, public.article_comments, public.communities, public.design_categories, public.design_items
  to anon;
grant select, insert, update, delete on public.profiles, public.posts, public.post_comments, public.post_reactions,
  public.articles, public.article_comments, public.communities, public.community_members, public.design_items
  to authenticated;
grant select on public.design_categories to authenticated;
