import { chromium } from "playwright";

const origin = "http://127.0.0.1:4173";
const routes = [
  "/bagusin/",
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
  "/bagusin/portfolio/",
  "/bagusin/youtube/",
  "/bagusin/about/",
  "/bagusin/author/",
  "/bagusin/contact/",
  "/bagusin/legal/privacy/",
  "/bagusin/legal/terms/",
  "/bagusin/legal/disclaimer/",
  "/bagusin/legal/editorial-policy/",
  "/bagusin/en/",
  "/bagusin/en/blog/",
  "/bagusin/en/blog/bekerja-dari-mana-saja/",
  "/bagusin/en/destinations/",
  "/bagusin/en/work/",
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
    page.on("pageerror", (error) => pageErrors.push(error.message));
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
try {
  await interactionPage.goto(origin + "/bagusin/", { waitUntil: "domcontentloaded" });
  const homepageText = await interactionPage.locator("main").innerText();
  if (!homepageText.includes("Penulisan Konten & SEO") || !homepageText.includes("Aplikasi Web & Sistem")) errors.push("Homepage: Indonesian service labels are missing");
  if (homepageText.includes("Content Writing & SEO") || homepageText.includes("Web Applications & Systems")) errors.push("Homepage: outdated English service labels remain");
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

  // Regression case: legacy articles may have a search toggle but no search panel.
  await interactionPage.goto(origin + "/bagusin/blog/bekerja-dari-mana-saja/", { waitUntil: "domcontentloaded" });
  const articleText = await interactionPage.locator("main").innerText();
  if (!articleText.includes("Ada yang perlu dibangun?")) errors.push("Article page: Indonesian contact CTA is missing");
  if (articleText.includes("Need something built?")) errors.push("Article page: English contact CTA remains");
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
        await articleSearchInput.fill("remote work");
        await articleSearchPanel.locator("form").evaluate((form) => form.requestSubmit());
        await interactionPage.waitForURL(/\/bagusin\/search\/\?q=remote(?:%20|\+)work/i, { timeout: 10000 });
      }
    }
  }

  // Contact form must prepare a copyable brief without falsely claiming delivery.
  await interactionPage.goto(origin + "/bagusin/contact/", { waitUntil: "domcontentloaded" });
  const contactHeading = await interactionPage.locator(".contact-hero h1").textContent();
  const contactTitle = await interactionPage.title();
  if (!contactHeading || !contactHeading.includes("Mulai dari masalahnya")) {
    errors.push("Contact page: Indonesian hero copy is not localized");
  }
  if (!contactTitle.includes("Kontak")) errors.push("Contact page: title metadata is not localized");
  const contactOptionsText = await interactionPage.locator("main").innerText();
  if (!contactOptionsText.includes("pengembangan perangkat lunak") || !contactOptionsText.includes("konten SEO")) errors.push("Contact page: Indonesian service description is missing");
  if (contactOptionsText.includes("software engineering") || contactOptionsText.includes("SEO content")) errors.push("Contact page: English service terms remain in Indonesian copy");
  let contactEmailPayload = null;
  await interactionPage.route("https://formsubmit.co/ajax/baguskristian@gmail.com", async (route) => {
    contactEmailPayload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: "true", message: "Test submission accepted" }) });
  });
  await interactionPage.locator("#project-form input[name=name]").fill("Test User");
  await interactionPage.locator("#project-form input[name=email]").fill("test@example.com");
  await interactionPage.locator("#project-form textarea[name=brief]").fill("Testing the contact email submission flow.");
  await interactionPage.locator("#project-form input[name=terms]").check();
  await interactionPage.locator("#project-form button[type=submit]").click();
  await interactionPage.waitForFunction(() => document.querySelector("#form-status")?.textContent.includes("Permintaan pengiriman diterima"), null, { timeout: 5000 });
  const preparedBrief = interactionPage.locator("#project-form [data-brief-output]");
  if (!(await preparedBrief.count())) errors.push("Contact form: prepared brief output was not created");
  else if (!(await preparedBrief.inputValue()).includes("Testing the contact email submission flow.")) errors.push("Contact form: prepared brief is missing the entered details");
  if (!(await interactionPage.locator("#project-form [data-copy-brief]").count())) errors.push("Contact form: copy summary button was not created");
  if (!contactEmailPayload || contactEmailPayload.email !== "test@example.com") errors.push("Contact form: email payload is missing the client's reply address");
  if (!contactEmailPayload || contactEmailPayload.service_id !== "landing-pages") errors.push("Contact form: email payload is missing the selected service");
  if (!contactEmailPayload || !contactEmailPayload.project_brief.includes("Testing the contact email submission flow.")) errors.push("Contact form: email payload is missing the project brief");
  const formStatus = await interactionPage.locator("#form-status").textContent();
  if (!formStatus || !formStatus.includes("Permintaan pengiriman diterima")) errors.push("Contact form: status does not confirm email-service acceptance");
  await interactionPage.locator("#project-form [data-copy-brief]").click();
  await interactionPage.waitForFunction(() => {
    const message = document.querySelector("#form-status")?.textContent || "";
    return message.includes("disalin") || message.includes("Penyalinan otomatis tidak tersedia");
  }, null, { timeout: 5000 });
  const copyStatus = await interactionPage.locator("#form-status").textContent();
  if (!copyStatus || !(copyStatus.includes("disalin") || copyStatus.includes("Penyalinan otomatis tidak tersedia"))) errors.push("Contact form: copy action did not provide useful feedback");

  // English contact form uses the same email workflow with localized status.
  await interactionPage.goto(origin + "/bagusin/en/contact/?service=copywriting&mode=consultation", { waitUntil: "domcontentloaded" });
  await interactionPage.locator("#project-form input[name=name]").fill("English Test User");
  await interactionPage.locator("#project-form input[name=email]").fill("english@example.com");
  await interactionPage.locator("#project-form textarea[name=brief]").fill("Testing the English contact email flow.");
  await interactionPage.locator("#project-form input[name=terms]").check();
  await interactionPage.locator("#project-form button[type=submit]").click();
  await interactionPage.waitForFunction(() => document.querySelector("#form-status")?.textContent.includes("The email service accepted the request"), null, { timeout: 5000 });
  if (!contactEmailPayload || contactEmailPayload.service_id !== "copywriting") errors.push("English contact form: email payload is missing the selected service");
  if (!contactEmailPayload || contactEmailPayload.mode !== "consultation") errors.push("English contact form: email payload is missing the inquiry mode");

  // If the email service fails, the contact form must provide an honest manual email fallback.
  await interactionPage.unroute("https://formsubmit.co/ajax/baguskristian@gmail.com");
  await interactionPage.route("https://formsubmit.co/ajax/baguskristian@gmail.com", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: "false", message: "Simulated email service failure" }) });
  });
  await interactionPage.goto(origin + "/bagusin/contact/", { waitUntil: "domcontentloaded" });
  await interactionPage.locator("#project-form input[name=name]").fill("Fallback Test User");
  await interactionPage.locator("#project-form input[name=email]").fill("fallback@example.com");
  await interactionPage.locator("#project-form textarea[name=brief]").fill("Testing the manual email fallback.");
  await interactionPage.locator("#project-form input[name=terms]").check();
  await interactionPage.locator("#project-form button[type=submit]").click();
  await interactionPage.waitForFunction(() => document.querySelector("#project-form [data-mailto-fallback]") !== null, null, { timeout: 5000 });
  const fallbackLink = interactionPage.locator("#project-form [data-mailto-fallback]");
  if (!(await fallbackLink.getAttribute("href")).startsWith("mailto:baguskristian@gmail.com")) errors.push("Contact form: failure fallback does not open the configured recipient");
  if (!(await interactionPage.locator("#form-status").innerText()).includes("belum terkonfirmasi")) errors.push("Contact form: failed delivery is not communicated honestly");
  await interactionPage.unroute("https://formsubmit.co/ajax/baguskristian@gmail.com");

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
  const aboutStructuredData = await interactionPage.locator('script[type="application/ld+json"]').textContent();
  if (!aboutTitle.includes("Tentang")) errors.push("About page: title metadata is not localized");
  if (!aboutText.includes("blog personal") || !aboutText.includes("Berangkat dari masalah nyata.")) errors.push("About page: Indonesian positioning copy is missing");
  if (aboutText.includes("independent software studio") || aboutText.includes("Built around real problems.")) errors.push("About page: outdated English positioning copy remains");
  if (!aboutStructuredData || aboutStructuredData.includes("independent software studio")) errors.push("About page: structured data still contains outdated positioning");

  // Portfolio copy must be localized and accurately distinguish real projects from experiments.
  await interactionPage.goto(origin + "/bagusin/portfolio/", { waitUntil: "domcontentloaded" });
  const portfolioTitle = await interactionPage.title();
  const portfolioText = await interactionPage.locator("main").innerText();
  const portfolioStructuredData = await interactionPage.locator('script[type="application/ld+json"]').textContent();
  if (!portfolioTitle.includes("Portofolio")) errors.push("Portfolio page: title metadata is not localized");
  if (!portfolioText.includes("Hal-hal yang saya bangun, uji, dan jelajahi.") || !portfolioText.includes("Portofolio seharusnya menunjukkan cara berpikir")) errors.push("Portfolio page: Indonesian headings are missing");
  if (portfolioText.includes("Things I’ve built, tested, and explored.") || portfolioText.includes("independent software studio") || portfolioText.includes("Work With Me")) errors.push("Portfolio page: outdated English or studio positioning remains");
  if (!portfolioStructuredData || portfolioStructuredData.includes("software engineering")) errors.push("Portfolio page: structured data still contains outdated English description");

  // The YouTube page remains honest about video availability while using Indonesian copy.
  await interactionPage.goto(origin + "/bagusin/youtube/", { waitUntil: "domcontentloaded" });
  const youtubeText = await interactionPage.locator("main").innerText();
  const youtubeStructuredData = await interactionPage.locator('script[type="application/ld+json"]').textContent();
  if (!youtubeText.includes("Cerita yang tidak berhenti di halaman.")) errors.push("YouTube page: Indonesian hero copy is missing");
  if (youtubeText.includes("Stories that move beyond the page.") || youtubeText.includes("The channel will grow with the journey.") || youtubeText.includes("Field Notes")) errors.push("YouTube page: English interface copy remains on the Indonesian page");
  if (!youtubeText.includes("thumbnail atau judul fiktif")) errors.push("YouTube page: transparency note about unavailable videos is missing");
  if (!youtubeStructuredData || youtubeStructuredData.includes("software engineering")) errors.push("YouTube page: structured data still contains English description");

  // The Blog index should keep its own label (Blog) while localizing the surrounding interface.
  await interactionPage.goto(origin + "/bagusin/blog/", { waitUntil: "domcontentloaded" });
  const blogTitle = await interactionPage.title();
  const blogText = await interactionPage.locator("main").innerText();
  const blogStructuredData = await interactionPage.locator('script[type="application/ld+json"]').textContent();
  if (!blogTitle.includes("Blog")) errors.push("Blog page: title metadata is missing");
  if (!blogText.includes("Cerita dari perjalanan, pekerjaan, dan hal-hal yang saya bangun.") || !blogText.includes("Arsip ini bertambah seiring pengalaman nyata.")) errors.push("Blog page: Indonesian headings are missing");
  if (blogText.includes("Stories from the road") || blogText.includes("Read the story") || blogText.includes("The archive grows with real experience.")) errors.push("Blog page: English interface copy remains");
  if (!blogStructuredData || blogStructuredData.includes("software engineering")) errors.push("Blog page: structured data still contains outdated English description");

  // Checkout must be an honest draft flow: validate, review, accept terms, and never expose payment details.
  await interactionPage.goto(origin + "/bagusin/checkout/?service=landing-pages", { waitUntil: "domcontentloaded" });
  if (await interactionPage.locator("#service").inputValue() !== "landing-pages") errors.push("Checkout: incoming service was not preselected");
  await interactionPage.locator("#name").fill("Test Client");
  await interactionPage.locator("#email").fill("client@example.com");
  await interactionPage.locator("#brief").fill("Need a responsive campaign page <script>not executable</script>.");
  await interactionPage.locator('[data-next="2"]').click();
  if (await interactionPage.locator('[data-panel="2"]').isHidden()) errors.push("Checkout: valid brief did not advance to review");
  if (!(await interactionPage.locator("#review-box").innerText()).includes("Test Client")) errors.push("Checkout: review summary did not include entered details");
  if (await interactionPage.locator("#review-box script").count()) errors.push("Checkout: user brief was interpreted as HTML instead of escaped text");
  await interactionPage.locator('[data-next="3"]').click();
  if (await interactionPage.locator('[data-panel="3"]').isHidden()) errors.push("Checkout: review did not advance to terms");
  await interactionPage.locator('[data-next="4"]').click();
  if (await interactionPage.locator('[data-panel="4"]').isVisible()) errors.push("Checkout: terms step allowed continuation without consent");
  await interactionPage.locator("#terms-agree").check();
  await interactionPage.locator('[data-next="4"]').click();
  if (await interactionPage.locator('[data-panel="4"]').isHidden()) errors.push("Checkout: terms consent did not advance to next steps");
  const checkoutText = await interactionPage.locator("#main-content").innerText();
  if (!checkoutText.includes("follow-up dilakukan secara personal melalui WhatsApp")) errors.push("Checkout: manual WhatsApp follow-up process is not explained");
  if (!checkoutText.includes("baguskristian@gmail.com")) errors.push("Checkout: destination email is not disclosed");
  if (checkoutText.includes("1460137710")) errors.push("Checkout: bank account details are shown before an agreed quotation");
  let submittedEmailPayload = null;
  await interactionPage.route("https://formsubmit.co/ajax/baguskristian@gmail.com", async (route) => {
    submittedEmailPayload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: "true", message: "Test submission accepted" }) });
  });
  await interactionPage.locator("#send-order-brief").click();
  await interactionPage.waitForFunction(() => document.querySelector("#checkout-email-status")?.textContent.includes("pengiriman berhasil diterima"), null, { timeout: 5000 });
  if (!submittedEmailPayload || submittedEmailPayload.client_email !== "client@example.com") errors.push("Checkout: email submission payload is missing the client's reply address");
  if (!submittedEmailPayload || submittedEmailPayload.service_id !== "landing-pages") errors.push("Checkout: email submission payload is missing the selected service");
  if (!submittedEmailPayload || !submittedEmailPayload.project_brief.includes("responsive campaign page")) errors.push("Checkout: email submission payload is missing the project brief");
  if (!submittedEmailPayload || !submittedEmailPayload._subject.includes("Landing Pages")) errors.push("Checkout: email subject does not identify the service");
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

  // Collection detail CTAs must preserve the right context into checkout.
  const collectionCases = [
    { route: "/bagusin/landing-pages/collections/detail/?collection=travel-showroom", service: "landing-pages", collection: "travel-showroom", contextKey: "industry", contextValue: "travel" },
    { route: "/bagusin/websites/collections/detail/?collection=travel-business-website", service: "websites", collection: "travel-business-website", contextKey: "industry", contextValue: "travel", tier: "starter" },
    { route: "/bagusin/copywriting/collections/detail/?collection=landing-page-copy", service: "copywriting", collection: "landing-page-copy", contextKey: "category", contextValue: "landing" }
  ];
  for (const item of collectionCases) {
    await interactionPage.goto(origin + item.route, { waitUntil: "domcontentloaded" });
    const orderLink = interactionPage.locator("[data-order]");
    if (!(await orderLink.count())) { errors.push("Collection detail: order CTA is missing for " + item.service); continue; }
    const orderHref = await orderLink.getAttribute("href");
    const orderUrl = new URL(orderHref, origin);
    if (orderUrl.searchParams.get("service") !== item.service) errors.push("Collection detail: service context was lost for " + item.service);
    if (orderUrl.searchParams.get("collection") !== item.collection) errors.push("Collection detail: collection context was lost for " + item.service);
    if (orderUrl.searchParams.get(item.contextKey) !== item.contextValue) errors.push("Collection detail: " + item.contextKey + " context is incorrect for " + item.service);
    if (item.service === "copywriting" && orderUrl.searchParams.has("industry")) errors.push("Collection detail: copywriting category was incorrectly passed as an industry");
    if (item.tier && orderUrl.searchParams.get("tier") !== item.tier) errors.push("Collection detail: website tier was lost");
    await interactionPage.goto(orderUrl.href, { waitUntil: "domcontentloaded" });
    if (await interactionPage.locator("#service").inputValue() !== item.service) errors.push("Checkout: collection CTA did not preselect " + item.service);
    await interactionPage.locator("#name").fill("Collection Test");
    await interactionPage.locator("#email").fill("collection@example.com");
    await interactionPage.locator("#brief").fill("Please review the selected collection and discuss scope.");
    await interactionPage.locator('[data-next="2"]').click();
    if (await interactionPage.locator('[data-panel="2"]').isHidden()) errors.push("Checkout: collection brief did not advance to review for " + item.service);
    const review = await interactionPage.locator("#review-box").innerText();
    if (!review.includes(item.collection.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "))) errors.push("Checkout: review summary lost collection name for " + item.service);
    if (item.service === "copywriting" && (!review.includes("Landing Page") || !review.includes("Kategori"))) errors.push("Checkout: copywriting category was not shown as a category");
    if (item.tier && !review.toLowerCase().includes("starter")) errors.push("Checkout: website tier was not shown in review");
  }

  // Copywriting category must survive the entire review-to-email journey.
  await interactionPage.locator('[data-next="3"]').click();
  await interactionPage.locator("#terms-agree").check();
  await interactionPage.locator('[data-next="4"]').click();
  await interactionPage.locator("#send-order-brief").click();
  await interactionPage.waitForFunction(() => document.querySelector("#checkout-email-status")?.textContent.includes("pengiriman berhasil diterima"), null, { timeout: 5000 });
  if (!submittedEmailPayload || submittedEmailPayload.category !== "Landing Page") errors.push("Checkout: copywriting category was not included in the email payload");

  // Destinations should remain experience-based, without fabricated ratings or itineraries.
  await interactionPage.goto(origin + "/bagusin/destinations/", { waitUntil: "domcontentloaded" });
  const destinationsTitle = await interactionPage.title();
  const destinationsText = await interactionPage.locator("main").innerText();
  const destinationsStructuredData = await interactionPage.locator('script[type="application/ld+json"]').textContent();
  if (!destinationsTitle.includes("Destinasi")) errors.push("Destinations page: title metadata is not localized");
  if (!destinationsText.includes("Tempat, dilihat dari pengalaman saat berada di sana.") || !destinationsText.includes("Tidak ada rencana perjalanan yang sempurna.")) errors.push("Destinations page: Indonesian headings are missing");
  if (destinationsText.includes("Places, seen through the experience of being there.") || destinationsText.includes("A growing map of stories.")) errors.push("Destinations page: English interface copy remains");
  if (!destinationsStructuredData || destinationsStructuredData.includes("Destinations BagusIn")) errors.push("Destinations page: structured data still contains outdated English description");
} catch (error) {
  errors.push("Homepage/article/contact interaction smoke test: " + error.message);
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
