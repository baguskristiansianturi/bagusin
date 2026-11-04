import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const allowedOrigin = "https://baguskristiansianturi.github.io";
const allowedHosts = new Set([
  "images-cdn.ubuy.co.in", "cdn11.bigcommerce.com", "www.ammancart.com",
  "catalog.cdn.bixoto.com", "down-my.img.susercontent.com", "img2.quasarzone.com",
  "cdn.comfy.ua", "cdn.dooca.store", "brainy.co.ke", "down-id.img.susercontent.com",
  "www.awd-it.co.uk", "www.pbtech.co.nz"
]);
const cors = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
  "X-Content-Type-Options": "nosniff"
};
function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
function safePart(value: string) {
  return String(value || "asset").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "asset";
}
function isRemoteImage(value: string) {
  return /^https?:\/\//i.test(String(value || ""));
}
function extensionFor(mime: string) {
  const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
  return types[mime] || null;
}
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && origin !== allowedOrigin) return reply({ error: "Origin tidak diizinkan." }, 403);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Metode tidak diizinkan." }, 405);
  try {
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) return reply({ error: "Sesi admin diperlukan." }, 401);
    const secrets = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    const serviceKey = secrets.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const url = Deno.env.get("SUPABASE_URL") || "";
    if (!serviceKey || !url) throw new Error("Konfigurasi Storage belum lengkap.");
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) return reply({ error: "Sesi admin tidak valid. Silakan masuk kembali." }, 401);
    const { data: profile, error: profileError } = await admin.from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
    if (profileError || profile?.role !== "admin") return reply({ error: "Akses khusus admin diperlukan." }, 403);

    const { data: products, error: productError } = await admin.from("store_products").select("id,slug,image_path").eq("status", "published");
    if (productError) throw productError;
    const productIds = (products || []).map((p: any) => p.id);
    if (!productIds.length) return reply({ success: true, uploaded_files: 0, updated_references: 0, failed_assets: [] });
    const [galleryResult, variantResult] = await Promise.all([
      admin.from("store_product_images").select("id,product_id,image_path,sort_order").in("product_id", productIds),
      admin.from("store_product_variants").select("id,product_id,sku,image_path").in("product_id", productIds)
    ]);
    if (galleryResult.error) throw galleryResult.error;
    if (variantResult.error) throw variantResult.error;
    const productById = new Map((products || []).map((p: any) => [p.id, p]));
    const assets: any[] = [];
    for (const p of products || []) if (isRemoteImage(p.image_path)) assets.push({ kind: "product", id: p.id, slug: p.slug, url: p.image_path });
    for (const img of galleryResult.data || []) {
      if (isRemoteImage(img.image_path)) {
        const p = productById.get(img.product_id);
        if (p) assets.push({ kind: "gallery", id: img.id, slug: p.slug, sort_order: img.sort_order, url: img.image_path });
      }
    }
    for (const variant of variantResult.data || []) {
      if (isRemoteImage(variant.image_path)) {
        const p = productById.get(variant.product_id);
        if (p) assets.push({ kind: "variant", id: variant.id, slug: p.slug, sku: variant.sku, url: variant.image_path });
      }
    }
    const storedByUrl = new Map<string, string>();
    const failedAssets: any[] = [];
    let uploadedFiles = 0;
    let updatedReferences = 0;
    for (const asset of assets) {
      try {
        let storagePath = storedByUrl.get(asset.url);
        if (!storagePath) {
          const source = new URL(asset.url);
          if (!["https:", "http:"].includes(source.protocol) || !allowedHosts.has(source.hostname)) throw new Error("Host sumber gambar tidak masuk daftar yang diizinkan.");
          const response = await fetch(asset.url, { redirect: "follow", headers: { "Accept": "image/avif,image/webp,image/png,image/jpeg" } });
          if (!response.ok) throw new Error("Sumber gambar merespons HTTP " + response.status + ".");
          const finalUrl = new URL(response.url);
          if (!allowedHosts.has(finalUrl.hostname)) throw new Error("Redirect gambar menuju host yang tidak diizinkan.");
          const mime = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
          const ext = extensionFor(mime);
          if (!ext) throw new Error("Format gambar tidak didukung: " + (mime || "tidak diketahui") + ".");
          if (Number(response.headers.get("content-length") || 0) > 8 * 1024 * 1024) throw new Error("Ukuran gambar melebihi batas 8 MB.");
          const bytes = new Uint8Array(await response.arrayBuffer());
          if (!bytes.length || bytes.length > 8 * 1024 * 1024) throw new Error("Ukuran gambar kosong atau melebihi 8 MB.");
          const slug = safePart(asset.slug);
          const filename = asset.kind === "product" ? "main." + ext
            : asset.kind === "gallery" ? "gallery-" + (Number(asset.sort_order) + 1) + "." + ext
            : safePart(asset.sku || asset.id) + "." + ext;
          storagePath = asset.kind === "variant"
            ? "products/" + slug + "/variants/" + filename
            : "products/" + slug + "/" + filename;
          const { error: uploadError } = await admin.storage.from("bagusin-public").upload(storagePath, bytes, { upsert: true, contentType: mime, cacheControl: "31536000" });
          if (uploadError) throw uploadError;
          storedByUrl.set(asset.url, storagePath);
          uploadedFiles++;
        }
        let updateResult;
        if (asset.kind === "product") updateResult = await admin.from("store_products").update({ image_path: storagePath }).eq("id", asset.id);
        else if (asset.kind === "gallery") updateResult = await admin.from("store_product_images").update({ image_path: storagePath }).eq("id", asset.id);
        else updateResult = await admin.from("store_product_variants").update({ image_path: storagePath }).eq("id", asset.id);
        if (updateResult.error) throw updateResult.error;
        updatedReferences++;
      } catch (error) {
        failedAssets.push({ kind: asset.kind, slug: asset.slug, source: asset.url, error: error instanceof Error ? error.message : "Gagal mengimpor gambar." });
      }
    }
    return reply({ success: failedAssets.length === 0, uploaded_files: uploadedFiles, updated_references: updatedReferences, failed_assets: failedAssets });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Impor foto belum dapat diproses." }, 500);
  }
});