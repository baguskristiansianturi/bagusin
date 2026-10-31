# Bagus Tattoo Studio — Company Profile Demo

**Product code:** BG-WEB-CMP-002  
**Design direction:** Classic Tattoo Parlour  
**Industry:** Tattoo & Body Art  
**Category:** Company Profile  
**Demo URL:** https://baguskristiansianturi.github.io/bagusin/demos/company-profile/tattoo-studio-001/

## Design direction

A traditional tattoo parlour identity with ink black, tattoo red, warm ivory and muted brass. The visual language uses condensed display lettering, flash-wall presentation, bold section contrasts and artwork-first cards. This is intentionally distinct from Bagusin's own editorial identity.

## Purpose and business flow

This is a company profile and enquiry-focused storefront concept for a tattoo studio. It includes:
- Studio introduction and brand positioning
- Flash design catalogue with style filters and sample starting prices
- Artwork lightbox preview
- Tattoo style guide
- Artist profiles
- Indicative pricing by size / project type
- Studio care and aftercare conversation
- Three-step tattoo enquiry form with validation and WhatsApp handoff
- Responsive desktop and mobile navigation

The visitor journey is: discover the studio → browse styles and flash designs → compare starting prices → choose an artist or design direction → send an enquiry → confirm quote and availability directly with the studio.

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

Keep the product CSS and JavaScript inside this folder. Do not move selectors or interactions into Bagusin's global CSS/JS.

## Customisation guide

| Business detail | Where to edit |
|---|---|
| Studio name and logo | `index.html` — header and footer |
| Gallery and flash cards | `index.html` — Flash Wall |
| Artist profiles | `index.html` — Artists |
| Contact details and location | `index.html` — Booking |
| WhatsApp destination | `js/main.js` — `demoNumber` |
| Prices and booking policies | `index.html` — Pricing / FAQ |
| Colour, fonts, layout and breakpoints | `css/style.css` |
| Booking steps and validation | `js/main.js` |
| Catalogue information | `product.json` and `data/company-profile-products.json` |

## Images and illustrative content

The current images are remote demonstration references, not a verified studio portfolio. Replace them with client-owned or properly licensed tattoo photographs before commercial publication. Artist names, address, phone, email, opening hours, prices and policies are illustrative content and must be replaced with verified business information.

## Booking interaction

The form collects contact details, tattoo concept, style, placement, size and preferred date/time. It validates the required fields, shows a summary and prepares a WhatsApp message. It does not store a booking, check availability, process deposits or confirm a session. The sample WhatsApp number must be replaced before launch.

## QA checklist

- [ ] Check mobile menu and all section navigation.
- [ ] Filter flash cards by category.
- [ ] Open and close gallery lightbox.
- [ ] Choose a flash design and confirm it pre-fills the booking form.
- [ ] Complete all booking steps and test validation.
- [ ] Check WhatsApp handoff and replace sample destination.
- [ ] Test widths 320, 360, 390, 768, 1024 and 1440 px.
- [ ] Replace all illustrative content and approve image licences.
