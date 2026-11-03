# Supabase — Bagusin

This directory contains the versioned SQL migration history for the live Bagusin Supabase project.

## Project
- Project ref: `hpmeoxynftankklwgntb`
- API URL: `https://hpmeoxynftankklwgntb.supabase.co`
- Public frontend: GitHub Pages.
- Browser uses the publishable key only. Never commit a service-role/secret key, database password, or admin token.

## Applied migration history
1. `20261102130800_bagusin_foundation_schema_v1.sql`
2. `20261102130818_bagusin_profile_trigger_and_timestamps.sql`
3. `20261102130847_bagusin_lock_anon_writes_and_index_fks.sql`
4. `20261102131414_profile_auth_role.sql`
5. `20261103121830_bagusin_cms_backend_foundation_v1.sql`
6. `20261103121901_bagusin_cms_policy_index_refinement.sql`
7. `20261103122045_bagusin_design_private_file_security.sql`
8. `202611031221xx_bagusin_private_file_index_and_media_mime.sql` (replace xx with the version reported by the live migration history after applying)

The November 3 migrations add Bagusin editorial, services, portfolio, course, inquiry, media and site-settings structures; configure public/private Storage buckets; require admin role for CMS management; separate private template source files from the public catalogue; and disable API access to unused social/community tables without dropping them.

Do not apply the old alternative foundation migration from an unmerged branch on top of this live schema.

## Auth dashboard configuration
Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://baguskristiansianturi.github.io/bagusin/`
- Redirect URLs:
  - `https://baguskristiansianturi.github.io/bagusin/account/`
  - `https://baguskristiansianturi.github.io/bagusin/en/account/`
- Keep email/password provider enabled.

## First owner/admin
1. Register the owner's account from the Bagusin account page and confirm the email.
2. Promote the verified owner in SQL Editor, replacing the email with the exact owner login:
```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'OWNER_EMAIL');
```
Never expose this SQL to the browser or a public form.

## Product boundary
Bagusin is a professional digital studio and CMS for services, articles, design catalogue, portfolio/demos, courses and enquiries. It is not My Bali. Social/community tables are legacy-only and inaccessible through the client API.

See [backend architecture](../docs/BAGUSIN-BACKEND-ARCHITECTURE.md) for the domain model, access model, Storage conventions and deferred phases.
