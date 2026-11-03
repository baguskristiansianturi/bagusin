-- Bagusin Store product image gallery (maximum 15 images per product)
create table if not exists public.store_product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.store_products(id) on delete cascade,
  image_path text not null,
  alt_text text,
  sort_order smallint not null default 0 check (sort_order between 0 and 14),
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists store_product_images_product_order_idx
  on public.store_product_images(product_id, sort_order, created_at);
create unique index if not exists store_product_images_one_primary_idx
  on public.store_product_images(product_id) where is_primary;
alter table public.store_product_images enable row level security;
grant select on public.store_product_images to anon, authenticated;
grant insert, update, delete on public.store_product_images to authenticated;
drop policy if exists store_product_images_public_read on public.store_product_images;
create policy store_product_images_public_read on public.store_product_images
for select to anon, authenticated
using (
  exists (select 1 from public.store_products p where p.id = product_id and p.status = 'published')
  or exists (select 1 from public.profiles pr where pr.id = (select auth.uid()) and pr.role = 'admin')
);
drop policy if exists store_product_images_admin_insert on public.store_product_images;
create policy store_product_images_admin_insert on public.store_product_images
for insert to authenticated
with check (exists (select 1 from public.profiles pr where pr.id = (select auth.uid()) and pr.role = 'admin'));
drop policy if exists store_product_images_admin_update on public.store_product_images;
create policy store_product_images_admin_update on public.store_product_images
for update to authenticated
using (exists (select 1 from public.profiles pr where pr.id = (select auth.uid()) and pr.role = 'admin'))
with check (exists (select 1 from public.profiles pr where pr.id = (select auth.uid()) and pr.role = 'admin'));
drop policy if exists store_product_images_admin_delete on public.store_product_images;
create policy store_product_images_admin_delete on public.store_product_images
for delete to authenticated
using (exists (select 1 from public.profiles pr where pr.id = (select auth.uid()) and pr.role = 'admin'));
create or replace function public.enforce_store_product_image_limit()
returns trigger
language plpgsql
set search_path = public
as $$
declare image_count integer;
begin
  perform 1 from public.store_products where id = new.product_id for update;
  select count(*) into image_count
  from public.store_product_images
  where product_id = new.product_id
    and (tg_op = 'INSERT' or id <> new.id);
  if image_count >= 15 then
    raise exception 'Maksimal 15 gambar untuk setiap produk.';
  end if;
  return new;
end;
$$;
drop trigger if exists store_product_images_limit on public.store_product_images;
create trigger store_product_images_limit
before insert or update of product_id on public.store_product_images
for each row execute function public.enforce_store_product_image_limit();
insert into public.store_product_images(product_id,image_path,alt_text,sort_order,is_primary)
select id,image_path,name,0,true
from public.store_products p
where image_path is not null and btrim(image_path)<>''
  and not exists(select 1 from public.store_product_images i where i.product_id=p.id);
