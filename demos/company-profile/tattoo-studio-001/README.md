# Nara Ink Studio — Company Profile Demo

**Product code:** BG-WEB-CMP-002  
**Design direction:** Warm Atelier  
**Industry:** Tattoo & Body Art  
**Category:** Company Profile  
**Demo URL:** https://baguskristiansianturi.github.io/bagusin/demos/company-profile/tattoo-studio-001/

## Purpose

A complete concept website for a Bali tattoo studio. It is intentionally written and populated like an operating business website, not a blank wireframe or a generic template instruction page.

The demo includes:
- Studio introduction and business positioning
- Tattoo styles and service descriptions
- Selected work gallery with image lightbox
- Starting-price presentation and quote explanation
- Artist profiles
- Hygiene and aftercare information
- Booking process and FAQ
- Three-step appointment enquiry form with validation and WhatsApp handoff
- Responsive desktop and mobile navigation

## Folder structure

```text
tattoo-studio-001/
├── index.html
├── product.json
├── README.md
├── assets/
│   └── README.md
├── css/
│   └── style.css
└── js/
    └── main.js
```

The demo CSS and JavaScript are loaded only by this product. Do not move its selectors or interactions into Bagusin's global CSS/JS. Keep changes to this product inside this folder unless a catalog integration is explicitly required.

## Customisation guide

| Business detail | Where to edit |
|---|---|
| Brand name and logo text | `index.html` — header and footer |
| Hero headline and business copy | `index.html` — relevant section |
| Address, phone, email and hours | `index.html` — booking contact block |
| WhatsApp destination | `js/main.js` — `demoNumber` |
| Prices and deposit policy | `index.html` — pricing, booking process and FAQ |
| Tattoo styles and services | `index.html` — styles and pricing sections |
| Artist names and biographies | `index.html` — artist cards |
| Gallery and portrait photos | `index.html` — image `src` attributes |
| Colours, fonts, layout and responsive rules | `css/style.css` |
| Booking form steps and validation | `js/main.js` |
| Product identity, catalog price and asset guidance | `product.json` |
| Catalog card content | `data/company-profile-products.json` |

## Image replacement guidance

The current remote images are visual references for this concept. Replace them with images supplied by the client or images they have permission to use before the website is published.

Recommended source dimensions:
- Hero: landscape 16:9, at least 1600 × 900 px.
- Gallery: portrait 4:5, ideally 1000 px or more on the long edge.
- Artist portraits: consistent portrait 4:5 crops.
- Studio / hygiene: landscape 4:3 or 3:2.
- Logo: SVG preferred; transparent PNG is acceptable.

Use descriptive filenames, compress photographs to WebP or AVIF when supported, provide meaningful alt text, and keep the focal point consistent with the image crop. Avoid hotlinking images from competitor websites or using work without permission.

## Booking interaction

The form has three front-end steps:
1. Contact details.
2. Tattoo style, placement, size and concept.
3. Preferred date/time, request summary and consent.

The final action prepares a WhatsApp message. It does not store a booking, check availability, process a deposit, or confirm an appointment. Replace the sample WhatsApp number and confirm the studio's actual deposit/cancellation policy before launch.

## Concept data disclaimer

Nara Ink Studio, the artists, address, phone, email, opening hours, service prices, deposit policy and hygiene statements are illustrative website content. They are supplied to make the UI/UX demo complete and testable. They are not representations about a real operating studio. Gallery images are remote visual references and must be replaced or licensed before commercial publication.

## QA checklist

- [ ] Test desktop navigation and mobile menu.
- [ ] Test all anchor links and gallery lightbox.
- [ ] Complete all three booking steps and test required-field validation.
- [ ] Confirm WhatsApp message content and replace sample number.
- [ ] Replace all illustrative business details and policies.
- [ ] Replace gallery/artist/studio images with approved assets.
- [ ] Test at 320, 375, 390, 768, 1024 and 1440 px.
- [ ] Check image loading, keyboard focus, reduced motion and no horizontal overflow.
