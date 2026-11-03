create or replace function public.validate_bagusin_payment_submission()
returns trigger language plpgsql set search_path = '' as $$
declare v_customer uuid; v_total numeric(14,2); v_order_status text;
begin
 select o.customer_id,o.total_amount,o.order_status into v_customer,v_total,v_order_status from public.orders o where o.id=new.order_id;
 if not found or v_customer is distinct from (select auth.uid()) then raise exception 'Order not found for this customer'; end if;
 if v_order_status <> 'awaiting_payment' then raise exception 'This order is not accepting payment yet'; end if;
 if new.customer_id is distinct from (select auth.uid()) or new.amount <> v_total then raise exception 'Payment details do not match the order'; end if;
 if new.method <> 'bank_transfer' or new.bank_name <> 'BCA' or new.account_holder <> 'Bagus' then raise exception 'Only the configured manual BCA transfer method is available'; end if;
 if new.payment_status='proof_submitted' and new.proof_path is null then raise exception 'A transfer receipt is required'; end if;
 if new.proof_path is not null and split_part(new.proof_path,'/',1) <> (select auth.uid())::text then raise exception 'Payment proof must be stored in the customer folder'; end if;
 return new;
end; $$;
create index if not exists course_enrollments_order_item_idx on public.course_enrollments(order_item_id);
create index if not exists digital_entitlements_order_item_idx on public.digital_entitlements(order_item_id);
drop policy if exists customer_addresses_admin_read on public.customer_addresses;