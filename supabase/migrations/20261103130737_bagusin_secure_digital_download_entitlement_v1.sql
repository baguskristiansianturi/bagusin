create or replace function public.consume_bagusin_digital_entitlement(p_entitlement_id uuid)
returns table(storage_bucket text, storage_path text, item_name text, download_count integer, download_limit integer)
language plpgsql security definer set search_path = '' as $$
begin
 if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
 return query
 update public.digital_entitlements de set download_count=de.download_count+1,updated_at=now()
 from public.order_items oi join public.orders o on o.id=oi.order_id
 where de.id=p_entitlement_id and de.order_item_id=oi.id
 and de.customer_id=(select auth.uid()) and de.entitlement_status='active'
 and (de.expires_at is null or de.expires_at>now())
 and (de.download_limit is null or de.download_count<de.download_limit)
 and o.customer_id=(select auth.uid()) and o.payment_status='paid' and o.order_status='completed'
 returning de.storage_bucket,de.storage_path,de.item_name,de.download_count,de.download_limit;
 if not found then raise exception 'No active paid entitlement or download limit reached'; end if;
end; $$;
revoke all on function public.consume_bagusin_digital_entitlement(uuid) from public,anon;
grant execute on function public.consume_bagusin_digital_entitlement(uuid) to authenticated;
