-- Add the uploader FK index and restrict public media uploads to raster image formats.
create index if not exists design_item_private_files_uploaded_by_idx
  on public.design_item_private_files(uploaded_by);
update storage.buckets
set allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif']
where id = 'bagusin-public';
