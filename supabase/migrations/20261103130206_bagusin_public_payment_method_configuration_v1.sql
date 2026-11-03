create table if not exists public.payment_methods (
 id uuid primary key default gen_random_uuid(), method_code text not null unique,
 bank_name text not null, account_holder text not null, account_number text not null default '',
 instructions text, is_active boolean not null default false, sort_order integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.payment_methods enable row level security;
create policy payment_methods_public_read on public.payment_methods for select to anon,authenticated
 using (is_active or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy payment_methods_admin_insert on public.payment_methods for insert to authenticated
 with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy payment_methods_admin_update on public.payment_methods for update to authenticated
 using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'))
 with check (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy payment_methods_admin_delete on public.payment_methods for delete to authenticated
 using (exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
grant select on public.payment_methods to anon,authenticated;
grant insert,update,delete on public.payment_methods to authenticated;
insert into public.payment_methods(method_code,bank_name,account_holder,account_number,instructions,is_active,sort_order)
values('bca_manual','BCA','Bagus','','Transfer sesuai nominal invoice. Unggah bukti transfer melalui member area. Konfirmasi dilakukan setelah dana benar-benar diterima.',false,1)
on conflict(method_code) do nothing;
