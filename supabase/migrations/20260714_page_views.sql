-- Run this in Supabase SQL Editor if page_views table does not exist yet.

create table if not exists public.page_views (
  id uuid default gen_random_uuid() primary key,
  path text not null,
  referrer text default '',
  source text not null default 'Direct',
  session_id text,
  user_agent text default '',
  created_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

drop policy if exists "Anyone can log page views" on public.page_views;
create policy "Anyone can log page views"
  on public.page_views for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read page views" on public.page_views;
create policy "Admins can read page views"
  on public.page_views for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index if not exists idx_page_views_created_at on public.page_views (created_at desc);
create index if not exists idx_page_views_source on public.page_views (source);
create index if not exists idx_page_views_path on public.page_views (path);

grant insert on public.page_views to anon;
grant select, insert on public.page_views to authenticated;
