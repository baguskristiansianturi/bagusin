# Supabase Auth and CMS integration — Bagusin

Last updated: 3 November 2026

## Live project
- Project ref: `hpmeoxynftankklwgntb`
- API URL: `https://hpmeoxynftankklwgntb.supabase.co`
- Frontend: GitHub Pages.
- Client SDK: pinned `@supabase/supabase-js@2.118.0` UMD build.
- Browser credential: publishable key only. Never place a secret/service-role key or database password in frontend code.

## Auth already connected
- Email/password registration and sign-in.
- Email confirmation and password reset redirect handling for Indonesian/English account pages.
- Persistent browser session and sign-out.
- Profile read/update.
- Member/admin role field; members cannot promote their own role.
- New Auth users receive a profile row through a private-schema trigger.

## Dashboard URL setup
Authentication → URL Configuration:
- Site URL: `https://baguskristiansianturi.github.io/bagusin/`
- Redirect URL: `https://baguskristiansianturi.github.io/bagusin/account/`
- Redirect URL: `https://baguskristiansianturi.github.io/bagusin/en/account/`
Email/password provider should remain enabled. For reliable delivery at scale, configure a verified sender/custom SMTP provider.

## CMS backend migrations
- `20261103121830_bagusin_cms_backend_foundation_v1.sql`
- `20261103121901_bagusin_cms_policy_index_refinement.sql`

See `BAGUSIN-BACKEND-ARCHITECTURE.md` and `supabase/README.md` for the complete schema and access model.

## First owner/admin
After the owner has registered and confirmed the email, run this trusted SQL in Supabase SQL Editor (replace the exact email):
```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'OWNER_EMAIL');
```
Never expose this operation through frontend code or user-editable Auth metadata.

## Verification and remaining work
- The CMS tables and Storage buckets are created in the live project. Private template source files are separated from the public catalogue, and the legacy resource URL column is not selectable by browser clients.
- Security advisor currently reports no findings.
- Performance advisor has no foreign-key or overlapping-policy warnings; unused-index notices are expected while tables are empty.
- No Auth users exist yet; real signup, email confirmation, Android session persistence, and owner promotion remain untested.
- Current static pages still use repository data; CMS migration, admin interface, and contact form integration are not yet shipped.
