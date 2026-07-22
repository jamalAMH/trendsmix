-- =============================================================================
-- TrendsMix — Supabase Database Schema
-- =============================================================================
-- Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).
-- After running the schema, create a Storage bucket named "media" with public
-- access (Dashboard → Storage → New Bucket → Name: media, Public: ON).
-- =============================================================================

-- 1. Profiles (extends Supabase Auth users) ------------------------------------

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role text not null default 'editor' check (role in ('admin', 'editor')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile (except role)"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

create policy "Admins can manage all profiles"
  on public.profiles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'editor'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. Categories ----------------------------------------------------------------

create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed default categories
insert into public.categories (name, slug) values
  ('Horror', 'horror'),
  ('Mystery', 'mystery'),
  ('Romance', 'romance'),
  ('Fantasy', 'fantasy'),
  ('Sci-Fi', 'sci-fi'),
  ('Drama', 'drama');


-- 3. Posts ---------------------------------------------------------------------

create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text default '',
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  read_time integer not null default 5,
  featured_image text,
  featured_image_alt text default '',
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.posts for select
  using (status = 'published' or auth.role() = 'authenticated');

create policy "Admins can manage posts"
  on public.posts for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_posts_slug on public.posts (slug);
create index idx_posts_status on public.posts (status);
create index idx_posts_category on public.posts (category_id);
create index idx_posts_published_at on public.posts (published_at desc);


-- 4. Pages --------------------------------------------------------------------

create table public.pages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text default '',
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages enable row level security;

create policy "Pages are viewable by everyone"
  on public.pages for select using (true);

create policy "Admins can manage pages"
  on public.pages for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed default pages
insert into public.pages (title, slug) values
  ('About', 'about'),
  ('Contact', 'contact'),
  ('Privacy Policy', 'privacy'),
  ('Terms of Service', 'terms'),
  ('Cookie Policy', 'cookies'),
  ('DMCA Policy', 'dmca'),
  ('AI Content Policy', 'ai-policy'),
  ('Editorial Policy', 'editorial-policy'),
  ('Disclaimer', 'disclaimer');


-- 5. Settings -----------------------------------------------------------------

create table public.settings (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  value text default '',
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "Settings are viewable by everyone"
  on public.settings for select using (true);

create policy "Admins can manage settings"
  on public.settings for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed default settings
insert into public.settings (key, value) values
  ('site_name', 'TrendsMix'),
  ('site_description', 'Original short fiction across drama, mystery, romance, and more. Fresh stories published daily on TrendsMix — free to read.'),
  ('contact_email', 'contact@trendsmix.online'),
  ('logo_url', ''),
  ('favicon_url', ''),
  ('twitter_url', ''),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('adsense_client_id', ''),
  ('adsense_slot_id', ''),
  ('analytics_id', ''),
  ('google_site_verification', ''),
  ('maintenance_mode', 'false'),
  ('geo_block_africa', 'true'),
  ('geo_allowed_ips', ''),
  ('n8n_enabled', 'true'),
  ('n8n_api_key', '');


-- 6. Media --------------------------------------------------------------------

create table public.media (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  size integer default 0,
  type text default '',
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

create policy "Media is viewable by authenticated users"
  on public.media for select
  to authenticated
  using (true);

create policy "Admins can manage media"
  on public.media for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- 7. Page Views (analytics) ----------------------------------------------------

create table public.page_views (
  id uuid default gen_random_uuid() primary key,
  path text not null,
  referrer text default '',
  source text not null default 'Direct',
  country text not null default 'Unknown',
  city text,
  session_id text,
  user_agent text default '',
  created_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

create policy "Anyone can log page views"
  on public.page_views for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read page views"
  on public.page_views for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_page_views_created_at on public.page_views (created_at desc);
create index idx_page_views_source on public.page_views (source);
create index idx_page_views_country on public.page_views (country);
create index idx_page_views_path on public.page_views (path);


-- 8. Active Sessions (live visitors) ------------------------------------------

create table public.active_sessions (
  session_id text primary key,
  path text not null,
  referrer text default '',
  source text not null default 'Direct',
  country text not null default 'Unknown',
  last_seen timestamptz not null default now()
);

alter table public.active_sessions enable row level security;

create policy "Anyone can upsert active sessions"
  on public.active_sessions for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can update active sessions"
  on public.active_sessions for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Anyone can delete stale sessions"
  on public.active_sessions for delete
  to anon, authenticated
  using (true);

create policy "Admins can read active sessions"
  on public.active_sessions for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_active_sessions_last_seen on public.active_sessions (last_seen desc);


-- 9. Utility: updated_at trigger ----------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create trigger set_pages_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

create trigger set_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();


-- =============================================================================
-- TABLE-LEVEL PRIVILEGES
-- =============================================================================
-- The anon role needs SELECT to read published content on the public site.
-- The authenticated role needs full access for the admin dashboard.

grant select on public.posts to anon;
grant select on public.categories to anon;
grant select on public.profiles to anon;
grant select on public.pages to anon;
grant select on public.settings to anon;

grant insert on public.page_views to anon;
grant select, insert on public.page_views to authenticated;

grant insert, update, delete on public.active_sessions to anon;
grant select, insert, update, delete on public.active_sessions to authenticated;

grant all on public.posts to authenticated;
grant all on public.categories to authenticated;
grant all on public.profiles to authenticated;
grant all on public.pages to authenticated;
grant all on public.settings to authenticated;
grant all on public.media to authenticated;

-- =============================================================================
-- POST-SETUP CHECKLIST
-- =============================================================================
-- 1. Create a Storage bucket named "media" with public access.
-- 2. Create your first admin user via Supabase Auth (Dashboard → Authentication).
-- 3. Update that user's profile role to 'admin':
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
-- =============================================================================
