import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE = "https://baguskristiansianturi.github.io/bagusin";
const errors = [];
const warnings = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".github"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const htmlFiles = files.filter((file) => file.toLowerCase().endsWith(".html"));
const htmlSet = new Set(htmlFiles.map((file) => path.relative(ROOT, file).split(path.sep).join("/")));

function cleanUrl(value) {
  return value.split("#")[0].split("?")[0];
}

function routeToFile(urlPath) {
  let route;
  try {
    route = decodeURIComponent(urlPath);
  } catch {
    route = urlPath;
  }
  route = route.replace(/^\/bagusin\/?/, "");
  if (!route) route = "index.html";
  const candidates = [route];
  if (route.endsWith("/")) candidates.unshift(route + "index.html");
  else if (!path.posix.extname(route)) candidates.push(route + "/index.html");
  for (const candidate of candidates) {
    const normalized = path.posix.normalize(candidate).replace(/^\.\//, "");
    if (htmlSet.has(normalized) || fs.existsSync(path.join(ROOT, normalized))) return normalized;
  }
  return null;
}

function extractTags(html, tagName) {
  const re = new RegExp("<" + tagName + "\\b[^>]*>", "gi");
  return [...html.matchAll(re)].map((match) => match[0]);
}

function attr(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(new RegExp("\\b" + escaped + "\\s*=\\s*([\\"'])(.*?)\\1", "i"));
  return match ? match[2] : null;
}

function metaContent(html, name) {
  const tags = extractTags(html, "meta");
  const tag = tags.find((item) => attr(item, "name")?.toLowerCase() === name.toLowerCase());
  return tag ? attr(tag, "content") : null;
}

function reportError(message) {
  errors.push(message);
}

for (const file of htmlFiles) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const robots = (metaContent(html, "robots") || "").toLowerCase();
  const noindex = robots.includes("noindex");
  const title = extractTags(html, "title")[0];
  const viewport = extractTags(html, "meta").find((tag) => attr(tag, "name")?.toLowerCase() === "viewport");
  if (!title) reportError(rel + ": missing <title>");
  if (!viewport) reportError(rel + ": missing viewport meta");

  const canonicalTag = extractTags(html, "link").find((tag) => (attr(tag, "rel") || "").toLowerCase() === "canonical");
  const canonical = canonicalTag ? attr(canonicalTag, "href") : null;
  if (!noindex && !canonical) reportError(rel + ": indexable page is missing a canonical URL");

  if (canonical) {
    if (!canonical.startsWith(BASE + "/")) {
      reportError(rel + ": canonical URL does not use the configured GitHub Pages base: " + canonical);
    } else {
      const canonicalFile = routeToFile(new URL(canonical).pathname);
      if (!canonicalFile) reportError(rel + ": canonical target does not exist: " + canonical);
      else if (!noindex && canonicalFile !== rel) {
        reportError(rel + ": indexable page canonical points to a different page: " + canonical);
      }
    }
  }

  for (const tag of [...extractTags(html, "a"), ...extractTags(html, "link")]) {
    const href = attr(tag, "href");
    if (!href) continue;
    let pathname = null;
    if (href.startsWith(BASE + "/")) pathname = new URL(href).pathname;
    else if (href.startsWith("/bagusin/")) pathname = cleanUrl(href);
    if (!pathname) continue;
    const target = routeToFile(pathname);
    if (!target) reportError(rel + ": broken internal URL " + href);
  }

  for (const tag of [...extractTags(html, "script"), ...extractTags(html, "img"), ...extractTags(html, "source")]) {
    const src = attr(tag, "src");
    if (!src || /^(?:https?:)?\/\//i.test(src) || /^(?:data:|blob:|javascript:)/i.test(src)) continue;
    const local = cleanUrl(src);
    let target;
    if (local.startsWith("/bagusin/")) target = path.join(ROOT, local.replace(/^\/bagusin\//, ""));
    else if (local.startsWith("/")) target = path.join(ROOT, local.slice(1));
    else target = path.resolve(path.dirname(file), local);
    if (!fs.existsSync(target)) reportError(rel + ": missing local asset " + src);
  }
}

const sitemapPath = path.join(ROOT, "sitemap.xml");
const robotsPath = path.join(ROOT, "robots.txt");
if (!fs.existsSync(sitemapPath)) reportError("Missing sitemap.xml");
if (!fs.existsSync(robotsPath)) reportError("Missing robots.txt");

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (sitemap.includes("bagusin.com")) reportError("sitemap.xml still references bagusin.com");
  const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1].trim());
  const seen = new Set();
  for (const loc of locs) {
    if (!loc.startsWith(BASE + "/")) reportError("Sitemap URL uses an unexpected base: " + loc);
    const file = routeToFile(new URL(loc).pathname);
    if (!file) reportError("Sitemap URL does not resolve to a page: " + loc);
    if (seen.has(loc)) reportError("Duplicate sitemap URL: " + loc);
    seen.add(loc);
    if (file) {
      const source = fs.readFileSync(path.join(ROOT, file), "utf8");
      if ((metaContent(source, "robots") || "").toLowerCase().includes("noindex")) {
        reportError("Noindex page is included in sitemap: " + loc);
      }
    }
  }
}

if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (robots.includes("bagusin.com")) reportError("robots.txt still references bagusin.com");
  if (!robots.includes(BASE + "/sitemap.xml")) reportError("robots.txt does not point to the configured sitemap");
}

console.log("Static Bagusin audit");
console.log("HTML pages checked: " + htmlFiles.length);
console.log("Sitemap URLs checked: " + (fs.existsSync(sitemapPath) ? (fs.readFileSync(sitemapPath, "utf8").match(/<loc>/gi) || []).length : 0));
if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log("- " + warning);
}
if (errors.length) {
  console.error("\nAudit failed with " + errors.length + " issue(s):");
  for (const error of errors) console.error("- " + error);
  process.exitCode = 1;
} else {
  console.log("PASS: routes, local assets, canonical URLs, robots.txt, and sitemap.xml are consistent.");
}
