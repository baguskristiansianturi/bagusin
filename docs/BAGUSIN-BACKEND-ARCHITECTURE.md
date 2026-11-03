# Bagusin backend architecture and setup

Last reviewed: 3 November 2026

## Product boundary
This backend is exclusively for Bagusin: a professional digital studio and its business/content platform. It is not the My Bali product. No social feed, member posts, reactions, or communities are part of the Bagusin roadmap.

## Current hosting and approach
- Public website: static HTML/CSS/JS on GitHub Pages.
- Backend: Supabase Postgres, Auth, and Storage.
- Browser SDK: pinned Supabase JS v2.118.0, loaded only where needed.
- Public browser code uses the Supabase publishable key only. Never ship service-role/secret keys, database passwords, or admin tokens.
- Keep the current public pages and their static content working while the CMS is introduced incrementally. Do not switch every page to database-backed rendering in one release.

## Domain model
| Area | Tables | Purpose |
|---|---|---|
| Accounts and roles | profiles | Owner/admin identity; member role is not a social publishing permission |
| Editorial CMS | articles, article_categories, article_tags, article_tag_assignments | Draft/publish/archive, SEO metadata, language, category and tags |
| Design catalogue | design_categories, design_items | Design product metadata, price, platform, use case, industry, demo and ordering links |
| Services | service_categories, services | Service directory, availability status, descriptions and SEO metadata |
| Portfolio and demos | portfolio_projects | Clearly classify client work, concept demos, internal work and experiments |
| Courses | course_categories, courses, course_curriculum | Course descriptions, delivery, price, schedule notes and curriculum |
| Leads and enquiries | inquiries | Project, consultation, course, template and general enquiries |
| Media | media_assets + Storage buckets | Public site imagery and restricted documents |
| Site configuration | site_settings | Non-secret site settings only |

## Storage
- `bagusin-public`: public images for published articles, catalogue items, courses, services and portfolio. Upload/update/delete is admin-only. 8 MiB maximum; JPEG, PNG, WebP, AVIF and SVG MIME types.
- `bagusin-private`: private PDFs, office documents and restricted images. All operations admin-only. 15 MiB maximum.
- Never store secrets, payment credentials, or database credentials in Storage or `site_settings`.
- Public bucket URLs are public by design. Do not put client briefs, personal documents, or unpublished sensitive material in it.

## Access and security
- RLS enabled on every new public table.
- Anonymous visitors can read published/active public content and submit a new enquiry; they cannot read enquiries or write CMS content.
- Authenticated admin role is required for all CMS management, media uploads and site settings.
- Existing social/community tables are retained (no destructive drop) but revoked from anon/authenticated API access; do not build UI or features on them.
- Enquiry records contain personal data. Only admins can read/update/delete them.
- Role changes must be performed by trusted admin/database operations. Never assign admin from user-editable Auth metadata or a public form.

## Deferred until explicitly approved
- Payment processing, order fulfilment, downloadable product delivery and license management.
- Customer LMS/student accounts, attendance, progress tracking and certificates.
- Automated email/SMTP provider, transactional notifications and marketing.
- Public registration beyond the current Auth test path; confirm whether Bagusin should be admin-only before opening accounts broadly.
- Data migration of existing static content; audit each static source and preserve canonical URLs before importing.
- Frontend admin/CMS screens and live form integration; these are separate UI phases.
- Deleting the unused social schema; retain until backup/review confirms it can be removed safely.

## Current limitations
The database foundation is installed, but the current static website does not yet read CMS content from Supabase. A working admin dashboard, real form submission, email delivery, customer purchases, and file delivery are not yet implemented. Do not describe those as live features.
