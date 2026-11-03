create table if not exists public.invoices (
 id uuid primary key default gen_random_uuid(), order_id uuid not null unique references public.orders(id) on delete cascade,
 invoice_number text not null unique default ('INV-BGS-' || to_char(now(),'YYYYMM') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
 invoice_status text not null default 'draft' check(invoice_status in ('draft','issued','paid','void','expired')),
 issued_at timestamptz, due_at timestamptz, currency text not null default 'IDR' check(currency='IDR'),
 subtotal_amount numeric(14,2) not null default 0 check(subtotal_amount>=0),
 shipping_amount numeric(14,2) not null default 0 check(shipping_amount>=0),
 discount_amount numeric(14,2) not null default 0 check(discount_amount>=0),
 total_amount numeric(14,2) not null default 0 check(total_amount>=0), invoice_note text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists invoices_status_due_idx on public.invoices(invoice_status,due_at);
alter table public.invoices enable row level security;
create policy invoices_customer_read on public.invoices for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and (o.customer_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))));
create policy invoices_admin_insert on public.invoices for insert to authenticated with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy invoices_admin_update on public.invoices for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy invoices_admin_delete on public.invoices for delete to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
grant select,insert,update,delete on public.invoices to authenticated;
alter table public.store_products add column if not exists google_product_category text, add column if not exists gtin text, add column if not exists mpn text, add column if not exists condition text not null default 'new' check(condition in ('new','refurbished','used')), add column if not exists availability text not null default 'in_stock' check(availability in ('in_stock','out_of_stock','preorder'));
insert into public.site_settings(setting_key,setting_value,description) values
 ('payment_expiry_hours','24'::jsonb,'Default payment due period after an invoice is issued; adjustable by admin'),
 ('payment_reminder_hours','[2,12,22]'::jsonb,'Suggested reminder offsets in hours; automatic delivery requires a connected messaging provider')
on conflict(setting_key) do nothing;