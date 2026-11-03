create extension if not exists pg_cron;
create schema if not exists private;
revoke all on schema private from public,anon,authenticated;
create or replace function private.expire_bagusin_unpaid_orders()
returns integer language plpgsql security invoker set search_path = '' as $$
declare v_count integer := 0;
begin
 with expired_orders as (
  update public.orders o set order_status='expired'
  where o.order_status='awaiting_payment' and o.payment_status in ('unpaid','rejected')
   and o.expires_at is not null and o.expires_at<=now()
   and not exists(select 1 from public.payments p where p.order_id=o.id and p.payment_status in ('proof_submitted','verified'))
  returning o.id
 )
 update public.invoices i set invoice_status='expired',updated_at=now()
 from expired_orders e where i.order_id=e.id and i.invoice_status='issued';
 get diagnostics v_count = row_count;
 return v_count;
end; $$;
create or replace function private.queue_bagusin_payment_reminders()
returns integer language plpgsql security invoker set search_path = '' as $$
declare r record; v_offset integer; v_key text; v_queued integer:=0; v_scheduled timestamptz;
begin
 for r in
  select o.id as order_id,o.customer_id,o.order_number,o.customer_name,o.customer_email,o.customer_phone,o.total_amount,
         i.invoice_number,i.issued_at,i.due_at
  from public.orders o join public.invoices i on i.order_id=o.id
  where o.order_status='awaiting_payment' and o.payment_status in ('unpaid','rejected')
   and i.invoice_status='issued' and i.issued_at is not null and i.due_at>now()
   and not exists(select 1 from public.payments p where p.order_id=o.id and p.payment_status in ('proof_submitted','verified'))
 loop
  foreach v_offset in array array[2,12,22] loop
   v_scheduled:=r.issued_at+make_interval(hours=>v_offset);v_key:='payment_reminder_'||v_offset||'h';
   if v_scheduled<=now() and v_scheduled<r.due_at then
    if r.customer_phone is not null and not exists(select 1 from public.notification_outbox n where n.order_id=r.order_id and n.channel='whatsapp' and n.template_key=v_key) then
     insert into public.notification_outbox(order_id,customer_id,channel,template_key,recipient,payload,scheduled_at)
     values(r.order_id,r.customer_id,'whatsapp',v_key,r.customer_phone,jsonb_build_object('order_number',r.order_number,'invoice_number',r.invoice_number,'customer_name',r.customer_name,'amount',r.total_amount,'due_at',r.due_at,'hours_after_invoice',v_offset),v_scheduled);
     v_queued:=v_queued+1;
    end if;
    if r.customer_email is not null and not exists(select 1 from public.notification_outbox n where n.order_id=r.order_id and n.channel='email' and n.template_key=v_key) then
     insert into public.notification_outbox(order_id,customer_id,channel,template_key,recipient,payload,scheduled_at)
     values(r.order_id,r.customer_id,'email',v_key,r.customer_email,jsonb_build_object('order_number',r.order_number,'invoice_number',r.invoice_number,'customer_name',r.customer_name,'amount',r.total_amount,'due_at',r.due_at,'hours_after_invoice',v_offset),v_scheduled);
     v_queued:=v_queued+1;
    end if;
   end if;
  end loop;
 end loop;
 return v_queued;
end; $$;
do $$
declare v_job bigint;
begin
 select jobid into v_job from cron.job where jobname='bagusin-expire-unpaid-orders';
 if v_job is not null then perform cron.unschedule(v_job); end if;
 select jobid into v_job from cron.job where jobname='bagusin-queue-payment-reminders';
 if v_job is not null then perform cron.unschedule(v_job); end if;
 perform cron.schedule('bagusin-expire-unpaid-orders','*/5 * * * *','select private.expire_bagusin_unpaid_orders();');
 perform cron.schedule('bagusin-queue-payment-reminders','*/5 * * * *','select private.queue_bagusin_payment_reminders();');
end; $$;
