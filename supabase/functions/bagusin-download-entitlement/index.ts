import { withSupabase } from "npm:@supabase/server";

const allowedOrigin = "https://baguskristiansianturi.github.io";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const handler = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: { entitlement_id?: string };
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!payload.entitlement_id || !/^[0-9a-f-]{36}$/i.test(payload.entitlement_id)) {
    return new Response(JSON.stringify({ error: "A valid entitlement ID is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data, error } = await ctx.supabase.rpc("consume_bagusin_digital_entitlement", {
    p_entitlement_id: payload.entitlement_id,
  });

  if (error || !data || data.length !== 1) {
    return new Response(JSON.stringify({ error: "This download is not available. Check your order status or download limit." }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const entitlement = data[0];
  const { data: signed, error: storageError } = await ctx.supabaseAdmin.storage
    .from(entitlement.storage_bucket)
    .createSignedUrl(entitlement.storage_path, 300, { download: true });

  if (storageError || !signed?.signedUrl) {
    return new Response(JSON.stringify({ error: "Could not prepare the secure download. Please contact Bagusin." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    download_url: signed.signedUrl,
    item_name: entitlement.item_name,
    downloads_used: entitlement.download_count,
    download_limit: entitlement.download_limit,
    expires_in_seconds: 300,
  }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const origin = req.headers.get("Origin");
  if (origin && origin !== allowedOrigin) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return await handler(req);
});
