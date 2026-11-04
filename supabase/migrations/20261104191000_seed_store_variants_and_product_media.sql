-- Seed realistic variant combinations and image references for Store UI testing.
-- All image URLs are replaceable with Supabase Storage object paths from the admin uploader.

with variant_seed(slug,sku,variant_name,variant_options,price_override,stock_quantity,sort_order,image_path) as (
  values
    ('asus-vivobook-15-x1504','X1504-I5-16-512-SIL','Cool Silver','{"Warna":"Cool Silver"}'::jsonb,null::numeric,2,0,'https://www.ammancart.com/cdn/shop/files/114_4849341d-975b-4822-84a7-3ad0e6d0732f.jpg?v=1758788829'),
    ('asus-vivobook-15-x1504','X1504-I5-16-512-BLU','Quiet Blue','{"Warna":"Quiet Blue"}'::jsonb,null::numeric,1,1,'https://catalog.cdn.bixoto.com/assets/es/B14RRZ2GPG/images/9428080642e5/c8a51efb-NBASUX1504VA-BQ3561W-1.jpg?class=s700'),
    ('logitech-g102-lightsync-mouse','G102-LS-BLK','Black','{"Warna":"Black"}'::jsonb,null::numeric,8,0,'https://brainy.co.ke/cdn/shop/files/logitech-g102-lightsync-rgb-6-button-usb-gaming-mouse-black-792075.jpg?v=1735293334'),
    ('logitech-g102-lightsync-mouse','G102-LS-WHT','White','{"Warna":"White"}'::jsonb,null::numeric,6,1,'https://cdn11.bigcommerce.com/s-ms4wz8cgi2/images/stencil/1280x1280/products/118231/30685/41fR156jYnL__76754.1729766874.jpg?c=1'),
    ('kingston-fury-beast-ddr4-16gb','KF432C16BB-16','Single Module 16 GB','{"Konfigurasi":"1 × 16 GB"}'::jsonb,null::numeric,7,0,'https://cdn.dooca.store/34971/products/icabir3jxfzcagooynwbwh3s2octawk2nlak.jpg?v=1660768570'),
    ('kingston-fury-beast-ddr4-16gb','KF432C16BBK2-16','Dual Channel Kit 16 GB','{"Konfigurasi":"2 × 8 GB"}'::jsonb,735000::numeric,5,1,'https://www.pbtech.co.nz/imgprod/M/E/MEMKHX31010__3.jpg')
)
insert into public.store_product_variants
  (product_id,sku,variant_name,variant_options,price_override,stock_quantity,status,sort_order,image_path)
select p.id,s.sku,s.variant_name,s.variant_options,s.price_override,s.stock_quantity,'published',s.sort_order,s.image_path
from variant_seed s
join public.store_products p on p.slug=s.slug
on conflict (sku) do update set
  variant_name=excluded.variant_name,
  variant_options=excluded.variant_options,
  price_override=excluded.price_override,
  stock_quantity=excluded.stock_quantity,
  status=excluded.status,
  sort_order=excluded.sort_order,
  image_path=excluded.image_path,
  updated_at=now();

update public.store_products p
set stock_quantity=totals.stock_quantity
from (
  select product_id,sum(stock_quantity)::integer as stock_quantity
  from public.store_product_variants
  group by product_id
) totals
where p.id=totals.product_id
  and p.slug in ('asus-vivobook-15-x1504','logitech-g102-lightsync-mouse','kingston-fury-beast-ddr4-16gb');

with product_media(slug,image_path) as (
  values
    ('aoc-24g2-24-inch-ips-144hz','https://images-cdn.ubuy.co.in/634e770bee6c3f32b6695ab4-aoc-24g2-24-frameless-gaming-ips.jpg'),
    ('asrock-b550m-wifi-se-motherboard','https://cdn11.bigcommerce.com/s-ms4wz8cgi2/images/stencil/1280x1280/products/118460/32201/B550M_WIFI_SE__53126.1742892440.jpg?c=1'),
    ('asus-vivobook-15-x1504','https://www.ammancart.com/cdn/shop/files/114_4849341d-975b-4822-84a7-3ad0e6d0732f.jpg?v=1758788829'),
    ('cooler-master-mwe-650w-psu','https://down-my.img.susercontent.com/file/b56d162f516b034bb43efc0edbe59ac5'),
    ('darkflash-dlx21-mesh-black','https://img2.quasarzone.com/editor/2020/07/23/68ed7ecb04af53c46b9dff0f3f1f8c73.jpg'),
    ('hyperx-cloud-stinger-gaming-headset','https://cdn.comfy.ua/media/catalog/product/h/x/hx-product-headset-stinger-black-hxhscsbk-1-zm-lg.jpg'),
    ('kingston-fury-beast-ddr4-16gb','https://cdn.dooca.store/34971/products/icabir3jxfzcagooynwbwh3s2octawk2nlak.jpg?v=1660768570'),
    ('logitech-g102-lightsync-mouse','https://brainy.co.ke/cdn/shop/files/logitech-g102-lightsync-rgb-6-button-usb-gaming-mouse-black-792075.jpg?v=1735293334'),
    ('logitech-g213-prodigy-keyboard','https://down-id.img.susercontent.com/file/6b52a2ca266d3f38464d37f0b49b591e'),
    ('samsung-990-evo-1tb-nvme','https://www.awd-it.co.uk/media/catalog/product/u/k/uk-990-evo-nvme-m2-ssd-mz-v9e1t0bw-539477639_1.png?bg-color=255%2C255%2C255&canvas=%3A&fit=bounds&format=jpeg&height=&optimize=high&width=')
)
update public.store_products p
set image_path=m.image_path
from product_media m
where p.slug=m.slug;

with extra_media(slug,image_path,alt_text,sort_order) as (
  values
    ('asus-vivobook-15-x1504','https://catalog.cdn.bixoto.com/assets/es/B14RRZ2GPG/images/9428080642e5/c8a51efb-NBASUX1504VA-BQ3561W-1.jpg?class=s700','ASUS Vivobook 15 X1504 Quiet Blue',1),
    ('asus-vivobook-15-x1504','https://dlcdnwebimgs.asus.com/gain/7b2d1dda-c9f7-4067-a8aa-a87c9c4a5b86/','ASUS Vivobook 15 X1504 flat lay',2),
    ('logitech-g102-lightsync-mouse','https://cdn11.bigcommerce.com/s-ms4wz8cgi2/images/stencil/1280x1280/products/118231/30685/41fR156jYnL__76754.1729766874.jpg?c=1','Logitech G102 LIGHTSYNC White',1),
    ('kingston-fury-beast-ddr4-16gb','https://www.pbtech.co.nz/imgprod/M/E/MEMKHX31010__3.jpg','Kingston FURY Beast DDR4 16GB dual channel kit',1)
)
insert into public.store_product_images(product_id,image_path,alt_text,sort_order,is_primary)
select p.id,m.image_path,m.alt_text,m.sort_order,false
from extra_media m
join public.store_products p on p.slug=m.slug
where not exists (
  select 1 from public.store_product_images old
  where old.product_id=p.id and old.image_path=m.image_path
);
