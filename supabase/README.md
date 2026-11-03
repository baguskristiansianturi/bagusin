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
8. `20261103122102_bagusin_private_file_index_and_media_mime.sql`
9. `20261103130026_bagusin_commerce_orders_payments_shipping_reviews_v1.sql`
10. `20261103130137_bagusin_commerce_access_and_verified_review_guards_v1.sql`
11. `20261103130206_bagusin_public_payment_method_configuration_v1.sql`
12. `20261103130502_bagusin_course_digital_variant_fulfillment_v1.sql`
13. `20261103130523_bagusin_commerce_proof_guard_and_fk_indexes_v1.sql`
14. `20261103130538_bagusin_invoices_and_google_product_metadata_v1.sql`
15. `20261103130737_bagusin_secure_digital_download_entitlement_v1.sql`\n16. `20261103131001_bagusin_download_rpc_hardening_v1.sql`\n17. `20261103131319_bagusin_payment_expiry_and_reminder_scheduler_v1.sql`\n18. `20261103131720_bagusin_configurable_payment_reminder_offsets_v1.sql`

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

## Payment and operational configuration
- Add the real BCA account number in Admin → Instruksi transfer BCA. It is intentionally blank and inactive until configured.
- The current invoice due-time default is 24 hours and can be changed by admin.
- The customer proof bucket is private. Do not move receipts into the public media bucket.
- Manual BCA verification means an admin checks the bank account before marking an order paid.
- Payment expiry is scheduled via pg_cron. Reminder jobs are queued but WhatsApp/email delivery is not active until a provider and sender worker are connected. Courier integrations are not active.

## Product boundary
Bagusin is a professional digital studio and CMS for services, articles, design catalogue, portfolio/demos, courses, store and customer operations. It is not My Bali. Social/community tables are legacy-only and inaccessible through the client API.

See [backend architecture](../docs/BAGUSIN-BACKEND-ARCHITECTURE.md) for the domain model, access model, order lifecycle, Storage conventions and current limitations.
