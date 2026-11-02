# Supabase setup — Bagusin

This directory contains version-controlled database migrations for Bagusin.

## Before applying
1. Create a new Supabase project from the mobile browser.
2. Keep the database password private.
3. Open SQL Editor and review the migration in the migrations directory.
4. Apply it only to the new, empty project.
5. Do not paste the service_role key into frontend code or commit secrets.

The first migration creates the content foundation, row-level security policies, and public image/document buckets. It does not connect the existing website yet.

## First admin
After creating the owner account through Supabase Auth, run this in SQL Editor using that account's exact email:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR-LOGIN-EMAIL'
);
```

Replace the placeholder with the actual login email. Do not share credentials in chat or commit them.

## Current limitation
The migration has not yet been applied to a live Supabase project or tested against project credentials. Review it before applying. The next implementation step is a browser-safe frontend adapter using only the project's URL and publishable/anon key.
