import { chromium } from "playwright";

const origin = "http://127.0.0.1:4173";
const routes = [
  "/bagusin/",
  "/bagusin/learning/",
  "/bagusin/store/",
  "/bagusin/store/product/?slug=demo-product",
  "/bagusin/en/learning/",
  "/bagusin/blog/",
  "/bagusin/blog/bekerja-dari-mana-saja/",
  "/bagusin/blog/pantai-kuta-bali/",
  "/bagusin/blog/remote-work/",
  "/bagusin/destinations/",
  "/bagusin/work/",
  "/bagusin/work/copywriting/",
  "/bagusin/work/seo-content/",
  "/bagusin/work/landing-pages/",
  "/bagusin/work/websites/",
  "/bagusin/work/web-applications/",
  "/bagusin/work/maintenance-uiux/",
  "/bagusin/collections/",
  "/bagusin/collections/company-profile/",
  "/bagusin/demos/company-profile/tattoo-studio-001/",
  "/bagusin/templates/",
  "/bagusin/templates/blogger-editorial/",
  "/bagusin/templates/demos/editorial-blogger/",
  "/bagusin/templates/checkout/?license=free",
  "/bagusin/templates/checkout/?license=premium",
  "/bagusin/templates/detail/?template=BG-TRV-STR-001",
  "/bagusin/demos/starter/travel-rental/bagus-sewa-mobil-bali-01/",
  "/bagusin/portfolio/",
  "/bagusin/youtube/",
  "/bagusin/about/",
  "/bagusin/author/",
  "/bagusin/contact/",
  "/bagusin/account/",
  "/bagusin/en/account/",
  "/bagusin/admin/",
  "/bagusin/legal/privacy/",
  "/bagusin/legal/terms/",
  "/bagusin/legal/disclaimer/",
  "/bagusin/legal/editorial-policy/",
  "/bagusin/en/",
  "/bagusin/en/blog/",
  "/bagusin/en/blog/bekerja-dari-mana-saja/",
  "/bagusin/en/destinations/",
  "/bagusin/en/work/",
  "/bagusin/en/collections/",
  "/bagusin/en/portfolio/",
  "/bagusin/en/youtube/",
  "/bagusin/en/about/",
  "/bagusin/en/author/",
  "/bagusin/en/contact/",
  "/bagusin/en/legal/privacy/",
  "/bagusin/en/legal/terms/",
  "/bagusin/en/legal/disclaimer/",
  "/bagusin/en/legal/editorial-policy/",
  "/bagusin/checkout/",
  "/bagusin/search/",
  "/bagusin/en/search/",
  "/bagusin/copywriting/collections/",
  "/bagusin/landing-pages/collections/",
  "/bagusin/websites/collections/"
];
const viewports = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 }
];
const errors = [];
const browser = await chromium.launch({ headless: true });

for (const route of routes) {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    page.setDefaultNavigationTimeout(25000);
    const pageErrors = [];
    const badLocalResponses = [];
    page.on("pageerror", (error) => pageErrors.push(error.stack || error.message));
    page.on("response", (response) => {
      const url = response.url();
      if (url.startsWith(origin) && response.status() >= 400 && !url.endsWith("/favicon.ico")) {
        badLocalResponses.push(response.status() + " " + url);
      }
    });

    try {
      const response = await page.goto(origin + route, { waitUntil: "domcontentloaded" });
      if (!response || response.status() >= 400) {
        errors.push(route + " @ " + viewport.width + "px: page response " + (response?.status() ?? "none"));
      }
      await page.waitForTimeout(150);
      const metrics = await page.evaluate(() => {
        const width = window.innerWidth;
        const selector = "main, main > section, .container, .container--narrow, .container--article, .article-pro-layout, .article-layout, .contact-form, .site-header__inner, .site-footer__inner, .checkout-main, .checkout-aside";
        const offenders = [...document.querySelectorAll(selector)].filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          if (style.display === "none" || style.visibility === "hidden" || rect.width === 0 || rect.height === 0) return false;
          return rect.left < -2 || rect.right > width + 2;
        }).slice(0, 5).map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            selector: element.tagName.toLowerCase() + (element.className && typeof element.className === "string" ? "." + element.className.trim().split(/\s+/).slice(0, 2).join(".") : ""),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          };
        });
        return {
          viewport: width,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          offenders
        };
      });
      if (metrics.documentWidth > viewport.width + 2 || metrics.bodyWidth > viewport.width + 2) {
        errors.push(route + " @ " + viewport.width + "px: horizontal document overflow " + JSON.stringify(metrics));
      }
      if (metrics.offenders.length) {
        errors.push(route + " @ " + viewport.width + "px: layout elements exceed viewport " + JSON.stringify(metrics.offenders));
      }
      for (const error of pageErrors) errors.push(route + " @ " + viewport.width + "px: JavaScript error: " + error);
      for (const response of badLocalResponses) errors.push(route + " @ " + viewport.width + "px: local resource failed: " + response);
    } catch (error) {
      errors.push(route + " @ " + viewport.width + "px: navigation/test error: " + error.message);
    } finally {
      await page.close();
    }
  }
}

const interactionPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await interactionPage.addInitScript(() => {
  window.__openedUrls = [];
  window.open = (url) => { window.__openedUrls.push(String(url)); return null; };
});
try {
  // Company Profile catalog: the Tattoo & Body Art product must load from the product registry.
  await interactionPage.goto(origin + "/bagusin/collections/company-profile/", { waitUntil: "domcontentloaded" });
  await interactionPage.locator(".company-profile-product").first().waitFor({ state: "visible", timeout: 8000 });
  if (await interactionPage.locator(".company-profile-product").count() !== 1) {
    errors.push("Company Profile catalogue: expected the Bagus Tattoo Studio product card");
  }
  if ((await interactionPage.locator(".company-profile-product__badge").first().innerText()).trim().toLowerCase() !== "demo konsep") {
    errors.push("Company Profile catalogue: concept demo label is missing");
  }
  await interactionPage.locator('[data-industry="tattoo-studio"]').click();
  if (!(await interactionPage.locator(".company-profile-product").first().isVisible())) {
    errors.push("Company Profile catalogue: Tattoo & Body Art filter hid its matching product");
  }
  const demoHref = await interactionPage.locator(".company-profile-product__actions a").first().getAttribute("href");
  if (demoHref !== "/bagusin/demos/company-profile/tattoo-studio-001/") {
    errors.push("Company Profile catalogue: demo link is incorrect: " + demoHref);
  }
  await interactionPage.locator('[data-industry="car-rental"]').click();
  if (await interactionPage.locator(".company-profile-product").first().isVisible()) {
    errors.push("Company Profile catalogue: unrelated industry filter did not hide the tattoo product");
  }

  // Demo: check navigation, gallery lightbox and the complete booking wizard.
  await interactionPage.goto(origin + "/bagusin/demos/company-profile/tattoo-studio-001/", { waitUntil: "domcontentloaded" });
  if (!(await interactionPage.title()).includes("Bagus Tattoo Studio")) {
    errors.push("Bagus Tattoo demo: document title is missing the studio name");
  }
  if (!(await interactionPage.locator("h1").first().innerText()).includes("GOOD INK.")) {
    errors.push("Bagus Tattoo demo: hero headline is missing");
  }
  if (await interactionPage.locator('a[href="tel:+6281234567890"]').count() !== 1) errors.push("Bagus Tattoo demo: clickable phone link is missing");
  if (await interactionPage.locator('a[href="mailto:hello@bagustattoostudio.example"]').count() !== 1) errors.push("Bagus Tattoo demo: clickable email link is missing");
  if (await interactionPage.locator('a[href*="google.com/maps/search"]').count() !== 1) errors.push("Bagus Tattoo demo: studio directions link is missing");
  const demoOverflow = await interactionPage.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth
  }));
  if (demoOverflow.documentWidth > demoOverflow.viewport + 2 || demoOverflow.bodyWidth > demoOverflow.viewport + 2) {
    errors.push("Bagus Tattoo demo @ 390px: horizontal overflow " + JSON.stringify(demoOverflow));
  }
  const demoMenu = interactionPage.locator(".menu-toggle");
  await demoMenu.click();
  if (!(await interactionPage.locator("#primary-nav").evaluate(el => el.classList.contains("is-open")))) {
    errors.push("Bagus Tattoo demo: mobile navigation did not open");
  }
  await interactionPage.locator('#primary-nav a[href="#flash"]').click();
  if (await interactionPage.locator("#primary-nav").evaluate(el => el.classList.contains("is-open"))) {
    errors.push("Bagus Tattoo demo: mobile navigation did not close after choosing a link");
  }
  await interactionPage.locator("[data-gallery-image]").first().click();
  if (!(await interactionPage.locator("[data-gallery-dialog]").evaluate(el => el.open))) {
    errors.push("Bagus Tattoo demo: gallery lightbox did not open");
  }
  await interactionPage.locator("[data-gallery-close]").click();
  if (await interactionPage.locator("[data-gallery-dialog]").evaluate(el => el.open)) {
    errors.push("Bagus Tattoo demo: gallery lightbox did not close");
  }

  // Step one must validate before advancing.
  await interactionPage.locator("[data-next]").click();
  if (!(await interactionPage.locator('[data-step-panel="1"]').isVisible())) {
    errors.push("Bagus Tattoo demo: booking wizard advanced without required contact details");
  }
  await interactionPage.locator('[name="name"]').fill("Alex Example");
  await interactionPage.locator('[name="phone"]').fill("+62 812 0000 0000");
  await interactionPage.locator("[data-next]").click();
  if (!(await interactionPage.locator('[data-step-panel="2"]').isVisible())) {
    errors.push("Bagus Tattoo demo: booking wizard did not advance to tattoo details");
  }
  await interactionPage.locator('[name="style"]').selectOption({ label: "American Traditional" });
  await interactionPage.locator('[name="placement"]').fill("Left forearm");
  await interactionPage.locator('[name="size"]').selectOption({ label: "Small · under 5 cm" });
  await interactionPage.locator('[name="idea"]').fill("A small botanical linework piece.");
  await interactionPage.locator("[data-next]").click();
  if (!(await interactionPage.locator('[data-step-panel="3"]').isVisible())) {
    errors.push("Bagus Tattoo demo: booking wizard did not advance to appointment details");
  }
  const dateMin = await interactionPage.locator('[name="date"]').getAttribute("min");
  await interactionPage.locator('[name="date"]').fill(dateMin);
  await interactionPage.locator('[name="time"]').selectOption({ label: "10:00–12:00" });
  await interactionPage.locator('[name="consent"]').check();
  if (!(await interactionPage.locator("[data-summary]").innerText()).includes("Alex Example")) {
    errors.push("Bagus Tattoo demo: booking summary did not include the submitted contact name");
  }
  await interactionPage.locator("[data-whatsapp]").click();
  const preparedWhatsApp = await interactionPage.evaluate(() => window.__openedUrls[0] || "");
  if (!preparedWhatsApp.includes("wa.me/6281234567890") || !preparedWhatsApp.includes("Alex%20Example")) {
    errors.push("Bagus Tattoo demo: WhatsApp handoff did not prepare the expected contact and message");
  }

  await interactionPage.goto(origin + "/bagusin/", { waitUntil: "domcontentloaded" });
  let homepageText = await interactionPage.locator("main").innerText();

  // Homepage course feature cards: verify the actual configured modules and their image previews.
  const homeCourseCards = interactionPage.locator(".home-course-feature-card");
  if (await homeCourseCards.count() < 2) errors.push("Homepage: expected the two configured course feature cards");
  const courseVisuals = interactionPage.locator(".home-course-feature-card__visual img");
  if (await courseVisuals.count() < 2) errors.push("Homepage: course feature cards are missing their image previews");
  const visualState = await courseVisuals.evaluateAll((items) => items.map((el) => {
    const rect = el.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height), src: el.getAttribute("src") };
  }));
  if (visualState.length >= 2 && visualState.some((v) => v.width < 100 || v.height < 60 || !v.src)) errors.push("Homepage course previews are not visibly rendered: " + JSON.stringify(visualState));

  await interactionPage.goto(origin + "/bagusin/en/", { waitUntil: "domcontentloaded" });
  if (await interactionPage.locator(".home-course-card .course-visual--home").count() < 3) {
    errors.push("English homepage: course cards are missing visual previews");
  }
  await interactionPage.goto(origin + "/bagusin/", { waitUntil: "domcontentloaded" });
  homepageText = await interactionPage.locator("main").innerText();
  if (await interactionPage.locator("[data-site-breadcrumbs]").count()) errors.push("Homepage: breadcrumb should stay hidden on the homepage");
  if (homepageText.includes("Cerita dan panduan pilihan") || homepageText.includes("Memulai kembali Bagusin")) errors.push("Homepage: article cards should be temporarily removed from the primary customer journey");
  // Homepage solution recommendations must stack into one readable column on mobile.
  await interactionPage.locator("[data-stage='starter']").click();
  await interactionPage.locator("[data-goal]").first().click();
  homepageText = await interactionPage.locator("main").innerText();
  const mobileSolutions = interactionPage.locator("[data-recommended-solutions] > .home-recommended-solutions__grid");
  await mobileSolutions.waitFor({ state: "visible", timeout: 5000 });
  const mobileGrid = await mobileSolutions.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      columns: style.gridTemplateColumns.split(" ").filter(Boolean).length,
      width: el.getBoundingClientRect().width,
      scrollWidth: el.scrollWidth,
      cardWidths: [...el.children].map(card => Math.round(card.getBoundingClientRect().width))
    };
  });
  if (mobileGrid.columns !== 1) errors.push("Homepage solutions @ 390px: expected one column, got " + JSON.stringify(mobileGrid));
  if (mobileGrid.scrollWidth > mobileGrid.width + 2) errors.push("Homepage solutions @ 390px: horizontal overflow " + JSON.stringify(mobileGrid));
  await interactionPage.setViewportSize({ width: 320, height: 740 });
  const narrowGrid = await mobileSolutions.evaluate((el) => ({
    columns: getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length,
    width: el.getBoundingClientRect().width,
    scrollWidth: el.scrollWidth,
    cardWidths: [...el.children].map(card => Math.round(card.getBoundingClientRect().width))
  }));
  if (narrowGrid.columns !== 1) errors.push("Homepage solutions @ 320px: expected one column, got " + JSON.stringify(narrowGrid));
  if (narrowGrid.scrollWidth > narrowGrid.width + 2) errors.push("Homepage solutions @ 320px: horizontal overflow " + JSON.stringify(narrowGrid));
  await interactionPage.setViewportSize({ width: 390, height: 844 });
  await interactionPage.locator("[data-reset-pathfinder]").click();

  if (!homepageText.includes("Rapikan konten dan visibilitas") || !homepageText.includes("Bangun solusi baru")) errors.push("Homepage: current Indonesian service labels are missing");
  if (homepageText.includes("Content Writing & SEO") || homepageText.includes("Web Applications & Systems")) errors.push("Homepage: outdated English service labels remain");

  // Check a second path from the visitor's perspective: an existing brand needs an operational system.
  await interactionPage.locator("[data-stage='existing']").click();
  await interactionPage.locator("[data-goal='system']").click();
  const systemPathText = await interactionPage.locator("main").innerText();
  if (!systemPathText.includes("Aplikasi dan sistem khusus")) errors.push("Homepage pathfinder: operational-system recommendation is missing");
  if (!systemPathText.includes("Tidak semua proses membutuhkan aplikasi khusus.")) errors.push("Homepage pathfinder: system recommendation lacks a plain-language caveat");
  if (!(await interactionPage.locator("[data-recommended-solutions] a[href='/bagusin/work/web-applications/']").count())) errors.push("Homepage pathfinder: system recommendation does not link to the relevant service");
  await interactionPage.locator("[data-reset-pathfinder]").click();

  const menuToggle = interactionPage.locator("[data-mobile-menu-toggle]").first();
  if (!(await menuToggle.count())) errors.push("Homepage: mobile menu toggle is missing");
  else {
    await menuToggle.click();
    const menu = interactionPage.locator("#mobile-navigation");
    if (await menu.getAttribute("aria-hidden") !== "false") errors.push("Homepage: mobile menu did not open");
    const close = interactionPage.locator("[data-mobile-menu-close]").first();
    if (await close.count()) await close.click();
    if (await menu.getAttribute("aria-hidden") !== "true") errors.push("Homepage: mobile menu did not close");
  }

  const searchToggle = interactionPage.locator("[data-search-toggle]").first();
  if (!(await searchToggle.count())) errors.push("Homepage: search toggle is missing");
  else {
    await searchToggle.click();
    const searchPanel = interactionPage.locator("#header-search");
    if (await searchPanel.getAttribute("hidden") !== null) errors.push("Homepage: search panel did not open");
    const input = interactionPage.locator("#global-search");
    if (await input.count()) {
      await input.fill("blog");
      await interactionPage.locator("#header-search form").evaluate((form) => form.requestSubmit());
      await interactionPage.waitForURL(/\/bagusin\/search\/\?q=blog/i, { timeout: 10000 });
      if (!interactionPage.url().includes("/bagusin/search/?q=blog")) errors.push("Homepage: search submission did not reach the search results route");
    } else {
      errors.push("Homepage: global search input is missing");
    }
  }

  // The current public article is Pantai Kuta; retired article slugs redirect to the blog index.
  await interactionPage.goto(origin + "/bagusin/blog/pantai-kuta-bali/", { waitUntil: "domcontentloaded" });
  const articleText = await interactionPage.locator("main").innerText();
  if (!articleText.includes("Pantai Kuta Bali")) errors.push("Article page: current Pantai Kuta article title is missing");
  const articleSearchToggle = interactionPage.locator("[data-search-toggle]").first();
  if (!(await articleSearchToggle.count())) {
    errors.push("Article page: global search toggle is missing");
  } else {
    await articleSearchToggle.click();
    const articleSearchPanel = interactionPage.locator("#header-search");
    if (!(await articleSearchPanel.count())) {
      errors.push("Article page: global search panel was not created");
    } else {
      const action = await articleSearchPanel.locator("form").getAttribute("action");
      if (action !== "/bagusin/search/") errors.push("Article page: search form has unexpected route " + action);
      const articleSearchInput = articleSearchPanel.locator("input[name=q]");
      if (!(await articleSearchInput.count())) {
        errors.push("Article page: global search input is missing");
      } else {
        await articleSearchInput.fill("pantai kuta");
        await articleSearchPanel.locator("form").evaluate((form) => form.requestSubmit());
        await interactionPage.waitForURL((url) => url.pathname === "/bagusin/search/" && url.searchParams.get("q") === "pantai kuta", { timeout: 10000 });
      }
    }
  }

  // Contact form must prepare a copyable brief without falsely claiming delivery.
  await interactionPage.goto(origin + "/bagusin/contact/?service=landing-pages", { waitUntil: "domcontentloaded" });
  const contactHeading = await interactionPage.locator(".contact-hero h1").textContent();
  const contactTitle = await interactionPage.title();
  if (!contactHeading || !contactHeading.includes("Mari mulai dari kebutuhanmu")) {
    errors.push("Contact page: concise Indonesian hero copy is missing");
  }
  if (!contactTitle.includes("Kontak")) errors.push("Contact page: title metadata is not localized");

  // Shared site chrome must stay consistent across interior pages and mobile scrolling.
  const breadcrumb = interactionPage.locator("[data-site-breadcrumbs]");
  if (!(await breadcrumb.count())) errors.push("Contact page: shared breadcrumb navigation is missing");
  else {
    const breadcrumbText = await breadcrumb.innerText();
    if (!breadcrumbText.includes("Beranda") || !breadcrumbText.includes("Mari mulai dari kebutuhanmu")) {
      errors.push("Contact page: breadcrumb labels or current-page label are incorrect: " + breadcrumbText);
    }
  }
  const headerPosition = await interactionPage.locator(".site-header").evaluate((el) => getComputedStyle(el).position);
  if (headerPosition !== "sticky") errors.push("Contact page: global navbar should use sticky positioning, got " + headerPosition);
  await interactionPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await interactionPage.waitForTimeout(100);
  const headerTop = await interactionPage.locator(".site-header").evaluate((el) => Math.round(el.getBoundingClientRect().top));
  if (headerTop < -1 || headerTop > 2) errors.push("Contact page: navbar did not remain at the top while scrolling, top=" + headerTop);
  const footerState = await interactionPage.locator(".site-footer").evaluate((el) => ({
    columns: el.querySelectorAll(".site-footer__column").length,
    hasCta: Boolean(el.querySelector(".site-footer__cta")),
    hasBottom: Boolean(el.querySelector(".site-footer__bottom"))
  }));
  if (footerState.columns !== 4 || !footerState.hasCta || !footerState.hasBottom) {
    errors.push("Contact page: shared footer structure is incomplete: " + JSON.stringify(footerState));
  }
  const footerLinks = await interactionPage.locator(".site-footer__links a").evaluateAll(links => links.map(link => ({
    text: (link.textContent || "").trim(),
    href: link.getAttribute("href") || ""
  })));
  const requiredFooterPaths = ["/bagusin/collections/", "/bagusin/learning/", "/bagusin/checkout/", "/bagusin/contact/", "/bagusin/legal/privacy/", "/bagusin/legal/terms/", "/bagusin/legal/disclaimer/", "/bagusin/legal/editorial-policy/"];
  for (const path of requiredFooterPaths) {
    if (!footerLinks.some(link => link.href === path || link.href.startsWith(path + "?"))) {
      errors.push("Contact page: shared footer is missing expected destination " + path);
    }
  }
  if (footerLinks.some(link => /search|author|portfolio|destinations/i.test(link.href))) {
    errors.push("Contact page: footer still exposes a legacy Search, Author, Portfolio, or Destinations link");
  }
  await interactionPage.evaluate(() => window.scrollTo(0, 0));

  const contactOptionsText = await interactionPage.locator("main").innerText();
  if (!contactOptionsText.includes("Apa yang ingin kamu buat, perbaiki, atau pelajari?")) errors.push("Contact page: contextual inquiry heading is missing");
  const selectedServiceText = await interactionPage.locator("#selected-service").innerText();
  if (!selectedServiceText.includes("Landing Page & Iklan")) errors.push("Contact page: service from the incoming URL was not preselected");
  const serviceChoiceLabel = interactionPage.locator("[data-service-choice-label]");
  if (await serviceChoiceLabel.isVisible()) errors.push("Contact page: redundant service selector should be hidden when context is known");
  if (!(await interactionPage.locator("[data-service-change]").isVisible())) errors.push("Contact page: option to change the preselected service is missing");
  await interactionPage.locator("[data-service-change]").click();
  if (!(await serviceChoiceLabel.isVisible())) errors.push("Contact page: service selector did not open after choosing to change it");
  if (await interactionPage.locator("#service-choice").inputValue() !== "landing-pages") errors.push("Contact page: revealed selector lost the preselected service");
  if (contactOptionsText.includes("software engineering") || contactOptionsText.includes("SEO content")) errors.push("Contact page: English service terms remain in Indonesian copy");
  let contactInquiryPayload = null;
  const inquiryEndpoint = "https://hpmeoxynftankklwgntb.supabase.co/rest/v1/inquiries*";
  await interactionPage.route(inquiryEndpoint, async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info, prefer" } });
      return;
    }
    contactInquiryPayload = route.request().postDataJSON();
    await route.fulfill({ status: 201, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json", "Preference-Applied": "return=minimal" }, contentType: "application/json", body: "[]" });
  });
  await interactionPage.locator("#project-form [data-stepper-next]").click();
  await interactionPage.locator("#project-form input[name=name]").fill("Test User");
  await interactionPage.locator("#project-form input[name=email]").fill("test@example.com");
  await interactionPage.locator("#project-form textarea[name=brief]").fill("Testing the contact email submission flow.");
  await interactionPage.locator("#project-form input[name=terms]").check();
  await interactionPage.locator("#project-form button[type=submit]").click();
  await interactionPage.waitForFunction(() => document.querySelector("#form-status")?.textContent.includes("Permintaan Anda berhasil tersimpan di Bagusin"), null, { timeout: 12000 });
  const preparedBrief = interactionPage.locator("#project-form [data-brief-output]");
  if (!(await preparedBrief.count())) errors.push("Contact form: prepared brief output was not created");
  else if (!(await preparedBrief.inputValue()).includes("Testing the contact email submission flow.")) errors.push("Contact form: prepared brief is missing the entered details");
  if (!(await interactionPage.locator("#project-form [data-copy-brief]").count())) errors.push("Contact form: copy summary button was not created");
  if (!contactInquiryPayload || contactInquiryPayload.email !== "test@example.com") errors.push("Contact form: inquiry record is missing the customer email");
  if (!contactInquiryPayload || contactInquiryPayload.request_type !== "consultation" || !contactInquiryPayload.subject.includes("Landing Page")) errors.push("Contact form: inquiry record is missing the selected service context");
  if (!contactInquiryPayload || !contactInquiryPayload.message.includes("Testing the contact email submission flow.")) errors.push("Contact form: inquiry record is missing the project brief");
  const formStatus = await interactionPage.locator("#form-status").textContent();
  if (!formStatus || !formStatus.includes("Permintaan Anda berhasil tersimpan di Bagusin")) errors.push("Contact form: status does not confirm email-service acceptance");
  await interactionPage.locator("#project-form [data-copy-brief]").click();
  await interactionPage.waitForFunction(() => {
    const message = document.querySelector("#form-status")?.textContent || "";
    return message.includes("disalin") || message.includes("Penyalinan otomatis tidak tersedia");
  }, null, { timeout: 5000 });
  const copyStatus = await interactionPage.locator("#form-status").textContent();
  if (!copyStatus || !(copyStatus.includes("disalin") || copyStatus.includes("Penyalinan otomatis tidak tersedia"))) errors.push("Contact form: copy action did not provide useful feedback");

  // English contact form saves a localized inquiry to Supabase.
  await interactionPage.goto(origin + "/bagusin/en/contact/?service=copywriting&mode=consultation", { waitUntil: "domcontentloaded" });
  await interactionPage.locator(".site-footer__column").first().waitFor({ state: "attached", timeout: 5000 });
  const englishFooterLinks = await interactionPage.locator(".site-footer__links a").evaluateAll(links => links.map(link => ({
    text: (link.textContent || "").trim(),
    href: link.getAttribute("href") || ""
  })));
  const requiredEnglishFooterPaths = ["/bagusin/en/collections/", "/bagusin/en/learning/", "/bagusin/checkout/", "/bagusin/en/contact/", "/bagusin/en/legal/privacy/", "/bagusin/en/legal/terms/", "/bagusin/en/legal/disclaimer/", "/bagusin/en/legal/editorial-policy/"];
  for (const path of requiredEnglishFooterPaths) {
    if (!englishFooterLinks.some(link => link.href === path || link.href.startsWith(path + "?"))) {
      errors.push("English contact page: shared footer is missing expected destination " + path);
    }
  }
  if (englishFooterLinks.some(link => /search|author|portfolio|destinations/i.test(link.href))) {
    errors.push("English contact page: footer still exposes a legacy Search, Author, Portfolio, or Destinations link");
  }
  await interactionPage.locator("[data-stepper-next]").click();
  await interactionPage.locator("#project-form input[name=name]").fill("English Test User");
  await interactionPage.locator("#project-form input[name=email]").fill("english@example.com");
  await interactionPage.locator("#project-form textarea[name=brief]").fill("Testing the English contact email flow.");
  await interactionPage.locator("[data-stepper-next]").click();
  await interactionPage.locator("#project-form input[name=terms]").check();
  await interactionPage.locator("#project-form button[type=submit]").click();
  await interactionPage.waitForFunction(() => document.querySelector("#form-status")?.textContent.includes("Your request has been saved in Bagusin"), null, { timeout: 12000 });
  if (!contactInquiryPayload || contactInquiryPayload.request_type !== "consultation" || !contactInquiryPayload.subject.includes("Copywriting")) errors.push("English contact form: inquiry record is missing the selected service and inquiry mode");

  // If the database rejects a request, the contact form must provide an honest manual email fallback.
  await interactionPage.unroute(inquiryEndpoint);
  await interactionPage.route(inquiryEndpoint, async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info, prefer" } });
      return;
    }
    await route.fulfill({ status: 500, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" }, contentType: "application/json", body: JSON.stringify({ message: "Simulated database failure" }) });
  });
  await interactionPage.goto(origin + "/bagusin/contact/", { waitUntil: "domcontentloaded" });
  await interactionPage.locator("[data-stepper-next]").click();
  await interactionPage.locator("#project-form input[name=name]").fill("Fallback Test User");
  await interactionPage.locator("#project-form input[name=email]").fill("fallback@example.com");
  await interactionPage.locator("#project-form textarea[name=brief]").fill("Testing the manual email fallback.");
  await interactionPage.locator("[data-stepper-next]").click();
  await interactionPage.locator("#project-form input[name=terms]").check();
  await interactionPage.locator("#project-form button[type=submit]").click();
  await interactionPage.waitForFunction(() => document.querySelector("#project-form [data-mailto-fallback]") !== null, null, { timeout: 5000 });
  const fallbackLink = interactionPage.locator("#project-form [data-mailto-fallback]");
  if (!(await fallbackLink.getAttribute("href")).startsWith("mailto:sbaguskristian@gmail.com")) errors.push("Contact form: failure fallback does not open the configured recipient");
  if (!(await interactionPage.locator("#form-status").innerText()).includes("Database belum mengonfirmasi")) errors.push("Contact form: failed delivery is not communicated honestly");
  await interactionPage.unroute(inquiryEndpoint);

  // The Indonesian services page should use Indonesian metadata and headings.
  await interactionPage.goto(origin + "/bagusin/work/", { waitUntil: "domcontentloaded" });
  const workTitle = await interactionPage.title();
  const workHeading = await interactionPage.locator("main h1").textContent();
  if (!workTitle.includes("Layanan dan Proyek")) errors.push("Work page: title metadata is not localized");
  if (!workHeading || !workHeading.includes("Ada yang perlu dibangun")) errors.push("Work page: main heading is not localized");
  const workText = await interactionPage.locator("main").innerText();
  if (workText.includes("What are you trying to achieve?") || workText.includes("View service")) errors.push("Work page: English interface copy remains in Indonesian content");

  // Service preselection should use localized labels on the Indonesian contact page.
  await interactionPage.goto(origin + "/bagusin/contact/?service=landing-pages", { waitUntil: "domcontentloaded" });
  const selectedService = await interactionPage.locator("#selected-service").textContent();
  if (!selectedService || !selectedService.includes("Landing Page & Iklan")) errors.push("Contact form: selected service label is not localized");

  // The About page should describe Bagusin as a personal blog/documentation space, not a software studio.
  await interactionPage.goto(origin + "/bagusin/about/", { waitUntil: "domcontentloaded" });
  const aboutTitle = await interactionPage.title();
  const aboutText = await interactionPage.locator("main").innerText();
  const aboutStructuredData = await interactionPage.locator('script[type="application/ld+json"]').first().textContent();
  if (!aboutTitle.includes("Tentang")) errors.push("About page: title metadata is not localized");
  if (!aboutText.includes("ruang untuk pekerjaan digital") || !aboutText.includes("Selalu ada ruang untuk memperbaiki.")) errors.push("About page: current Indonesian positioning copy is missing");
  if (aboutText.includes("independent software studio") || aboutText.includes("Built around real problems.")) errors.push("About page: outdated English positioning copy remains");
  if (!aboutStructuredData || aboutStructuredData.includes("independent software studio")) errors.push("About page: structured data still contains outdated positioning");

  // Portfolio copy must be localized and accurately distinguish real projects from experiments.
  await interactionPage.goto(origin + "/bagusin/portfolio/", { waitUntil: "domcontentloaded" });
  const portfolioTitle = await interactionPage.title();
  const portfolioText = await interactionPage.locator("main").innerText();
  const portfolioStructuredData = await interactionPage.locator('script[type="application/ld+json"]').first().textContent();
  if (!portfolioTitle.includes("Portofolio")) errors.push("Portfolio page: title metadata is not localized");
  if (!portfolioText.includes("Pekerjaan nyata, proses yang jujur, dan konteks yang jelas.") || !portfolioText.includes("Portofolio seharusnya menunjukkan cara berpikir")) errors.push("Portfolio page: Indonesian headings are missing");
  if (portfolioText.includes("Things I’ve built, tested, and explored.") || portfolioText.includes("independent software studio") || portfolioText.includes("Work With Me")) errors.push("Portfolio page: outdated English or studio positioning remains");
  if (!portfolioStructuredData || portfolioStructuredData.includes("software engineering")) errors.push("Portfolio page: structured data still contains outdated English description");

  // The YouTube page remains honest about video availability while using Indonesian copy.
  await interactionPage.goto(origin + "/bagusin/youtube/", { waitUntil: "domcontentloaded" });
  const youtubeText = await interactionPage.locator("main").innerText();
  const youtubeStructuredData = await interactionPage.locator('script[type="application/ld+json"]').first().textContent();
  if (!youtubeText.includes("Cerita yang tidak berhenti di halaman.")) errors.push("YouTube page: Indonesian hero copy is missing");
  if (youtubeText.includes("Stories that move beyond the page.") || youtubeText.includes("The channel will grow with the journey.") || youtubeText.includes("Field Notes")) errors.push("YouTube page: English interface copy remains on the Indonesian page");
  if (!youtubeText.includes("thumbnail atau judul fiktif")) errors.push("YouTube page: transparency note about unavailable videos is missing");
  if (!youtubeStructuredData || youtubeStructuredData.includes("software engineering")) errors.push("YouTube page: structured data still contains English description");

  // The Blog index should keep its own label (Blog) while localizing the surrounding interface.
  await interactionPage.goto(origin + "/bagusin/blog/", { waitUntil: "domcontentloaded" });
  const blogTitle = await interactionPage.title();
  const blogText = await interactionPage.locator("main").innerText();
  const blogStructuredData = await interactionPage.locator('script[type="application/ld+json"]').first().textContent();
  if (!blogTitle.includes("Blog")) errors.push("Blog page: title metadata is missing");
  if (!blogText.includes("Cerita, panduan, dan hal yang layak dibagikan.") || !blogText.includes("Temukan pengalaman, ide, dan panduan praktis")) errors.push("Blog page: Indonesian hero copy is missing");
  if (blogText.includes("Stories from the road") || blogText.includes("Read the story") || blogText.includes("The archive grows with real experience.")) errors.push("Blog page: English interface copy remains");
  if (!blogStructuredData || blogStructuredData.includes("software engineering")) errors.push("Blog page: structured data still contains outdated English description");

  // Blog index: verify real search, auto-generated categories, pagination, card destinations, and responsive columns.
  const blogCards = interactionPage.locator("[data-blog-grid] .blog-card");
  await blogCards.first().waitFor({ state: "visible", timeout: 5000 });
  const initialBlogCount = await blogCards.count();
  if (initialBlogCount !== 1) errors.push("Blog page: expected exactly one current public article card, got " + initialBlogCount);
  const categoryButtons = interactionPage.locator("[data-blog-categories] [data-category]");
  if (await categoryButtons.count() < 2) errors.push("Blog page: categories were not generated from the article catalogue");
  const travelCategory = interactionPage.locator('[data-blog-categories] [data-category="Perjalanan · Bali"]');
  if (!(await travelCategory.count())) errors.push("Blog page: current article category is missing from filters");
  else {
    await travelCategory.click();
    const filteredLabels = await interactionPage.locator("[data-blog-grid] .blog-card__label").allTextContents();
    if (filteredLabels.length !== 1 || filteredLabels.some(label => label.trim() !== "Perjalanan · Bali")) errors.push("Blog page: category filter did not show the current article");
  }
  await interactionPage.locator('[data-blog-categories] [data-category="Semua artikel"]').click();
  await interactionPage.locator("[data-blog-search-input]").fill("");
  const blogSearch = interactionPage.locator("[data-blog-search-input]");
  await blogSearch.fill("pantai kuta");
  const currentCards = await interactionPage.locator("[data-blog-grid] .blog-card__title").allTextContents();
  if (!currentCards.some(title => title.toLowerCase().includes("pantai kuta"))) errors.push("Blog page: keyword search did not find the current Pantai Kuta article");
  await blogSearch.fill("");
  await blogSearch.focus();
  const suggestionButtons = interactionPage.locator("[data-blog-suggestions] [data-suggest]");
  if (!(await suggestionButtons.count())) errors.push("Blog page: topic suggestions do not appear on search focus");
  else {
    await suggestionButtons.first().click();
    const selectedCategory = await interactionPage.locator("[data-blog-categories] [aria-pressed='true']").innerText();
    const selectedLabels = await interactionPage.locator("[data-blog-grid] .blog-card__label").allTextContents();
    if (!selectedLabels.length || selectedLabels.some(label => label.trim() !== selectedCategory.replace(/\s+\d+$/, "").trim())) errors.push("Blog page: clicking a suggested topic did not filter matching cards");
  }
  await interactionPage.locator('[data-blog-categories] [data-category="Semua artikel"]').click();
  await interactionPage.locator("[data-blog-search-input]").fill("");
  const firstCardLink = interactionPage.locator("[data-blog-grid] .blog-card__link").first();
  if (!(await firstCardLink.getAttribute("href"))?.startsWith("/bagusin/blog/")) errors.push("Blog page: article cards do not link to article detail pages");
  const blogGrid = interactionPage.locator("[data-blog-grid]");
  const mobileCardColumns = await blogGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length);
  if (mobileCardColumns !== 1) errors.push("Blog page @ 390px: cards should stack in one column, got " + mobileCardColumns);
  await interactionPage.setViewportSize({ width: 1440, height: 900 });
  const desktopCardColumns = await blogGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length);
  if (desktopCardColumns !== 4) errors.push("Blog page @ 1440px: expected four card columns, got " + desktopCardColumns);
  await interactionPage.setViewportSize({ width: 390, height: 844 });
  await interactionPage.goto(origin + "/bagusin/blog/pantai-kuta-bali/", { waitUntil: "domcontentloaded" });
  const currentArticleHeading = await interactionPage.locator("main h1").textContent();
  if (!currentArticleHeading || !currentArticleHeading.includes("Pantai Kuta Bali")) errors.push("Article page: current public article heading is missing");
  if (!(await interactionPage.locator(".site-footer").count())) errors.push("Article page: shared global footer is missing");

  // Checkout must be an honest draft flow: validate, review, accept terms, and never expose payment details.
  await interactionPage.goto(origin + "/bagusin/checkout/?service=landing-pages", { waitUntil: "domcontentloaded" });
  if (await interactionPage.locator("#service").inputValue() !== "landing-pages") errors.push("Checkout: incoming service was not preselected");
  await interactionPage.locator("#name").fill("Test Client");
  await interactionPage.locator("#email").fill("client@example.com");
  await interactionPage.locator("#timeline").fill("Start 20 October, finish 5 November");
  await interactionPage.locator("#agreed-quote").fill("1500000");
  await interactionPage.locator("#payment-plan").fill("50% deposit, balance on handover");
  await interactionPage.locator("#brief").fill("Need a responsive campaign page <script>not executable</script>.");
  await interactionPage.locator('[data-next="2"]').click();
  if (await interactionPage.locator('[data-panel="2"]').isHidden()) errors.push("Checkout: valid brief did not advance to review");
  if (!(await interactionPage.locator("#review-box").innerText()).includes("Test Client")) errors.push("Checkout: review summary did not include entered details");
  if (await interactionPage.locator("#review-box script").count()) errors.push("Checkout: user brief was interpreted as HTML instead of escaped text");
  await interactionPage.locator('[data-step-nav="3"]').click();
  if (await interactionPage.locator('[data-panel="3"]').isHidden()) errors.push("Checkout: review did not advance to terms");
  await interactionPage.locator('[data-step-nav="4"]').click();
  if (await interactionPage.locator('[data-panel="4"]').isVisible()) errors.push("Checkout: terms step allowed continuation without consent");
  const requiredConsents = interactionPage.locator('[data-panel="3"] input[type="checkbox"][required]');
  for (let i = 0; i < await requiredConsents.count(); i += 1) await requiredConsents.nth(i).check();
  await interactionPage.locator('[data-next="4"]').click();
  if (await interactionPage.locator('[data-panel="4"]').isHidden()) errors.push("Checkout: terms consent did not advance to next steps");
  const checkoutText = await interactionPage.locator("#main-content").innerText();
  if (!checkoutText.includes("follow-up dilakukan secara personal melalui WhatsApp")) errors.push("Checkout: manual WhatsApp follow-up process is not explained");
  if (!checkoutText.includes("sbaguskristian@gmail.com")) errors.push("Checkout: destination email is not disclosed");
  if (checkoutText.includes("1460137710")) errors.push("Checkout: bank account details are shown before an agreed quotation");
  let submittedEmailPayload = null;
  await interactionPage.route("https://formsubmit.co/ajax/sbaguskristian@gmail.com", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Accept" } });
      return;
    }
    submittedEmailPayload = route.request().postDataJSON();
    await route.fulfill({ status: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Accept" }, contentType: "application/json", body: JSON.stringify({ success: "true", message: "Test submission accepted" }) });
  });
  await interactionPage.locator("#send-order-brief").click();
  await interactionPage.waitForFunction(() => document.querySelector("#checkout-email-status")?.textContent.includes("diterima layanan email"), null, { timeout: 5000 });
  if (!submittedEmailPayload || submittedEmailPayload.client_email !== "client@example.com") errors.push("Checkout: email submission payload is missing the client's reply address");
  if (!submittedEmailPayload || submittedEmailPayload.service_id !== "landing-pages") errors.push("Checkout: email submission payload is missing the selected service");
  if (!submittedEmailPayload || !submittedEmailPayload.project_brief.includes("responsive campaign page")) errors.push("Checkout: email submission payload is missing the project brief");
  if (!submittedEmailPayload || !submittedEmailPayload._subject.includes("Landing Page & Iklan")) errors.push("Checkout: email subject does not identify the service");
  await interactionPage.goto(origin + "/bagusin/checkout/?service=google-ads", { waitUntil: "domcontentloaded" });
  await interactionPage.locator("#name").fill("Test Client");
  await interactionPage.locator("#email").fill("client@example.com");
  await interactionPage.locator("#brief").fill("Test unavailable service guard.");
  await interactionPage.locator('[data-next="2"]').click();
  if (await interactionPage.locator('[data-panel="2"]').isVisible()) errors.push("Checkout: coming-soon service incorrectly allowed direct order");

  // An explicit service link must not inherit a stale collection/category from a previous session draft.
  await interactionPage.evaluate(() => sessionStorage.setItem("bagusin-checkout", JSON.stringify({
    collection: "stale-collection", industry: "stale-industry", category: "landing", tier: "business", name: "Saved Name"
  })));
  await interactionPage.goto(origin + "/bagusin/checkout/?service=websites&mode=order", { waitUntil: "domcontentloaded" });
  if (await interactionPage.locator("#service").inputValue() !== "websites") errors.push("Checkout: explicit service did not override the saved draft");
  if (!(await interactionPage.locator("#collection-context").isHidden())) errors.push("Checkout: stale collection context leaked into a direct service order");
  if (!(await interactionPage.locator("#aside-category-row").isHidden())) errors.push("Checkout: stale category leaked into a direct service order");
  if ((await interactionPage.locator("#aside-tier").textContent()).trim() !== "Belum ditentukan") errors.push("Checkout: stale tier leaked into a direct service order");

  // Current service detail pages route into the contextual multi-step inquiry form.
  const serviceCases = [
    { route: "/bagusin/work/landing-pages/", service: "landing-pages", label: "Landing Page" },
    { route: "/bagusin/work/websites/", service: "websites", label: "Website" },
    { route: "/bagusin/work/copywriting/", service: "copywriting", label: "Copywriting" }
  ];
  for (const item of serviceCases) {
    await interactionPage.goto(origin + item.route, { waitUntil: "domcontentloaded" });
    const orderLink = interactionPage.locator('a[href*="/contact/?service="]').first();
    if (!(await orderLink.count())) { errors.push("Service detail: inquiry CTA is missing for " + item.service); continue; }
    const orderUrl = new URL(await orderLink.getAttribute("href"), origin);
    if (orderUrl.searchParams.get("service") !== item.service) errors.push("Service detail: service context was lost for " + item.service);
    if (orderUrl.searchParams.get("mode") !== "project") errors.push("Service detail: project inquiry mode is missing for " + item.service);
    await interactionPage.goto(orderUrl.href, { waitUntil: "domcontentloaded" });
    const contextLabel = await interactionPage.locator("#selected-service").textContent();
    if (!contextLabel || !contextLabel.includes(item.label)) errors.push("Service inquiry: selected service was not prefilled for " + item.service);
  }

  // Bagusin Store: catalogue, persistent cart, variant selection and checkout.
  const demoProduct = {"id":"11111111-1111-4111-8111-111111111111","slug":"demo-produk","sku":"DEMO-001","name":"Produk Demo Bagusin","short_description":"Produk contoh untuk pengujian alur katalog.","description":"Deskripsi demo produk.","brand":"Bagusin","category":"RAM","product_type":"physical","price_amount":100000,"compare_at_price":150000,"currency":"IDR","stock_quantity":20,"manage_stock":true,"availability":"in_stock","image_path":null,"status":"published","condition":"new","specifications":[{"group":"Memori","items":{"Kapasitas":"16 GB","Tipe":"DDR5"}},{"group":"Kompatibilitas","items":{"Form factor":"DIMM"}}]};
  const demoVariants = [
    {"id":"22222222-2222-4222-8222-222222222222","sku":"DEMO-RAM-8-DDR4","variant_name":"RAM 8 GB · DDR4","variant_options":{"RAM":"8 GB","DDR":"DDR4"},"price_override":110000,"stock_quantity":4,"status":"published","sort_order":0},
    {"id":"33333333-3333-4333-8333-333333333333","sku":"DEMO-RAM-16-DDR5","variant_name":"RAM 16 GB · DDR5","variant_options":{"RAM":"16 GB","DDR":"DDR5"},"price_override":125000,"stock_quantity":5,"status":"published","sort_order":1}
  ];
  await interactionPage.evaluate(() => { localStorage.removeItem("bagusin-store-cart"); localStorage.removeItem("bagusin-store-wishlist"); });
  await interactionPage.route("https://hpmeoxynftankklwgntb.supabase.co/rest/v1/store_products*", route => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify([demoProduct])
  }));
  await interactionPage.route("https://hpmeoxynftankklwgntb.supabase.co/rest/v1/store_product_variants*", route => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify(demoVariants)
  }));
  let storeCheckoutPayload = null;
  await interactionPage.route("https://hpmeoxynftankklwgntb.supabase.co/functions/v1/store-checkout", async route => {
    storeCheckoutPayload = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ success: true, order: { order_number: "BS-TEST-001", total_amount: 49000 } }) });
  });
  await interactionPage.setViewportSize({ width: 390, height: 844 });
  await interactionPage.goto(origin + "/bagusin/store/", { waitUntil: "domcontentloaded" });
  const storeCard = interactionPage.locator(".store-card").first();
  await storeCard.waitFor({ state: "visible", timeout: 10000 });
  if (!(await storeCard.innerText()).includes("Produk Demo Bagusin")) errors.push("Bagusin Store: published product card is missing");
  await interactionPage.locator('#store-categories button[data-category="Komponen PC"]').click();
  if (await interactionPage.locator(".store-card").count() !== 1) errors.push("Bagusin Store: category filter did not retain the matching product");
  await interactionPage.locator("#store-search").fill("tidak-ada-produk");
  if (!(await interactionPage.locator(".store-empty").isVisible())) errors.push("Bagusin Store: unmatched search does not show an honest empty state");
  await interactionPage.locator("#store-search").fill("");
  await storeCard.locator('button[data-add="11111111-1111-4111-8111-111111111111"]').click();
  await interactionPage.locator("[data-open-cart]").click();
  if (!(await interactionPage.locator("[data-store-drawer]").isVisible())) errors.push("Bagusin Store: cart drawer did not open after adding a product");
  await interactionPage.locator("[data-start-checkout]").click();
  await interactionPage.locator('input[name="full_name"]').fill("Store Test User");
  await interactionPage.locator('input[name="email"]').fill("store@example.com");
  await interactionPage.locator('input[name="phone"]').fill("+628123456789");
  await interactionPage.locator('select[name="delivery_method"]').selectOption("pickup");
  await interactionPage.locator("[data-step-next]").click();
  if (!(await interactionPage.locator("[data-checkout-summary]").innerText()).includes("Produk Demo Bagusin")) errors.push("Bagusin Store: confirmation step lost the selected product");
  await interactionPage.locator('input[name="consent"]').check();
  await interactionPage.locator("[data-step-submit]").click();
  await interactionPage.locator("[data-store-success]").waitFor({ state: "visible", timeout: 5000 });
  if (!(await interactionPage.locator("[data-store-success]").innerText()).includes("Pesanan berhasil dibuat")) errors.push("Bagusin Store: successful order confirmation is missing");
  if (!storeCheckoutPayload || storeCheckoutPayload.items?.[0]?.product_id !== demoProduct.id) errors.push("Bagusin Store: checkout payload is missing the selected product");
  if (!(await interactionPage.locator("footer.site-footer").count()) || await interactionPage.locator("footer.store-footer").count()) errors.push("Bagusin Store: shared footer is missing or replaced");

  await interactionPage.evaluate(() => localStorage.removeItem("bagusin-store-cart"));
  await interactionPage.route("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0", route => route.fulfill({
    status: 200, contentType: "application/javascript",
    body: "window.supabase = { createClient: () => ({ from: (table) => { const query = { eq: () => query, neq: () => query, maybeSingle: async () => ({ data: " + JSON.stringify(demoProduct) + ", error: null }), order: async () => ({ data: table === 'store_product_variants' ? " + JSON.stringify(demoVariants) + " : [], error: null }), limit: async () => ({ data: [], error: null }) }; return { select: () => query }; } }) };"
  }));
  await interactionPage.goto(origin + "/bagusin/store/product/?slug=demo-produk", { waitUntil: "domcontentloaded" });
  await interactionPage.locator(".store-product-info h1").waitFor({ state: "visible", timeout: 10000 });
  if (await interactionPage.locator(".store-breadcrumb li").count() !== 3) errors.push("Bagusin Store detail: breadcrumb hierarchy is incomplete");
  if (!(await interactionPage.locator(".store-breadcrumb li:nth-child(2) a").getAttribute("href")).includes("category=Komponen%20PC")) errors.push("Bagusin Store detail: breadcrumb category does not link to the matching catalogue filter");
  if (await interactionPage.locator(".store-variant-field").count() !== 2) errors.push("Bagusin Store detail: multi-attribute variant selectors are missing");
  if (await interactionPage.locator(".store-product-spec-group").count() !== 2) errors.push("Bagusin Store detail: grouped product specifications are missing");
  await interactionPage.locator('[data-variant-option="RAM"]').selectOption("16 GB");
  await interactionPage.locator('[data-variant-option="DDR"]').selectOption("DDR5");
  if (!(await interactionPage.locator("[data-current-price]").innerText()).includes("125.000")) errors.push("Bagusin Store detail: selected variant price was not applied");
  if (await interactionPage.locator("[data-product-add]").isDisabled()) errors.push("Bagusin Store detail: available variant cannot be added to cart");
  if (await interactionPage.locator(".store-product-assurances").count()) errors.push("Bagusin Store detail: redundant checklist assurances are still visible");
  if (!(await interactionPage.locator(".store-product-seo").isVisible())) errors.push("Bagusin Store detail: contextual product copy is missing");
  const iconWidths = await interactionPage.locator(".store-header-icon").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
  if (iconWidths.length !== 2 || Math.abs(iconWidths[0] - iconWidths[1]) > 1) errors.push("Bagusin Store detail: wishlist and cart icon sizes are inconsistent");
  const breadcrumbFits = await interactionPage.locator(".store-breadcrumb").evaluate(node => node.scrollWidth <= node.clientWidth + 1);
  if (!breadcrumbFits) errors.push("Bagusin Store detail: breadcrumb overflows the mobile viewport");
  await interactionPage.locator("[data-product-add]").click();
  await interactionPage.locator("[data-store-drawer]").waitFor({ state: "visible", timeout: 10000 });
  const variantCartText = await interactionPage.locator("[data-cart-items]").innerText();
  if (!variantCartText.includes("RAM: 16 GB") || !variantCartText.includes("DDR: DDR5") || !variantCartText.includes("125.000")) errors.push("Bagusin Store: selected variant did not persist into the cart");
  await interactionPage.locator("[data-start-checkout]").click();
  await interactionPage.locator('input[name="full_name"]').fill("Variant Test User");
  await interactionPage.locator('input[name="email"]').fill("variant@example.com");
  await interactionPage.locator('input[name="phone"]').fill("+628123456789");
  await interactionPage.locator('select[name="delivery_method"]').selectOption("pickup");
  await interactionPage.locator("[data-step-next]").click();
  const variantSummary = await interactionPage.locator("[data-checkout-summary]").innerText();
  if (!variantSummary.includes("RAM: 16 GB") || !variantSummary.includes("125.000")) errors.push("Bagusin Store: checkout summary lost the selected variant or its price");
  await interactionPage.locator('input[name="consent"]').check();
  await interactionPage.locator("[data-step-submit]").click();
  await interactionPage.locator("[data-store-success]").waitFor({ state: "visible", timeout: 5000 });
  if (!storeCheckoutPayload || storeCheckoutPayload.items?.[0]?.variant_id !== demoVariants[1].id) errors.push("Bagusin Store: variant ID was not passed to the checkout service");
  if (!storeCheckoutPayload || storeCheckoutPayload.items?.[0]?.quantity !== 1) errors.push("Bagusin Store: selected variant quantity was not passed to checkout");
  // Collections and Portfolio have distinct roles and destinations.
  await interactionPage.goto(origin + "/bagusin/collections/", { waitUntil: "domcontentloaded" });
  await interactionPage.locator("[data-template-grid] .template-product").first().waitFor({ timeout: 10000 });
  const collectionTitle = await interactionPage.title();
  const collectionText = await interactionPage.locator("main").innerText();
  if (!collectionTitle.includes("Katalog Desain Website")) errors.push("Collections page: title metadata is not localized");
  if (!collectionText.includes("Koleksi terbaru") || !collectionText.includes("Bagus Sewa Mobil Bali 01")) errors.push("Collections page: latest demo is missing");
  if (!collectionText.includes("750.000") || !collectionText.includes("domain/hosting terpisah")) errors.push("Collections page: package price or exclusions are unclear");
  const templateCard = interactionPage.locator("[data-template-grid] .template-product").filter({ hasText: "Bagus Sewa Mobil Bali 01" }).first();
  if (!(await templateCard.locator(".template-chip").allTextContents()).some(text => text.includes("Satu halaman"))) errors.push("Collections page: one-page format label is incorrect");
  // The collection card intentionally links directly to the canonical demo and
  // product detail page. Assert the current, user-facing destinations rather than
  // an obsolete preview route that is not used by the catalog data.
  const demoLink = templateCard.locator('a[href="/bagusin/demos/starter/travel-rental/bagus-sewa-mobil-bali-01/"]').first();
  if (!(await demoLink.count()) || !(await demoLink.innerText()).includes("demo")) errors.push("Collections page: canonical demo link is missing");
  const packageLink = templateCard.locator('a[href="/bagusin/templates/detail/?template=BG-TRV-STR-001"]').first();
  if (!(await packageLink.count()) || !(await packageLink.innerText()).includes("Paket")) errors.push("Collections page: package and pricing CTA is missing");
  if (!(await interactionPage.locator('.site-nav a[href="/bagusin/collections/"]').count())) errors.push("Collections page: collection navigation link is missing");

  // Verify the complete template journey: catalog → demo → package details → correct contact intent.
  await interactionPage.goto(origin + "/bagusin/templates/detail/?template=BG-TRV-STR-001", { waitUntil: "domcontentloaded" });
  await interactionPage.locator("[data-detail-name]").filter({ hasText: "Bagus Sewa Mobil Bali 01" }).waitFor({ timeout: 10000 });
  if (!(await interactionPage.locator("[data-detail-base-price]").innerText()).includes("750.000")) errors.push("Template detail: base package price is missing or incorrect");
  if (await interactionPage.locator("[data-detail-included] li").count() < 3) errors.push("Template detail: included scope did not load from the catalog");
  if (await interactionPage.locator("[data-detail-excluded] li").count() < 2) errors.push("Template detail: exclusions did not load from the catalog");
  const orderHref = await interactionPage.locator("[data-detail-order]").first().getAttribute("href");
  if (!orderHref?.includes("service=websites") || !orderHref.includes("mode=project")) errors.push("Template detail: order CTA does not preselect a website project");
  const discussHref = await interactionPage.locator("[data-detail-discuss]").first().getAttribute("href");
  if (!discussHref?.includes("service=websites") || !discussHref.includes("mode=consultation")) errors.push("Template detail: discussion CTA does not preselect website consultation");
  const meetingHref = await interactionPage.locator("[data-detail-meeting]").first().getAttribute("href");
  if (!meetingHref?.includes("service=consultation") || !meetingHref.includes("meeting=in-person")) errors.push("Template detail: in-person meeting CTA does not preselect paid consultation");

  await interactionPage.goto(origin + "/bagusin/demos/starter/travel-rental/bagus-sewa-mobil-bali-01/", { waitUntil: "domcontentloaded" });
  if (!(await interactionPage.locator('meta[name="robots"]').getAttribute("content"))?.includes("noindex")) errors.push("Template demo: demo is not marked noindex");
  if (!(await interactionPage.locator('a[href="/bagusin/templates/detail/?template=BG-TRV-STR-001"]').count())) errors.push("Template demo: detail and pricing CTA is missing");
  await interactionPage.locator("[data-demo-whatsapp]").first().click();
  if (await interactionPage.locator("#demo-notice").evaluate(el => getComputedStyle(el).display === "none")) errors.push("Template demo: unconfigured WhatsApp CTA does not explain the placeholder");

  await interactionPage.goto(origin + "/bagusin/portfolio/", { waitUntil: "domcontentloaded" });
  const portfolioSeparationText = await interactionPage.locator("main").innerText();
  if (!portfolioSeparationText.toLowerCase().includes("proyek internal atau eksperimen")) errors.push("Portfolio page: personal projects and experiments are not clearly labeled");
  if (!portfolioSeparationText.includes("hanya akan ditampilkan jika ada izin")) errors.push("Portfolio page: client permission boundary is missing");
  if (portfolioSeparationText.includes("Koleksi terbaru") || portfolioSeparationText.includes("Pilih template")) errors.push("Portfolio page: collection/order content has not been separated");

  // Destinations should remain experience-based, without fabricated ratings or itineraries.
  // Destinations is intentionally consolidated into Blog; verify the final redirect destination.
  await interactionPage.goto(origin + "/bagusin/destinations/", { waitUntil: "domcontentloaded" });
  await interactionPage.waitForURL(/\/bagusin\/blog\/$/, { timeout: 5000 });
  const destinationsTitle = await interactionPage.title();
  const destinationsText = await interactionPage.locator("main").innerText();
  if (!destinationsTitle.includes("Blog") || !destinationsTitle.includes("Bagusin")) errors.push("Destinations redirect: final Blog page title is missing");
  if (destinationsText.includes("Places, seen through the experience of being there.") || destinationsText.includes("A growing map of stories.")) errors.push("Destinations redirect: outdated English interface copy remains on the final Blog page");
} catch (error) {
  errors.push("Homepage/article/contact interaction smoke test: " + (error.stack || error.message));
} finally {
  await interactionPage.close();
  await browser.close();
}

console.log("Responsive browser smoke test");
console.log("Routes checked: " + routes.length);
console.log("Viewport checks: " + routes.length * viewports.length);
if (errors.length) {
  console.error("FAIL: " + errors.length + " issue(s)");
  for (const error of errors) console.error("- " + error);
  process.exitCode = 1;
} else {
  console.log("PASS: tested route loading, structural overflow, local resources, JavaScript errors, mobile menu, global search, and contact brief preparation/copy feedback, Indonesian services-page copy, About-page positioning, localized portfolio copy, Indonesian YouTube-page copy, localized Blog-index copy, and Indonesian Destinations-page copy.");
}
