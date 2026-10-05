# BagusIn — Redesign Checkpoint

## CP-00 — Baseline
- Protected baseline: `095c5e2fe8b6fad22f4735adb48a13f835d7f2f5`
- Article/mobile work from PR #23 and #24 is preserved.

## CP-01 — Information architecture & navigation
Status: implemented on branch `redesign/cp-01-02-living-room`.

- Primary navigation now presents Blog, Places, Work, YouTube, About, Contact.
- Work remains separated conceptually into Services and Work/evidence.
- Desktop gets a quiet quick-search control near the brand.
- Mobile retains the full navigation through the menu.
- Search remains a calm utility rather than an ecommerce-style search bar.

## CP-02 — Living-room homepage
Status: implemented on branch `redesign/cp-01-02-living-room`.

The homepage now treats BagusIn as Bagus's internet house:
- arrival/welcome instead of a conventional professional title;
- current location/activity;
- new things from the house;
- Blog / Work / Places as rooms;
- Services as a professional responsibility area;
- YouTube as the window into current life;
- About explains the breadth of the person without forcing one job title;
- footer remains a calm exit.

### Birthday / launch
Launch day is **27 October 2026**. Bagus was born **27 October 1993**, so the launch-day experience can quietly show **33 today** and **A new chapter begins here.** It should feel like a birthday discovered by the guest, not a birthday-party website.

### YouTube
- Homepage has a dedicated latest-YouTube section.
- Thumbnail is a first-class visual element.
- Before the first video, the section intentionally says Coming soon.
- `data/youtube-latest.json` is the content contract.
- `js/youtube-latest.js` renders the latest record.
- GitHub Actions refreshes the record every six hours from the public BagusIn YouTube channel, so the homepage is designed to keep showing the newest video after launch.

## Next
- CP-03: make search genuinely useful across public BagusIn content.
- CP-04: rebuild Services around brief → scope → quotation → production → review → delivery.
- CP-05: evolve Work into evidence-driven case studies.
- CP-06: connect Blog / Places / YouTube into one living archive.
