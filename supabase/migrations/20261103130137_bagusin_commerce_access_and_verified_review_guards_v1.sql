-- Tighten commerce access: only admins create/update orders and customers cannot set payment states.
revoke insert on public.orders from authenticated;
drop policy if exists orders_customer_create on public.orders;
create policy orders_admin_insert on public.orders for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists order_items_admin_write on public.order_items;
create policy order_items_admin_insert on public.order_items for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy order_items_admin_update on public.order_items for update to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy order_items_admin_delete on public.order_items for delete to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists order_history_admin_write on public.order_status_history;
create policy order_history_admin_insert on public.order_status_history for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy order_history_admin_update on public.order_status_history for update to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy order_history_admin_delete on public.order_status_history for delete to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists shipments_admin_write on public.shipments;
create policy shipments_admin_insert on public.shipments for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy shipments_admin_update on public.shipments for update to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy shipments_admin_delete on public.shipments for delete to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists store_products_admin_write on public.store_products;
create policy store_products_admin_insert on public.store_products for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy store_products_admin_update on public.store_products for update to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy store_products_admin_delete on public.store_products for delete to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create index if not exists notification_outbox_customer_idx on public.notification_outbox(customer_id);
create index if not exists notification_outbox_order_idx on public.notification_outbox(order_id);
create index if not exists order_status_history_changed_by_idx on public.order_status_history(changed_by);
create index if not exists payments_customer_idx on public.payments(customer_id);
create index if not exists payments_verified_by_idx on public.payments(verified_by);
create index if not exists product_reviews_customer_idx on public.product_reviews(customer_id);
create or replace function public.validate_bagusin_payment_submission()
returns trigger language plpgsql set search_path = '' as $$
declare v_customer uuid; v_total numeric(14,2); v_order_status text;
begin
 select o.customer_id,o.total_amount,o.order_status into v_customer,v_total,v_order_status from public.orders o where o.id=new.order_id;
 if not found or v_customer is distinct from (select auth.uid()) then raise exception 'Order not found for this customer'; end if;
 if v_order_status <> 'awaiting_payment' then raise exception 'This order is not accepting payment yet'; end if;
 if new.customer_id is distinct from (select auth.uid()) or new.amount <> v_total then raise exception 'Payment details do not match the order'; end if;
 if new.method <> 'bank_transfer' or new.bank_name <> 'BCA' or new.account_holder <> 'Bagus' then raise exception 'Only the configured manual BCA transfer method is available'; end if;
 if new.proof_path is not null and split_part(new.proof_path,'/',1) <> (select auth.uid())::text then raise exception 'Payment proof must be stored in the customer folder'; end if;
 return new;
end; $$;
drop trigger if exists validate_bagusin_payment_submission on public.payments;
create trigger validate_bagusin_payment_submission before insert on public.payments for each row execute function public.validate_bagusin_payment_submission();
create or replace function public.validate_bagusin_verified_review()
returns trigger language plpgsql set search_path = '' as $$
declare v_customer uuid; v_order_status text; v_payment_status text; v_item_type text; v_item_slug text; v_item_name text;
begin
 select o.customer_id,o.order_status,o.payment_status,oi.item_type,oi.item_slug,oi.item_name into v_customer,v_order_status,v_payment_status,v_item_type,v_item_slug,v_item_name
 from public.order_items oi join public.orders o on o.id=oi.order_id where oi.id=new.order_item_id;
 if not found or v_customer is distinct from (select auth.uid()) or new.customer_id is distinct from (select auth.uid()) then raise exception 'A verified purchase is required to review this item'; end if;
 if v_order_status <> 'completed' or v_payment_status <> 'paid' then raise exception 'Only paid and completed orders can be reviewed'; end if;
 new.item_type:=v_item_type; new.item_slug:=v_item_slug; new.item_name:=v_item_name; new.verified_purchase:=true; new.moderation_status:='pending';
 return new;
end; $$;
drop trigger if exists validate_bagusin_verified_review on public.product_reviews;
create trigger validate_bagusin_verified_review before insert on public.product_reviews for each row execute function public.validate_bagusin_verified_review();
create or replace function public.record_bagusin_order_status_history()
returns trigger language plpgsql set search_path = '' as $$
begin
 if old.order_status is distinct from new.order_status then
  insert into public.order_status_history(order_id,changed_by,status_type,old_status,new_status) values(new.id,(select auth.uid()),'order',old.order_status,new.order_status);
 end if;
 if old.payment_status is distinct from new.payment_status then
  insert into public.order_status_history(order_id,changed_by,status_type,old_status,new_status) values(new.id,(select auth.uid()),'payment',old.payment_status,new.payment_status);
 end if;
 if old.fulfillment_status is distinct from new.fulfillment_status then
  insert into public.order_status_history(order_id,changed_by,status_type,old_status,new_status) values(new.id,(select auth.uid()),'fulfillment',old.fulfillment_status,new.fulfillment_status);
 end if;
 return new;
end; $$;
drop trigger if exists record_bagusin_order_status_history on public.orders;
create trigger record_bagusin_order_status_history after update on public.orders for each row execute function public.record_bagusin_order_status_history();
