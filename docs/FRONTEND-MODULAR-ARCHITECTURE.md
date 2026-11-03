# Bagusin modular frontend architecture

## Guardrails
- Keep the existing static GitHub Pages delivery. Do not require a build tool for routine content edits.
- Global assets are limited to shared tokens, reset, header/footer, global components and global behavior.
- Page-family styles and scripts live in isolated folders (storefront, editorial, services, courses, catalog, account). Each script exits unless its page root exists and uses namespaced data attributes.
- A page owns its own title, description, canonical, Open Graph metadata, semantic heading structure and breadcrumb.
- A page-specific visual fix belongs in that page-family stylesheet, never in a global stylesheet.
- Public browser code uses only the Supabase publishable key. RLS remains the security boundary.
- Never invent stock, sales, reviews, discounts, delivery estimates or order/payment states.

## Storefront module
- Route: /store/
- Styles: css/storefront/store.css
- Behavior: js/storefront/storefront.js
- Catalogue source: public.store_products, published rows only.
- Category filters derive from published product data; search and sort are local presentation operations.
- The selection drawer is a temporary shortlist, not a paid shopping cart.
- Four-step request form: contact, receiving details, review/consent, submit.
- Submission creates a public inquiry (request_type general) for admin follow-up. It does not create an order, invoice or payment. Admin confirms price, availability, shipping and order creation.
- No test products or fake reviews are inserted.

## Form contract for future page modules
- Each form has a distinct purpose and page-family stylesheet.
- Use short steps, visible progress, labels, native validation, back/continue, review before submit, clear error, loading and success states.
- Do not lose entered data when navigating steps.
- Explain what happens after submit; distinguish inquiry, booking request, order, payment and confirmation.
- Service/course/consultation forms should be migrated one by one after preserving their existing fields and routing behavior.

## Editorial and navigation contract
- Blog index, article detail, service detail, product detail, course detail, account and store are separate page families.
- Breadcrumbs reflect the real parent hierarchy, not a visual-only decoration.
- Article detail keeps its own reading layout; blog index keeps its own listing layout.
- Shared header/footer changes require cross-route browser testing before merge.

## Future safe extraction
GitHub Pages does not process server-side includes. Keep static HTML pages independently deployable until a controlled build step or partial-generation script is introduced. Do not add runtime fetch-based header/footer injection that causes layout shifts or breaks navigation when offline.
