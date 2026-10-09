import { chromium } from "playwright";

const origin = "http://127.0.0.1:4173";
const routes = [
  "/bagusin/",
  "/bagusin/blog/",
  "/bagusin/blog/bekerja-dari-mana-saja/",
  "/bagusin/blog/pantai-kuta-bali/",
  "/bagusin/contact/",
  "/bagusin/work/",
  "/bagusin/work/landing-pages/",
  "/bagusin/checkout/",
  "/bagusin/legal/terms/",
  "/bagusin/author/",
  "/bagusin/youtube/",
  "/bagusin/search/",
  "/bagusin/copywriting/collections/",
  "/bagusin/landing-pages/collections/",
  "/bagusin/websites/collections/",
  "/bagusin/en/",
  "/bagusin/en/search/",
  "/bagusin/en/legal/terms/"
];
const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
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
} catch (error) {
  errors.push("Homepage/article interaction smoke test: " + error.message);
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
  console.log("PASS: tested route loading, structural overflow, local resource responses, JavaScript errors, mobile menu, and global search.");
}
