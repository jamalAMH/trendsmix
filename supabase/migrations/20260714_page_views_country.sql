-- Add country/city columns to page_views for geo analytics.

alter table public.page_views
  add column if not exists country text not null default 'Unknown',
  add column if not exists city text;

create index if not exists idx_page_views_country on public.page_views (country);
