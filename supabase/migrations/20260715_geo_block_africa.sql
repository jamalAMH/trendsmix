-- Geo-blocking: block African visitors except whitelisted IPs.
insert into public.settings (key, value)
values
  ('geo_block_africa', 'true'),
  ('geo_allowed_ips', '')
on conflict (key) do nothing;
