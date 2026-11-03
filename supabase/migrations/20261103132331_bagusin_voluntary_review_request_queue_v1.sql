insert into public.site_settings(setting_key,setting_value,description)
values('review_request_delay_hours','24'::jsonb,'Hours after order completion before a voluntary review invitation is queued')
on conflict(setting_key) do nothing;
create or replace function private.queue_bagusin_review_requests()
returns integer language plpgsql security invoker set search_path = '' as $$
declare r record;v_delay integer;v_scheduled timestamptz;v_queued integer:=0;
begin
 select coalesce((setting_value #>> '{}')::integer,24) into v_delay from public.site_settings where setting_key='review_request_delay_hours';
 if v_delay is null or v_delay<1 or v_delay>720 then v_delay:=24;end if;
 for r in select o.id as order_id,o.customer_id,o.order_number,o.customer_name,o.customer_email,o.customer_phone,o.completed_at
 from public.orders o where o.order_status='completed' and o.payment_status='paid' and o.completed_at is not null
 and o.completed_at+make_interval(hours=>v_delay)<=now()
 and exists(select 1 from public.order_items oi where oi.order_id=o.id and not exists(select 1 from public.product_reviews pr where pr.order_item_id=oi.id))
 loop
  v_scheduled:=r.completed_at+make_interval(hours=>v_delay);
  if r.customer_phone is not null and not exists(select 1 from public.notification_outbox n where n.order_id=r.order_id and n.channel='whatsapp' and n.template_key='review_request_after_completion') then
   insert into public.notification_outbox(order_id,customer_id,channel,template_key,recipient,payload,scheduled_at)
   values(r.order_id,r.customer_id,'whatsapp','review_request_after_completion',r.customer_phone,jsonb_build_object('order_number',r.order_number,'customer_name',r.customer_name,'member_area_url','https://baguskristiansianturi.github.io/bagusin/account/'),v_scheduled);
   v_queued:=v_queued+1;
  end if;
  if r.customer_email is not null and not exists(select 1 from public.notification_outbox n where n.order_id=r.order_id and n.channel='email' and n.template_key='review_request_after_completion') then
   insert into public.notification_outbox(order_id,customer_id,channel,template_key,recipient,payload,scheduled_at)
   values(r.order_id,r.customer_id,'email','review_request_after_completion',r.customer_email,jsonb_build_object('order_number',r.order_number,'customer_name',r.customer_name,'member_area_url','https://baguskristiansianturi.github.io/bagusin/account/'),v_scheduled);
   v_queued:=v_queued+1;
  end if;
 end loop;
 return v_queued;
end; $$;
do $$
declare v_job bigint;
begin
 select jobid into v_job from cron.job where jobname='bagusin-queue-review-requests';
 if v_job is not null then perform cron.unschedule(v_job);end if;
 perform cron.schedule('bagusin-queue-review-requests','*/5 * * * *','select private.queue_bagusin_review_requests();');
end; $$;
