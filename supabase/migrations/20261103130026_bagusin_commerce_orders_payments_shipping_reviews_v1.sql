-- Bagusin commerce foundation v1: orders, manual BCA payments, fulfilment and verified reviews.
-- Additive only. No payment gateway, carrier API, WhatsApp API or social features are enabled here.
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 order_number text not null unique default ('BGS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
 customer_id uuid references public.profiles(id) on delete set null,
 customer_name text not null check (length(trim(customer_name)) between 2 and 120),
 customer_email text not null check (length(trim(customer_email)) <= 254),
 customer_phone text,
 order_type text not null check (order_type in ('service','course','digital','physical','mixed')),
 order_status text not null default 'pending_review' check (order_status in ('pending_review','awaiting_payment','processing','ready','completed','cancelled','expired')),
 payment_status text not null default 'unpaid' check (payment_status in ('unpaid','proof_submitted','paid','rejected','refunded')),
 fulfillment_status text not null default 'not_started' check (fulfillment_status in ('not_started','scheduled','in_progress','ready_to_ship','shipped','delivered','completed')),
 currency text not null default 'IDR' check (currency = 'IDR'),
 subtotal_amount numeric(14,2) not null default 0 check (subtotal_amount >= 0),
 shipping_amount numeric(14,2) not null default 0 check (shipping_amount >= 0),
 discount_amount numeric(14,2) not null default 0 check (discount_amount >= 0),
 total_amount numeric(14,2) not null default 0 check (total_amount >= 0),
 shipping_method text check (shipping_method in ('local_sameday','bagusin_delivery','self_pickup','courier_manual','aggregator')),
 shipping_address jsonb not null default '{}'::jsonb,
 customer_note text, admin_note text, expires_at timestamptz,
 accepted_at timestamptz, paid_at timestamptz, completed_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 item_type text not null check (item_type in ('service','course','design','digital','store_product','other')),
 item_reference_id uuid, item_slug text, item_code text, item_name text not null, item_description text,
 quantity integer not null default 1 check (quantity > 0),
 unit_price numeric(14,2) not null check (unit_price >= 0), line_total numeric(14,2) not null check (line_total >= 0),
 item_snapshot jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.order_status_history (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 changed_by uuid references public.profiles(id) on delete set null,
 status_type text not null check (status_type in ('order','payment','fulfillment')),
 old_status text, new_status text not null, note text, created_at timestamptz not null default now()
);
create table if not exists public.payments (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 customer_id uuid references public.profiles(id) on delete set null,
 method text not null default 'bank_transfer' check (method = 'bank_transfer'),
 bank_name text not null default 'BCA', account_holder text not null default 'Bagus',
 amount numeric(14,2) not null check (amount > 0),
 payment_status text not null default 'awaiting_transfer' check (payment_status in ('awaiting_transfer','proof_submitted','verified','rejected','expired','refunded')),
 proof_path text, customer_message text, admin_note text, submitted_at timestamptz,
 verified_at timestamptz, verified_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.shipments (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 shipping_method text not null check (shipping_method in ('local_sameday','bagusin_delivery','self_pickup','courier_manual','aggregator')),
 carrier_name text, service_name text, tracking_number text, tracking_url text,
 shipping_cost numeric(14,2) not null default 0 check (shipping_cost >= 0),
 shipment_status text not null default 'pending' check (shipment_status in ('pending','ready_for_pickup','picked_up','in_transit','out_for_delivery','delivered','failed','returned','cancelled')),
 recipient_name text, recipient_phone text, destination_address jsonb not null default '{}'::jsonb,
 shipped_at timestamptz, delivered_at timestamptz, admin_note text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.store_products (
 id uuid primary key default gen_random_uuid(), slug text not null unique, sku text unique, name text not null,
 short_description text, description text not null default '', brand text, category text,
 product_type text not null default 'physical' check (product_type in ('physical','digital')),
 price_amount numeric(14,2) not null default 0 check (price_amount >= 0),
 currency text not null default 'IDR' check (currency = 'IDR'),
 stock_quantity integer not null default 0 check (stock_quantity >= 0), manage_stock boolean not null default true,
 image_path text, status text not null default 'draft' check (status in ('draft','published','out_of_stock','archived')),
 seo_title text, seo_description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_reviews (
 id uuid primary key default gen_random_uuid(), order_item_id uuid not null unique references public.order_items(id) on delete restrict,
 customer_id uuid not null references public.profiles(id) on delete cascade, item_type text not null, item_slug text,
 item_name text not null, rating smallint not null check (rating between 1 and 5),
 review_title text, review_body text not null check (length(trim(review_body)) between 10 and 3000),
 display_name text, moderation_status text not null default 'pending' check (moderation_status in ('pending','published','rejected')),
 verified_purchase boolean not null default true, published_at timestamptz, admin_note text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.notification_outbox (
 id uuid primary key default gen_random_uuid(), order_id uuid references public.orders(id) on delete set null,
 customer_id uuid references public.profiles(id) on delete set null,
 channel text not null check (channel in ('whatsapp','email')), template_key text not null, recipient text not null,
 payload jsonb not null default '{}'::jsonb,
 delivery_status text not null default 'queued' check (delivery_status in ('queued','processing','sent','failed','cancelled')),
 scheduled_at timestamptz not null default now(), sent_at timestamptz,
 attempts integer not null default 0 check (attempts >= 0), last_error text, created_at timestamptz not null default now()
);
create index if not exists orders_customer_created_idx on public.orders(customer_id, created_at desc);
create index if not exists orders_status_expiry_idx on public.orders(order_status, expires_at) where order_status = 'awaiting_payment';
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_status_history_order_idx on public.order_status_history(order_id, created_at desc);
create index if not exists payments_order_idx on public.payments(order_id, created_at desc);
create index if not exists shipments_order_idx on public.shipments(order_id, created_at desc);
create index if not exists store_products_public_idx on public.store_products(status, category, name);
create index if not exists product_reviews_public_idx on public.product_reviews(item_slug, published_at desc) where moderation_status = 'published';
create index if not exists notification_outbox_queue_idx on public.notification_outbox(delivery_status, scheduled_at) where delivery_status = 'queued';
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;
alter table public.store_products enable row level security;
alter table public.product_reviews enable row level security;
alter table public.notification_outbox enable row level security;
create policy orders_customer_read on public.orders for select to authenticated using (customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy orders_customer_create on public.orders for insert to authenticated with check (customer_id=(select auth.uid()) and order_status='pending_review' and payment_status='unpaid');
create policy orders_admin_update on public.orders for update to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy orders_admin_delete on public.orders for delete to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy order_items_customer_read on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))));
create policy order_items_admin_write on public.order_items for all to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy order_history_customer_read on public.order_status_history for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))));
create policy order_history_admin_write on public.order_status_history for all to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy payments_customer_read on public.payments for select to authenticated using (customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy payments_customer_create on public.payments for insert to authenticated with check (customer_id=(select auth.uid()) and payment_status in ('awaiting_transfer','proof_submitted'));
create policy payments_admin_update on public.payments for update to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy shipments_customer_read on public.shipments for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))));
create policy shipments_admin_write on public.shipments for all to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy store_products_public_read on public.store_products for select to anon, authenticated using (status='published' or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy store_products_admin_write on public.store_products for all to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy reviews_public_read on public.product_reviews for select to anon, authenticated using (moderation_status='published' or customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy reviews_customer_create on public.product_reviews for insert to authenticated with check (customer_id=(select auth.uid()) and moderation_status='pending' and verified_purchase=true);
create policy reviews_admin_update on public.product_reviews for update to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy notification_outbox_admin_only on public.notification_outbox for all to authenticated using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items, public.order_status_history, public.payments, public.shipments, public.store_products, public.product_reviews, public.notification_outbox to authenticated;
grant select on public.store_products, public.product_reviews to anon;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('bagusin-payment-proofs','bagusin-payment-proofs',false,8388608,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;
create policy payment_proofs_customer_upload on storage.objects for insert to authenticated with check (bucket_id='bagusin-payment-proofs' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy payment_proofs_customer_read on storage.objects for select to authenticated using (bucket_id='bagusin-payment-proofs' and ((storage.foldername(name))[1]=(select auth.uid())::text or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')));
create policy payment_proofs_admin_manage on storage.objects for all to authenticated using (bucket_id='bagusin-payment-proofs' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (bucket_id='bagusin-payment-proofs' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
insert into public.site_settings(setting_key,setting_value,description) values
 ('payment_manual_bca',jsonb_build_object('bank','BCA','account_holder','Bagus','account_number','','enabled',true),'Manual BCA transfer instructions; configure account number before accepting payment'),
 ('shipping_options',jsonb_build_object('local_sameday',true,'bagusin_delivery',true,'self_pickup',false,'courier_manual',true,'aggregator',false),'Available shipping methods; aggregator integration is not active')
on conflict(setting_key) do nothing;
