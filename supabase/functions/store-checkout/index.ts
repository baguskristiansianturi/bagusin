import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const allowedOrigin = "https://baguskristiansianturi.github.io";
const cors = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
  "X-Content-Type-Options": "nosniff",
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && origin !== allowedOrigin) {
    return new Response(JSON.stringify({ error: "Origin tidak diizinkan." }), { status: 403, headers: { ...cors, "Content-Type": "application/json" } });
  }
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Metode tidak diizinkan." }), { status: 405, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const publishables = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}");
    const publishable = publishables.default || Deno.env.get("SUPABASE_ANON_KEY") || "";
    if (!publishable || req.headers.get("apikey") !== publishable) {
      return new Response(JSON.stringify({ error: "Kredensial permintaan tidak valid." }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const secrets = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    const secret = secrets.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const url = Deno.env.get("SUPABASE_URL") || "";
    if (!secret || !url) throw new Error("Konfigurasi layanan pesanan belum lengkap.");

    const body = await req.json();
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length < 1 || rawItems.length > 30) {
      return new Response(JSON.stringify({ error: "Keranjang tidak valid." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const items = [];
    for (const item of rawItems) {
      const productId = String(item.product_id || "");
      const quantity = Math.floor(Number(item.quantity) || 0);
      const variantId = String(item.variant_id || "").trim();
      if (!/^[0-9a-f-]{36}$/i.test(productId) || quantity < 1 || quantity > 99 ||
          (variantId && !/^[0-9a-f-]{36}$/i.test(variantId))) {
        return new Response(JSON.stringify({ error: "Pilihan produk, variasi, atau jumlah tidak valid." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
      }
      items.push({ product_id: productId, quantity, variant_id: variantId || null });
    }

    const payload = {
      full_name: String(body.full_name || "").trim().slice(0, 120),
      email: String(body.email || "").trim().slice(0, 254),
      phone: String(body.phone || "").trim().slice(0, 30),
      delivery_method: String(body.delivery_method || "delivery"),
      address: String(body.address || "").trim().slice(0, 1000),
      city: String(body.city || "").trim().slice(0, 100),
      customer_note: String(body.customer_note || "").trim().slice(0, 1000),
      items,
    };
    if (payload.full_name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
        payload.phone.length < 8 || payload.items.length < 1) {
      return new Response(JSON.stringify({ error: "Periksa kembali data pemesan dan produk." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await admin.rpc("create_store_order", { p_payload: payload });
    if (error) {
      const safeMessage = /stok|tidak tersedia|tidak valid|belum lengkap|memerlukan|pilih pengiriman|variasi/i.test(error.message)
        ? error.message : "Pesanan belum dapat diproses. Silakan coba kembali.";
      return new Response(JSON.stringify({ error: safeMessage }), { status: 422, headers: { ...cors, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: true, order: data }), { status: 201, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch (_error) {
    return new Response(JSON.stringify({ error: "Terjadi kendala saat memproses pesanan." }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});