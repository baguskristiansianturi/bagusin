alter table public.store_products add column if not exists sold_count integer not null default 0 check (sold_count >= 0);
create or replace function public.sync_store_product_sold_count()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare v_delta integer;
begin
 if old.order_status is distinct from 'completed' and new.order_status = 'completed' then v_delta := 1;
 elsif old.order_status = 'completed' and new.order_status is distinct from 'completed' then v_delta := -1;
 else return new; end if;
 update public.store_products p set sold_count=greatest(0,p.sold_count+(oi.quantity*v_delta))
 from public.order_items oi where oi.order_id=new.id and oi.item_type='store_product' and oi.item_reference_id=p.id;
 return new;
end; $$;
drop trigger if exists orders_sync_store_product_sold_count on public.orders;
create trigger orders_sync_store_product_sold_count after update of order_status on public.orders for each row when (old.order_status is distinct from new.order_status) execute function public.sync_store_product_sold_count();
revoke all on function public.sync_store_product_sold_count() from public, anon, authenticated;
