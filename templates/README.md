# Bagusin Template & Demo Catalog

This folder is the single source of truth for public demo template metadata and prices.

## Stable naming convention

Use this path pattern for every demo:

`demos/<level>/<category>/<business-design-name-##>/index.html`

Examples:
- `demos/starter/travel-rental/bagus-sewa-mobil-bali-01/index.html`
- `demos/starter/travel-rental/bagus-sewa-mobil-bali-02/index.html`
- `demos/business/travel-rental/bagus-sewa-mobil-bali-01/index.html`

Category folders: `travel-rental`, `business-company`, `campaign-landing-page`, `store-catalog`. Keep slugs lowercase, use hyphens, and never recycle an existing numeric design suffix. If a design is renamed, preserve its stable ID and update the catalog path.

## ID convention

Format: `BG-<CATEGORY>-<LEVEL>-<NNN>`
- `TRV`: travel and rental
- `BUS`: business and company
- `CMP`: campaign / landing page
- `COM`: commerce / catalog
- `STR`: Starter, `BUS`: Business level, `COM`: Commerce, `CUS`: Custom
- Number sequentially per category and level.

Current demo: `BG-TRV-STR-001` — **Bagus Sewa Mobil Bali 01**.

## Add a new demo

1. Create its `index.html` in the matching folder above.
2. Add one entry to `templates/catalog.json` with a unique `id`, human-facing `name`, `designName`, `category`, `level`, `folder`, `demoUrl`, `description`, `included`, `notIncluded`, `price`, `pricingOptions`, `orderUrl`, and `discussionUrl`.
3. Ensure the demo itself shows its ID, level, and category in a small visible ribbon and footer.
4. Mark all illustrative prices, stock photos, service claims, and sample business details clearly. Never present sample testimonials or unverified claims as real.
5. Check mobile layouts, keyboard focus, links, image alt text, title, meta description, heading hierarchy, and original helpful copy before publishing.
6. Update this README with the new demo ID and folder.

## Pricing principles

- Starter base price is **Rp750.000 one-time** for design, original copy, and basic SEO content structure; domain and hosting are excluded.
- Optional assisted-launch estimate may start at **Rp1.500.000 for the first setup/year**, subject to chosen provider, domain availability, hosting plan, and confirmed scope.
- Clearly state annual renewal is separate and its price depends on the provider and package. Do not imply renewal is included unless the quote explicitly says so.
- Never promise Google ranking, organic traffic volume, or advertising results. Describe SEO foundations and suggested next steps honestly.

## Starter quality baseline

Even though the deliverable is a one-page website, it should feel complete:
- Hero with a specific value proposition and clear CTA.
- Services / products with useful, original descriptions.
- About / business information.
- How it works or booking process.
- FAQ addressing real customer questions.
- Contact / conversion CTA.
- Mobile-responsive design and semantic heading structure.
- SEO basics: unique title and description, meaningful H1/H2 structure, locally relevant content only when accurate, descriptive image alt text, and crawlable internal anchors.
- Recommendations for local visibility (e.g. Google Business Profile) and paid search where appropriate, without implying ads are mandatory.

The visual design can vary by template, but the information quality and basic content/SEO standards must not be reduced just because a design is in Starter.
