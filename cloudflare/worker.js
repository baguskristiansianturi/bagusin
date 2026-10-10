const MAX_BODY_BYTES = 24_000;
const ALLOWED_ORIGIN_SUFFIXES = [".workers.dev", ".pages.dev", ".github.io"];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function isAllowedOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (
      ALLOWED_ORIGIN_SUFFIXES.some((suffix) => host.endsWith(suffix)) ||
      host === "localhost" || host === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

function clean(value, max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validateInquiry(input) {
  const inquiry = {
    name: clean(input.name, 120),
    email: clean(input.email, 254).toLowerCase(),
    company: clean(input.company, 160),
    service: clean(input.service, 120),
    mode: clean(input.mode, 40),
    brief: clean(input.brief, 8000),
    source_page: clean(input.source_page, 500),
    honeypot: clean(input.honeypot, 200),
    terms_acknowledged: input.terms_acknowledged === true,
  };
  if (inquiry.honeypot) return { spam: true };
  if (!inquiry.name || !inquiry.brief || !inquiry.terms_acknowledged) {
    return { error: "Lengkapi nama, kebutuhan, dan persetujuan ketentuan." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return { error: "Alamat email tidak valid." };
  }
  if (inquiry.brief.length < 10) {
    return { error: "Jelaskan kebutuhan sedikit lebih lengkap." };
  }
  if (!["consultation", "project"].includes(inquiry.mode)) {
    inquiry.mode = "project";
  }
  return { inquiry };
}

async function handleInquiry(request, env) {
  if (!isAllowedOrigin(request)) return json({ ok: false, error: "Origin tidak diizinkan." }, 403);
  if (request.method !== "POST") {
    return json({ ok: false, error: "Gunakan metode POST." }, 405);
  }
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Format permintaan harus JSON." }, 415);
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return json({ ok: false, error: "Permintaan terlalu besar." }, 413);

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: "Data formulir tidak terbaca." }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return json({ ok: false, error: "Format data tidak valid." }, 400);
  }
  const checked = validateInquiry(input);
  if (checked.spam) return json({ ok: true, message: "Permintaan diterima." });
  if (checked.error) return json({ ok: false, error: checked.error }, 400);
  if (!env.DB) return json({ ok: false, error: "Database belum dikonfigurasi." }, 503);

  const i = checked.inquiry;
  const id = crypto.randomUUID();
  try {
    await env.DB.prepare(
      `INSERT INTO inquiries
       (id, name, email, company, service, mode, brief, source_page, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`
    ).bind(id, i.name, i.email, i.company, i.service, i.mode, i.brief, i.source_page, new Date().toISOString()).run();
  } catch {
    return json({ ok: false, error: "Permintaan belum tersimpan. Silakan coba kembali." }, 503);
  }

  // Email delivery is intentionally a separate step. Do not report email sent
  // until a verified delivery provider is configured and confirms acceptance.
  return json({
    ok: true,
    id,
    message: "Permintaan berhasil disimpan. Pengiriman email belum dikonfigurasi.",
    email_sent: false,
  }, 201);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      if (request.method !== "GET") return json({ ok: false, error: "Gunakan metode GET." }, 405);
      return json({ ok: true, service: "bagusin-api", database_configured: Boolean(env.DB) });
    }
    if (url.pathname === "/api/inquiries") return handleInquiry(request, env);
    if (url.pathname.startsWith("/api/")) return json({ ok: false, error: "Endpoint tidak ditemukan." }, 404);
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Bagusin Worker assets binding is not configured.", { status: 503 });
  },
};
