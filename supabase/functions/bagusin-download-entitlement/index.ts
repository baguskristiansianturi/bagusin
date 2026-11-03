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
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  let payload: { entitlement_id?: string };
  try { payload = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!payload.entitlement_id || !/^[0-9a-f-]{36}$/i.test(payload.entitlement_id)) {
    return new Response(JSON.stringify({ error: "A valid entitlement ID is required" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userId = ctx.userClaims?.sub ?? ctx.userClaims?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Sign in is required" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: entitlement, error: entitlementError } = await ctx.supabase
    .from("digital_entitlements")
    .select("id,order_item_id,customer_id,item_name,storage_bucket,storage_path,entitlement_status,download_limit,download_count,expires_at")
    .eq("id", payload.entitlement_id)
    .eq("customer_id", userId)
    .maybeSingle();

  if (entitlementError || !entitlement || entitlement.entitlement_status !== "active") {
    return new Response(JSON.stringify({ error: "This download is not available." }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (entitlement.expires_at && new Date(entitlement.expires_at).getTime() <= Date.now()) {
    return new Response(JSON.stringify({ error: "This download entitlement has expired." }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (entitlement.download_limit !== null && entitlement.download_count >= entitlement.download_limit) {
    return new Response(JSON.stringify({ error: "The download limit has been reached." }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: item, error: itemError } = await ctx.supabase
    .from("order_items").select("order_id").eq("id", entitlement.order_item_id).maybeSingle();
  if (itemError || !item) {
    return new Response(JSON.stringify({ error: "The purchase record could not be found." }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: order, error: orderError } = await ctx.supabase
    .from("orders").select("customer_id,payment_status,order_status").eq("id", item.order_id).maybeSingle();
  if (orderError || !order || order.customer_id !== userId || order.payment_status !== "paid" || order.order_status !== "completed") {
    return new Response(JSON.stringify({ error: "The order must be paid and completed before downloading." }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: signed, error: storageError } = await ctx.supabaseAdmin.storage
    .from(entitlement.storage_bucket)
    .createSignedUrl(entitlement.storage_path, 300, { download: true });

  if (storageError || !signed?.signedUrl) {
    return new Response(JSON.stringify({ error: "Could not prepare the secure download. Please contact Bagusin." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Compare-and-swap prevents concurrent requests from exceeding the configured download count.
  const nextCount = Number(entitlement.download_count || 0) + 1;
  const { data: counted, error: countError } = await ctx.supabaseAdmin
    .from("digital_entitlements")
    .update({ download_count: nextCount, updated_at: new Date().toISOString() })
    .eq("id", entitlement.id)
    .eq("customer_id", userId)
    .eq("download_count", Number(entitlement.download_count || 0))
    .select("id")
    .maybeSingle();

  if (countError || !counted) {
    return new Response(JSON.stringify({ error: "Please retry the download. The download counter changed." }), {
      status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    download_url: signed.signedUrl,
    item_name: entitlement.item_name,
    downloads_used: nextCount,
    download_limit: entitlement.download_limit,
    expires_in_seconds: 300,
  }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const origin = req.headers.get("Origin");
  if (origin && origin !== allowedOrigin) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return await handler(req);
});
