-- Download access is enforced by the authenticated Edge Function using the customer's JWT and a server-side compare-and-swap counter.
-- Remove the exposed SECURITY DEFINER RPC; service-role access stays inside the Edge Function.
drop function if exists public.consume_bagusin_digital_entitlement(uuid);
