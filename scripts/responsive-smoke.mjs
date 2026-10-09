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
];;
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
  await interactionPage.locator("#project-form input[name=name]").fill("Test User");
  await interactionPage.locator("#project-form input[name=email]").fill("test@example.com");
  await interactionPage.locator("#project-form textarea[name=brief]").fill("Testing the contact brief preparation flow.");
  await interactionPage.locator("#project-form input[name=terms]").check();
  await interactionPage.locator("#project-form button[type=submit]").click();
  const preparedBrief = interactionPage.locator("#project-form [data-brief-output]");
  if (!(await preparedBrief.count())) errors.push("Contact form: prepared brief output was not created");
  else if (!(await preparedBrief.inputValue()).includes("Testing the contact brief preparation flow.")) errors.push("Contact form: prepared brief is missing the entered details");
  if (!(await interactionPage.locator("#project-form [data-copy-brief]").count())) errors.push("Contact form: copy summary button was not created");
  const formStatus = await interactionPage.locator("#form-status").textContent();
  if (!formStatus || !formStatus.includes("belum mengirim data otomatis")) errors.push("Contact form: status does not clearly explain that the brief is not sent automatically");
  await interactionPage.locator("#project-form [data-copy-brief]").click();
  const copyStatus = await interactionPage.locator("#form-status").textContent();
  if (!copyStatus || !(copyStatus.includes("disalin") || copyStatus.includes("Penyalinan otomatis tidak tersedia"))) errors.push("Contact form: copy action did not provide useful feedback");
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
  console.log("PASS: tested route loading, structural overflow, local resources, JavaScript errors, mobile menu, global search, and contact brief preparation/copy feedback.");
}
