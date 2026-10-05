# BagusIn — Redesign Checkpoint

## CP-00
Protected baseline: `095c5e2fe8b6fad22f4735adb48a13f835d7f2f5`.

## CP-01 / CP-02
Merged to main in commit `a23f76af2ba346add444d0bf723a153f565c880e`.
- Living-room homepage
- calm desktop quick search
- birthday/launch cue: 27 October 2026 / 33 today
- dedicated latest YouTube section
- thumbnail-first YouTube integration
- scheduled latest-video refresh

## CP-03 — Search
Implemented on branch `redesign/cp-03-04`.
- Search vocabulary now matches Blog / Places / Services / Work / YouTube / About / Contact.
- Multi-word queries are tokenized so a query such as `web application` can match content containing both terms.
- Search remains static/lightweight and GitHub Pages compatible.
- Header search copy is quieter and broader than the previous article-only wording.

## CP-04 — Services
Implemented on branch `redesign/cp-03-04`.
- Work With Me is repositioned as Services.
- Services explicitly separates Bagus's free-form identity from the professional standard applied to accepted projects.
- Process remains Problem → Requirement → Scope & Quotation → Development → Review & Delivery.
- Work remains a separate evidence/portfolio area.

## CP-05 — Work / Evidence
Implemented on branch `redesign/cp-05-work-evidence`.
- Work is now explicitly evidence-first: real projects are separated from experiments and claims are kept factual.
- Portfolio copy emphasizes what was actually built, tested, changed, or left unfinished.
- Corrected the Work/Services routing split so Work points to `/portfolio/` while Services remains `/work/`.
- Refined the Work visual treatment for desktop and mobile without replacing the established BagusIn visual language.
- Protected project statuses: PROJECT / CONCEPT / EXPERIMENT; no invented results or testimonials.

## CP-06 — Living Archive
Implemented on branch `redesign/cp-06-living-archive`.
- Blog, Places, and YouTube language now follows the same living-archive philosophy.
- Existing deployed routes remain protected: `/journal/` and `/destinations/`; labels are Blog and Places.
- YouTube homepage and YouTube page now share the same latest-video data contract.
- Added shared `data/site-status.json` and `js/site-status.js` so current location/activity/availability can be changed in one place.
- Places now connects its current state back to the living room/home.
- No fabricated videos, destinations, ratings, or travel claims were added.

## CP-07 — Monetization / Small Doors
Implemented on branch `redesign/cp-07-monetization`.
- Added Jastip, Advertising, and Classified Ads as separate lightweight pages.
- Monetization is presented as optional doors around the house, not the site's primary identity or funnel.
- Jastip is explicitly COMING SOON and tied to real movement/location rather than pretending to be an always-open store.
- Advertising is enquiry-based with clear editorial boundaries; payment does not buy opinions or positive coverage.
- Classified Ads is PLANNED, not presented as a working marketplace; relevance, clarity, and moderation principles are stated before launch.
- Homepage now introduces the three doors quietly and the sitemap includes their routes.
- No fake listings, prices, sponsors, transactions, testimonials, or monetization results were invented.

## CP-08 — Responsive / Accessibility / Performance Audit
Implemented on branch `redesign/cp-08-audit`.
- Hardened the shared responsive foundation across mobile, tablet, desktop, and large desktop widths.
- Added safer mobile header/brand behavior, horizontal suggestion scrolling, and 16px-safe form controls.
- Preserved 44px+ touch targets and existing keyboard/focus behavior.
- Grouped Work navigation now exposes an active state for both Services and Work routes, including English routes.
- Added reduced-motion hardening for visual effects and kept the site dependency-free.
- Added `AUDIT_CP-08.md` with the browser verification matrix and explicit launch gate.
- No protected route was renamed.

## Next
- CP-09: launch readiness, final content/metadata review, domain/canonical verification, and final production checklist.


## CP-09 — Launch Readiness
Implemented on branch `redesign/cp-09-launch-readiness`.

- Added host-aware route normalization so the existing `/bagusin/` project-site paths continue to work on GitHub Pages while resolving correctly from the canonical custom-domain root.
- Hardened global search routing and navigation active-state detection for both hosting modes.
- Removed the homepage email field that implied a working newsletter subscription without a subscription backend; the CTA now goes directly to Contact.
- Added a lightweight custom 404 page for missing routes.
- Rechecked the protected information architecture: Blog `/journal/`, Places `/destinations/`, Services `/work/`, Work `/portfolio/`, YouTube `/youtube/`.
- Canonical metadata remains on `https://bagusin.com/`; no unverified DNS/CNAME change was introduced.
- Launch copy keeps the `27 October 2026` / `33 today` cue without turning the homepage into a birthday page.
- Browser verification at 320/375/390/768/1024/1440px remains the final human launch gate.
