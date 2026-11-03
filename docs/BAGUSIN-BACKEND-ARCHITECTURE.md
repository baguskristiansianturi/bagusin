# Bagusin backend architecture and setup

Last reviewed: 3 November 2026

## Product boundary
This backend is exclusively for Bagusin: an independent digital studio and its business/content platform. It is not My Bali. No social feed, member posts, reactions, Explore, or communities are part of the Bagusin product.

## Hosting and technical approach
- Public website: static HTML/CSS/JS on GitHub Pages.
- Backend: Supabase Postgres, Auth, Storage and Edge Functions.
- Browser SDK: pinned Supabase JS v2.118.0, loaded only where needed.
- Public browser code uses the publishable key only. Never ship a service-role/secret key, database password, or admin token.
- Keep existing static pages working while backend features are introduced incrementally.
- The public site and account/admin screens are separate: customers only see their own records; admins manage operations.

## Current domain model

| Area | Tables / services | Purpose |
|---|---|---|
| Accounts | profiles, Supabase Auth | One customer account across Bagusin |
| Editorial CMS | articles, article_categories, article_tags, article_tag_assignments | Blog, My Stories, Personal Blog, tags, SEO and publishing |
| Design catalogue | design_categories, design_items, design_item_private_files | Public previews and private template source files |
| Services | service_categories, services, inquiries | Service catalogue and custom project requests |
| Portfolio | portfolio_projects | Client work, concept demos, internal work and experiments are explicitly classified |
| Courses | course_categories, courses, course_curriculum, course_enrollments, course_sessions | Course catalogue, enrolment, instructor, schedule and meeting progress |
| Store | store_products, store_product_variants | Physical and digital product catalogue, stock, variants and Google product metadata |
| Orders | orders, order_items, order_status_history, invoices | Order lifecycle, item snapshots, invoice number, totals and audit trail |
| Payments | payments, payment_methods | Manual BCA transfer and proof review; no gateway enabled |
| Shipping | shipments, customer_addresses | Local same-day, Bagusin delivery, pickup and manually handled national courier tracking |
| Digital fulfilment | digital_entitlements, bagusin-download-entitlement Edge Function | Private download rights after paid/completed order |
| Reviews | product_reviews | Verified-purchase reviews, moderation and public display |
| Notifications | notification_outbox | Queue structure for WhatsApp/email reminders and transaction notices; provider delivery is not yet connected |
| Media/settings | media_assets, site_settings, Storage | Public imagery, private documents and non-secret configuration |

## Order and payment lifecycle
- Custom service requests start as inquiries. Admin reviews the brief and creates an order/invoice only when scope and price are clear.
- Admin creates a customer order and line-item snapshot. The customer sees the order in the member area.
- Admin accepts the order and issues an invoice. The current admin screen uses a configurable due period (default 24 hours).
- Payment is manual bank transfer to the configured BCA account. The customer uploads proof in the member area or sends it to Bagusin through WhatsApp; a WhatsApp-sent proof still needs to be recorded/checked by admin.
- A payment is only marked paid after an admin checks the actual bank credit. A screenshot alone is not payment verification.
- Unpaid expiry is represented by order/invoice expiry fields. Automatic scheduled expiry and message delivery still need a scheduler/notification provider integration.
- Order status, payment status and fulfilment status are separate fields.

## Shipping
- Local same-day courier, direct Bagusin delivery, pickup and manually managed courier shipments are supported in the schema.
- National courier rates, label creation and live tracking APIs are not connected yet. An aggregator such as Biteship can be evaluated later without redesigning order records.
- The admin can store courier name, service, tracking number and tracking URL.

## Courses and digital products
- Course enrolments and session schedules are separate from payment status.
- Digital entitlements point to private Storage objects. The Edge Function verifies the signed-in customer, paid/completed order, entitlement status and download limit before returning a five-minute signed URL.
- Never expose private file paths as public catalogue URLs.

## Reviews and trust signals
- Reviews are tied to an order item.
- Database trigger verifies the customer's own paid and completed order before accepting a review.
- New reviews remain pending until admin moderation.
- Public pages must show real counts and ratings only; never seed fabricated customer reviews or purchase totals.

## Google product visibility
- Store products include core product data plus GTIN, MPN, condition, availability and Google product category fields.
- A Merchant Center feed, product structured data and eligibility checks are a later integration phase. Not every service/course is a Google Shopping product.

## Storage and security
- `bagusin-public`: public imagery; writes are admin-only.
- `bagusin-private`: private documents and template source files.
- `bagusin-payment-proofs`: private customer transfer evidence, scoped to each customer's UUID folder and admin review.
- RLS is enabled on all newly added public tables.
- Customer queries are restricted to their own orders, invoices, payments, addresses, enrolments, downloads and reviews.
- Admin role is assigned only through trusted database operations, never user-editable Auth metadata.
- Never store secret keys or database credentials in `site_settings`.

## Current limitations — do not describe as live
- Customer checkout is not yet connected to every public catalogue CTA. Initial operational flow is inquiry → admin-created order/invoice → customer member area.
- The admin can create and process orders, but customer-facing self-service order creation and cart are a next phase.
- WhatsApp notifications are not automated. Admin can contact a customer manually; the outbox table is only a queue structure until a WhatsApp Business provider and email provider are connected.
- Scheduled reminders and automatic expiry are not yet running.
- National courier APIs/rates, shipping aggregator and automatic tracking are not yet connected.
- Course enrolment data structures and admin creation are present; full session planner and customer attendance workflow need more UI.
- Secure digital download function is deployed; actual customer entitlement and end-to-end download testing require a paid/completed test order and a private source file.
- Product review moderation is available in admin; public product/homepage review widgets and Google Merchant Center feed are not yet connected.
- First owner account must be confirmed by email and promoted to admin before the admin dashboard can be used.
- Existing static catalogue/blog content has not yet been imported into the CMS. Preserve current URLs and review each mapping before migration.
