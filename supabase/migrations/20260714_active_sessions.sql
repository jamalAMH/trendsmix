create table if not exists public.active_sessions (
  session_id text primary key,
  path text not null,
  referrer text default '',
  source text not null default 'Direct',
  country text not null default 'Unknown',
  last_seen timestamptz not null default now()
);

alter table public.active_sessions enable row level security;

drop policy if exists "Anyone can upsert active sessions" on public.active_sessions;
create policy "Anyone can upsert active sessions"
  on public.active_sessions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can update active sessions" on public.active_sessions;
create policy "Anyone can update active sessions"
  on public.active_sessions for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Anyone can delete stale sessions" on public.active_sessions;
create policy "Anyone can delete stale sessions"
  on public.active_sessions for delete
  to anon, authenticated
  using (true);

drop policy if exists "Admins can read active sessions" on public.active_sessions;
create policy "Admins can read active sessions"
  on public.active_sessions for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index if not exists idx_active_sessions_last_seen on public.active_sessions (last_seen desc);

grant insert, update, delete on public.active_sessions to anon;
grant select, insert, update, delete on public.active_sessions to authenticated;
