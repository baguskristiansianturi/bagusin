create table if not exists public.store_product_variants (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.store_products(id) on delete cascade,
 sku text unique, variant_name text not null, variant_options jsonb not null default '{}'::jsonb,
 price_override numeric(14,2) check(price_override is null or price_override>=0),
 stock_quantity integer not null default 0 check(stock_quantity>=0),
 status text not null default 'published' check(status in ('published','out_of_stock','archived')),
 sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.customer_addresses (
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.profiles(id) on delete cascade,
 label text not null default 'Alamat utama', recipient_name text not null, recipient_phone text not null,
 province text not null, city text not null, district text, postal_code text, address_line text not null, notes text,
 is_default boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.course_enrollments (
 id uuid primary key default gen_random_uuid(), order_item_id uuid not null unique references public.order_items(id) on delete restrict,
 customer_id uuid not null references public.profiles(id) on delete cascade, course_id uuid not null references public.courses(id) on delete restrict,
 enrollment_status text not null default 'pending' check(enrollment_status in ('pending','scheduled','active','completed','cancelled')),
 instructor_name text, start_date date, location_address jsonb not null default '{}'::jsonb, schedule_notes text,
 meetings_total integer check(meetings_total is null or meetings_total>=0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.course_sessions (
 id uuid primary key default gen_random_uuid(), enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
 session_number integer not null check(session_number>0), title text, scheduled_at timestamptz,
 duration_minutes integer check(duration_minutes is null or duration_minutes>0),
 session_status text not null default 'scheduled' check(session_status in ('scheduled','completed','rescheduled','cancelled','missed')),
 location_note text, instructor_note text, completed_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(enrollment_id,session_number)
);
create table if not exists public.digital_entitlements (
 id uuid primary key default gen_random_uuid(), order_item_id uuid not null unique references public.order_items(id) on delete restrict,
 customer_id uuid not null references public.profiles(id) on delete cascade, item_name text not null,
 storage_bucket text not null default 'bagusin-private', storage_path text not null,
 entitlement_status text not null default 'active' check(entitlement_status in ('pending','active','revoked','expired')),
 download_limit integer check(download_limit is null or download_limit>0), download_count integer not null default 0 check(download_count>=0),
 expires_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint digital_entitlements_private_bucket check(storage_bucket in ('bagusin-private'))
);
create index if not exists store_product_variants_product_idx on public.store_product_variants(product_id,status,sort_order);
create index if not exists customer_addresses_customer_idx on public.customer_addresses(customer_id,is_default desc);
create index if not exists course_enrollments_customer_idx on public.course_enrollments(customer_id,created_at desc);
create index if not exists course_enrollments_course_idx on public.course_enrollments(course_id);
create index if not exists course_sessions_enrollment_idx on public.course_sessions(enrollment_id,session_number);
create index if not exists digital_entitlements_customer_idx on public.digital_entitlements(customer_id,created_at desc);
alter table public.store_product_variants enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.course_sessions enable row level security;
alter table public.digital_entitlements enable row level security;
create policy store_variants_public_read on public.store_product_variants for select to anon,authenticated using((status='published' and exists(select 1 from public.store_products p where p.id=product_id and p.status='published')) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy store_variants_admin_insert on public.store_product_variants for insert to authenticated with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy store_variants_admin_update on public.store_product_variants for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy store_variants_admin_delete on public.store_product_variants for delete to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy customer_addresses_owner_read on public.customer_addresses for select to authenticated using(customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy customer_addresses_owner_insert on public.customer_addresses for insert to authenticated with check(customer_id=(select auth.uid()));
create policy customer_addresses_owner_update on public.customer_addresses for update to authenticated using(customer_id=(select auth.uid())) with check(customer_id=(select auth.uid()));
create policy customer_addresses_owner_delete on public.customer_addresses for delete to authenticated using(customer_id=(select auth.uid()));
create policy course_enrollments_customer_read on public.course_enrollments for select to authenticated using(customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_enrollments_admin_insert on public.course_enrollments for insert to authenticated with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_enrollments_admin_update on public.course_enrollments for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_enrollments_admin_delete on public.course_enrollments for delete to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_sessions_customer_read on public.course_sessions for select to authenticated using(exists(select 1 from public.course_enrollments e where e.id=enrollment_id and (e.customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))));
create policy course_sessions_admin_insert on public.course_sessions for insert to authenticated with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_sessions_admin_update on public.course_sessions for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_sessions_admin_delete on public.course_sessions for delete to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy digital_entitlements_customer_read on public.digital_entitlements for select to authenticated using(customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy digital_entitlements_admin_insert on public.digital_entitlements for insert to authenticated with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy digital_entitlements_admin_update on public.digital_entitlements for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy digital_entitlements_admin_delete on public.digital_entitlements for delete to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
grant select,insert,update,delete on public.store_product_variants,public.customer_addresses,public.course_enrollments,public.course_sessions,public.digital_entitlements to authenticated;
grant select on public.store_product_variants to anon;