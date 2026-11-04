alter table public.store_product_variants
  add column if not exists image_path text;

comment on column public.store_product_variants.image_path is
  'Public bagusin-public Storage object path for the selected variant image';
