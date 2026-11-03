-- Bagusin CMS policy and index refinement.
create index if not exists article_tag_assignments_tag_idx on public.article_tag_assignments(tag_id);
create index if not exists services_category_idx on public.services(category_id);
create index if not exists courses_category_idx on public.courses(category_id);
create index if not exists inquiries_service_idx on public.inquiries(service_id);
create index if not exists inquiries_course_idx on public.inquiries(course_id);
create index if not exists inquiries_assigned_to_idx on public.inquiries(assigned_to);
create index if not exists site_settings_updated_by_idx on public.site_settings(updated_by);

drop policy if exists article_categories_admin_write on public.article_categories;
create policy article_categories_admin_insert on public.article_categories for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_categories_admin_update on public.article_categories for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_categories_admin_delete on public.article_categories for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists article_tags_admin_write on public.article_tags;
create policy article_tags_admin_insert on public.article_tags for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_tags_admin_update on public.article_tags for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_tags_admin_delete on public.article_tags for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists article_tag_assignments_admin_write on public.article_tag_assignments;
create policy article_tag_assignments_admin_insert on public.article_tag_assignments for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy article_tag_assignments_admin_delete on public.article_tag_assignments for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists service_categories_admin_write on public.service_categories;
create policy service_categories_admin_insert on public.service_categories for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy service_categories_admin_update on public.service_categories for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy service_categories_admin_delete on public.service_categories for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists services_admin_write on public.services;
create policy services_admin_insert on public.services for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy services_admin_update on public.services for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy services_admin_delete on public.services for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists portfolio_admin_write on public.portfolio_projects;
create policy portfolio_admin_insert on public.portfolio_projects for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy portfolio_admin_update on public.portfolio_projects for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy portfolio_admin_delete on public.portfolio_projects for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists course_categories_admin_write on public.course_categories;
create policy course_categories_admin_insert on public.course_categories for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_categories_admin_update on public.course_categories for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_categories_admin_delete on public.course_categories for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists courses_admin_write on public.courses;
create policy courses_admin_insert on public.courses for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy courses_admin_update on public.courses for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy courses_admin_delete on public.courses for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists course_curriculum_admin_write on public.course_curriculum;
create policy course_curriculum_admin_insert on public.course_curriculum for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_curriculum_admin_update on public.course_curriculum for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy course_curriculum_admin_delete on public.course_curriculum for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists media_assets_admin_write on public.media_assets;
create policy media_assets_admin_insert on public.media_assets for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy media_assets_admin_update on public.media_assets for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy media_assets_admin_delete on public.media_assets for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));

drop policy if exists design_categories_read_active on public.design_categories;
create policy design_categories_public_read on public.design_categories for select to anon, authenticated
using (is_active or exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy design_categories_admin_insert on public.design_categories for insert to authenticated with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy design_categories_admin_update on public.design_categories for update to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
create policy design_categories_admin_delete on public.design_categories for delete to authenticated using (exists (select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
grant select, insert, update, delete on public.design_categories to authenticated;
