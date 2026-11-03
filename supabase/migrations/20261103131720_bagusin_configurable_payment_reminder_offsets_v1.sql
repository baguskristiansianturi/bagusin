create or replace function private.queue_bagusin_payment_reminders()
returns integer language plpgsql security invoker set search_path = '' as $$
declare r record;v_offset integer;v_offsets integer[];v_key text;v_queued integer:=0;v_scheduled timestamptz;
begin
 select array_agg((value #>> '{}')::integer order by ordinality) into v_offsets
 from jsonb_array_elements(coalesce((select setting_value from public.site_settings where setting_key='payment_reminder_hours'),'[2,12,22]'::jsonb)) with ordinality;
 if v_offsets is null or cardinality(v_offsets)=0 then v_offsets:=array[2,12,22];end if;
 for r in select o.id as order_id,o.customer_id,o.order_number,o.customer_name,o.customer_email,o.customer_phone,o.total_amount,i.invoice_number,i.issued_at,i.due_at
 from public.orders o join public.invoices i on i.order_id=o.id
 where o.order_status='awaiting_payment' and o.payment_status in ('unpaid','rejected') and i.invoice_status='issued'
 and i.issued_at is not null and i.due_at>now()
 and not exists(select 1 from public.payments p where p.order_id=o.id and p.payment_status in ('proof_submitted','verified'))
 loop
  foreach v_offset in array v_offsets loop
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
