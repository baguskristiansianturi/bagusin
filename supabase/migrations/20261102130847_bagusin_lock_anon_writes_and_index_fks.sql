revoke insert, update, delete on public.profiles, public.posts, public.post_comments, public.post_reactions,
  public.articles, public.article_comments, public.communities, public.community_members,
  public.design_categories, public.design_items from anon, public;

create index if not exists post_comments_author_idx on public.post_comments (author_id);
create index if not exists post_reactions_user_idx on public.post_reactions (user_id);
create index if not exists articles_author_idx on public.articles (author_id);
create index if not exists article_comments_author_idx on public.article_comments (author_id);
create index if not exists communities_owner_idx on public.communities (owner_id);
create index if not exists community_members_user_idx on public.community_members (user_id);
create index if not exists design_items_author_idx on public.design_items (author_id);
