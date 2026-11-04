create or replace function public.create_store_order(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_order_id uuid;
  v_order_number text;
  v_name text := btrim(coalesce(p_payload->>'full_name',''));
  v_email text := lower(btrim(coalesce(p_payload->>'email','')));
  v_phone text := btrim(coalesce(p_payload->>'phone',''));
  v_method text := coalesce(p_payload->>'delivery_method','delivery');
  v_items jsonb := coalesce(p_payload->'items','[]'::jsonb);
  v_item jsonb;
  v_product public.store_products%rowtype;
  v_variant public.store_product_variants%rowtype;
  v_variant_id uuid;
  v_qty integer;
  v_subtotal numeric(14,2) := 0;
  v_type text := 'physical';
  v_shipping_method text;
  v_address jsonb := '{}'::jsonb;
  v_count integer := 0;
  v_line numeric(14,2);
  v_unit_price numeric(14,2);
  v_item_name text;
  v_item_sku text;
  v_item_snapshot jsonb;
begin
  if length(v_name) < 2 or length(v_name) > 120 then raise exception 'Nama lengkap tidak valid'; end if;
  if v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then raise exception 'Alamat email tidak valid'; end if;
  if length(v_phone) < 8 or length(v_phone) > 30 then raise exception 'Nomor WhatsApp tidak valid'; end if;
  if jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) < 1 or jsonb_array_length(v_items) > 30 then raise exception 'Keranjang tidak valid'; end if;
  if v_method not in ('delivery','pickup','digital') then raise exception 'Metode penerimaan tidak valid'; end if;

  if v_method = 'delivery' then
    if length(btrim(coalesce(p_payload->>'address',''))) < 5 or length(btrim(coalesce(p_payload->>'city',''))) < 2 then
      raise exception 'Alamat pengiriman belum lengkap';
    end if;
    v_shipping_method := 'courier_manual';
    v_address := jsonb_build_object('address',btrim(p_payload->>'address'),'city',btrim(p_payload->>'city'));
  elsif v_method = 'pickup' then
    v_shipping_method := 'self_pickup';
  end if;

  for v_item in select value from jsonb_array_elements(v_items) loop
    v_count := v_count + 1;
    if coalesce(v_item->>'product_id','') = '' then raise exception 'Produk tidak valid'; end if;
    v_qty := (v_item->>'quantity')::integer;
    if v_qty < 1 or v_qty > 99 then raise exception 'Jumlah produk tidak valid'; end if;
    v_variant_id := nullif(btrim(coalesce(v_item->>'variant_id','')),'')::uuid;

    select * into v_product from public.store_products
      where id = (v_item->>'product_id')::uuid and status = 'published'
      for share;
    if not found then raise exception 'Salah satu produk tidak tersedia'; end if;
    if v_product.availability = 'out_of_stock' then raise exception 'Stok % tidak tersedia', v_product.name; end if;

    if v_variant_id is not null then
      select * into v_variant from public.store_product_variants
        where id = v_variant_id and product_id = v_product.id and status = 'published'
        for share;
      if not found then raise exception 'Variasi produk % tidak tersedia', v_product.name; end if;
      if v_product.manage_stock and v_product.availability <> 'preorder' and v_variant.stock_quantity < v_qty then
        raise exception 'Stok variasi % tidak mencukupi', v_variant.variant_name;
      end if;
      v_unit_price := coalesce(v_variant.price_override,v_product.price_amount);
    else
      if v_product.manage_stock and v_product.availability <> 'preorder' and v_product.stock_quantity < v_qty then
        raise exception 'Stok % tidak mencukupi', v_product.name;
      end if;
      v_unit_price := v_product.price_amount;
    end if;

    if v_product.product_type = 'digital' then
      if v_type = 'physical' and v_subtotal > 0 then v_type := 'mixed'; elsif v_count = 1 then v_type := 'digital'; end if;
    elsif v_type = 'digital' then v_type := 'mixed'; end if;
    v_line := v_unit_price * v_qty;
    v_subtotal := v_subtotal + v_line;
  end loop;

  if v_type = 'digital' then
    v_shipping_method := null;
    v_address := '{}'::jsonb;
  elsif v_type = 'mixed' and v_method = 'digital' then
    raise exception 'Pilih pengiriman untuk produk fisik';
  elsif v_type = 'physical' and v_method = 'digital' then
    raise exception 'Produk fisik memerlukan metode penerimaan';
  end if;

  insert into public.orders (
    customer_name, customer_email, customer_phone, order_type, order_status,
    payment_status, fulfillment_status, currency, subtotal_amount, shipping_amount,
    discount_amount, total_amount, shipping_method, shipping_address, customer_note
  ) values (
    v_name, v_email, v_phone, v_type, 'pending_review',
    'unpaid', 'not_started', 'IDR', v_subtotal, 0, 0, v_subtotal,
    v_shipping_method, v_address, nullif(btrim(coalesce(p_payload->>'customer_note','')),'')
  ) returning id, order_number into v_order_id, v_order_number;

  for v_item in select value from jsonb_array_elements(v_items) loop
    v_qty := (v_item->>'quantity')::integer;
    v_variant_id := nullif(btrim(coalesce(v_item->>'variant_id','')),'')::uuid;
    select * into v_product from public.store_products
      where id = (v_item->>'product_id')::uuid and status = 'published';
    v_unit_price := v_product.price_amount;
    v_item_name := v_product.name;
    v_item_sku := v_product.sku;
    v_item_snapshot := jsonb_build_object(
      'brand',v_product.brand,
      'category',v_product.category,
      'image_path',v_product.image_path,
      'compare_at_price',v_product.compare_at_price
    );

    if v_variant_id is not null then
      select * into v_variant from public.store_product_variants
        where id = v_variant_id and product_id = v_product.id and status = 'published';
      if not found then raise exception 'Variasi produk % tidak tersedia', v_product.name; end if;
      v_unit_price := coalesce(v_variant.price_override,v_product.price_amount);
      v_item_name := v_product.name || ' — ' || v_variant.variant_name;
      v_item_sku := coalesce(v_variant.sku,v_product.sku);
      v_item_snapshot := v_item_snapshot || jsonb_build_object(
        'variant_id',v_variant.id,
        'variant_name',v_variant.variant_name,
        'variant_options',v_variant.variant_options,
        'variant_sku',v_variant.sku
      );
    end if;

    v_line := v_unit_price * v_qty;
    insert into public.order_items (
      order_id, item_type, item_reference_id, item_slug, item_code, item_name,
      item_description, quantity, unit_price, line_total, item_snapshot
    ) values (
      v_order_id, case when v_product.product_type = 'digital' then 'digital' else 'store_product' end,
      v_product.id, v_product.slug, v_item_sku, v_item_name,
      v_product.short_description, v_qty, v_unit_price, v_line, v_item_snapshot
    );
  end loop;

  insert into public.invoices(order_id, invoice_status, currency, subtotal_amount, shipping_amount, discount_amount, total_amount, invoice_note)
  values (v_order_id, 'draft', 'IDR', v_subtotal, 0, 0, v_subtotal, 'Invoice diterbitkan setelah pesanan ditinjau Bagusin.');

  return jsonb_build_object('order_id',v_order_id,'order_number',v_order_number,'total_amount',v_subtotal,'order_status','pending_review');
end;
$function$;