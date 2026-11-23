-- Fase 1: esquema base, RLS y buckets de Storage.
-- Lectura pública solo de contenido publicado; escritura solo para admins.

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "admins: un admin ve la lista"
  on public.admins for select
  to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Temporadas y torneos
-- ---------------------------------------------------------------------------
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date not null,
  ends_on date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  constraint seasons_dates check (ends_on >= starts_on)
);

-- Solo una temporada activa a la vez.
create unique index seasons_one_active on public.seasons (is_active) where is_active;

create type public.tournament_status as enum ('proximo', 'finalizado');

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  season_id uuid references public.seasons (id) on delete set null,
  slug text not null unique,
  title text not null,
  starts_at timestamptz not null,
  venue text,
  address text,
  map_url text,
  startgg_url text,
  startgg_tournament_slug text,
  currency char(3) not null,
  status public.tournament_status not null default 'proximo',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tournaments_season_idx on public.tournaments (season_id, starts_at);

create table public.tournament_prices (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  label text not null,
  amount numeric(10, 2) not null check (amount >= 0),
  sort_order integer not null default 0
);

create index tournament_prices_tournament_idx on public.tournament_prices (tournament_id, sort_order);

create type public.event_type as enum ('singles', 'doubles', 'rising');

create table public.tournament_events (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  type public.event_type not null,
  startgg_event_slug text,
  unique (tournament_id, type)
);

-- ---------------------------------------------------------------------------
-- Gráficos de resultados, galería y cuentas
-- ---------------------------------------------------------------------------
create table public.result_graphics (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  event_type public.event_type,
  image_path text not null,
  alt_text text not null check (length(trim(alt_text)) > 0),
  sort_order integer not null default 0
);

create index result_graphics_tournament_idx on public.result_graphics (tournament_id, sort_order);

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  image_path text not null,
  alt_text text not null check (length(trim(alt_text)) > 0),
  sort_order integer not null default 0
);

create index gallery_photos_tournament_idx on public.gallery_photos (tournament_id, sort_order);

create type public.account_kind as enum ('ingreso_inscripcion', 'gasto', 'premio');

create table public.account_entries (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  kind public.account_kind not null,
  concept text not null,
  amount numeric(10, 2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create index account_entries_tournament_idx on public.account_entries (tournament_id);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tournaments_updated_at
  before update on public.tournaments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.seasons enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_prices enable row level security;
alter table public.tournament_events enable row level security;
alter table public.result_graphics enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.account_entries enable row level security;

create or replace function public.is_tournament_published(t_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.tournaments where id = t_id and published
  );
$$;

revoke all on function public.is_tournament_published(uuid) from public;
grant execute on function public.is_tournament_published(uuid) to anon, authenticated;

-- Lectura pública
create policy "seasons: lectura pública"
  on public.seasons for select
  to anon, authenticated
  using (true);

create policy "tournaments: lectura pública de publicados"
  on public.tournaments for select
  to anon, authenticated
  using (published or (select public.is_admin()));

create policy "tournament_prices: lectura pública de publicados"
  on public.tournament_prices for select
  to anon, authenticated
  using (public.is_tournament_published(tournament_id) or (select public.is_admin()));

create policy "tournament_events: lectura pública de publicados"
  on public.tournament_events for select
  to anon, authenticated
  using (public.is_tournament_published(tournament_id) or (select public.is_admin()));

create policy "result_graphics: lectura pública de publicados"
  on public.result_graphics for select
  to anon, authenticated
  using (public.is_tournament_published(tournament_id) or (select public.is_admin()));

create policy "gallery_photos: lectura pública de publicados"
  on public.gallery_photos for select
  to anon, authenticated
  using (public.is_tournament_published(tournament_id) or (select public.is_admin()));

create policy "account_entries: lectura pública de publicados"
  on public.account_entries for select
  to anon, authenticated
  using (public.is_tournament_published(tournament_id) or (select public.is_admin()));

-- Escritura solo de admins
create policy "seasons: escritura admins" on public.seasons
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "tournaments: escritura admins" on public.tournaments
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "tournament_prices: escritura admins" on public.tournament_prices
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "tournament_events: escritura admins" on public.tournament_events
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "result_graphics: escritura admins" on public.result_graphics
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "gallery_photos: escritura admins" on public.gallery_photos
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "account_entries: escritura admins" on public.account_entries
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage: lectura pública, escritura solo de admins
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('results', 'results', true, 2097152, array['image/webp', 'image/png', 'image/jpeg']),
  ('gallery', 'gallery', true, 2097152, array['image/webp', 'image/jpeg']),
  ('flyers', 'flyers', true, 2097152, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do nothing;

create policy "media: lectura pública"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('results', 'gallery', 'flyers'));

create policy "media: admins suben"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('results', 'gallery', 'flyers') and (select public.is_admin()));

create policy "media: admins actualizan"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('results', 'gallery', 'flyers') and (select public.is_admin()))
  with check (bucket_id in ('results', 'gallery', 'flyers') and (select public.is_admin()));

create policy "media: admins borran"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('results', 'gallery', 'flyers') and (select public.is_admin()));
