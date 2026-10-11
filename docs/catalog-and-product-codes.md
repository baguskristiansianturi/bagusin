# Bagusin catalog and product-code standard

Each service, template, or digital product receives a permanent unique item_code. Never reuse a retired code. Display the code in catalog records, project briefs, orders, invoices, and change notes.

## Format
BG-{FAMILY}-{TYPE}-{NNN}

- BG: Bagusin.
- FAMILY: CON consultation, WEB website, TPL template, SYS system, MKT marketing, CNT content, OPS operations.
- TYPE: STR strategy, LND landing page, CMP company profile, TMP template, APP application, SEO SEO, ADS advertising, MNT maintenance.
- NNN: unique sequence; never reuse it.

## Proposed starter items (draft only)
- BG-CON-STR-001 — Digital Strategy Consultation
- BG-WEB-LND-001 — Business Landing Page
- BG-WEB-CMP-001 — Company Profile Website
- BG-TPL-TMP-001 — Starter Website Template
- BG-SYS-APP-001 — Custom Web Application or System
- BG-MKT-SEO-001 — SEO Foundation
- BG-MKT-ADS-001 — Advertising Setup and Management

## Minimum catalog fields
item_code, name, item_type, status, version, summary, included scope, exclusions, prerequisites, pricing model, currency, delivery estimate, demo URL, terms reference, and source commit/version where relevant.

A package has its own code; its components retain their own codes. Prices and scope are confirmed before purchase. Invoice numbers are separate from item codes; invoice line items preserve the item_code, name snapshot, version, quantity, agreed price, and currency. Do not remove retired items from historical records.

Statuses: draft, active, paused, retired. The proposed items above are not published prices or promises of availability.
