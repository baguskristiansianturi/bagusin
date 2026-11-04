alter table public.store_products
  add column if not exists specifications jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.store_products'::regclass
      and conname = 'store_products_specifications_array_check'
  ) then
    alter table public.store_products
      add constraint store_products_specifications_array_check
      check (jsonb_typeof(specifications) = 'array');
  end if;
end
$$;