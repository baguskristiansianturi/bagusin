# Bagusin homepage — content register and release rules

Updated: 15 October 2026

## Purpose

Keep the homepage concise and make the first product shelf useful regardless of content type. The shelf may contain a service, digital product, template, demo, code project, application, course, or a genuinely useful new article. It is not an article-only feed.

## Rules for the “Baru di Bagusin” shelf

- Each item needs a stable `id`, `type`, title, destination, image/alt text, and `publishedAt` date in `js/home-whats-new.js`.
- `publishedAt` is the real public release date, not the date a draft or PR was created.
- Items appear newest-first for 30 days from `publishedAt`, then expire automatically.
- Show at most six eligible items. If more than six are eligible, the newest six win.
- Never backdate, invent release dates, or call an unfinished prototype a launched product.
- Types currently supported: `service`, `product`, `template`, `demo`, `code`, `app`, `article`, `course`.
- When adding an item, verify that the destination works on both the GitHub Pages project path and any future custom domain. External links must be intentional.
- When an item expires, it can remain in its own catalog; it simply leaves the time-limited homepage shelf.
- “Popular” must be a separate ranking based on reliable engagement/order data. Do not label an item popular based on personal guesswork.

## Homepage content budget

1. Hero and guided pathfinder.
2. Core services.
3. Mixed “Baru di Bagusin” carousel (maximum six cards).
4. Compact discovery links for services, collections/templates, code/apps, Blog, and portfolio.
5. Course preview only if it is actionable and accurately described.
6. One clear closing action.

Avoid stacking multiple explanatory grids, repeated article cards, long “why Bagusin” copy, and duplicated YouTube CTAs below the main product shelf. The homepage is a navigation surface, not the full site map.

## Session handoff / decision log

Before ending a work session, record:
- date and phase;
- changed files and purpose;
- commit SHA and PR URL;
- checks actually run and their result;
- known failures / unverified behavior;
- the exact next task.

Do not treat a static source check as a browser test, and do not claim a GitHub Pages deployment until the live page is verified.


## Verified release entry — 15 October 2026

- `Bagus Rental Mobil #002` is the newest confirmed demo for the mixed homepage shelf. Its public route is `/bagusin/demos/starter/travel-rental/bagus-rental-mobil-002/`.
- Use `publishedAt: "2026-10-15"` only because the demo was present on `main` and the GitHub Pages deployment workflow for that main head completed successfully on 15 October 2026. Do not infer future release dates from PR creation time.
- The shelf uses manual previous/next controls only. Do not reintroduce autoplay without an accessible pause control and fresh keyboard/touch QA.


## Mixed shelf article entry — verified metadata (15 October 2026)

- Added `Apa Itu Hosting? Panduan Website untuk Pemula` as one practical article card, not an article-only section. The article metadata records `datePublished: 2026-10-10`, and the first successful GitHub Pages deployment found containing its publication commit was run #1267 on 11 October 2026; therefore the shelf uses `publishedAt: 2026-10-11`. Its destination, description, and image alt text were checked against the article source.
- The smoke test checks this card only during its 30-day eligibility window. It does not require an expired article or demo to remain in the homepage shelf forever.
