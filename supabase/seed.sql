-- Datos de EJEMPLO solo para desarrollo local (pnpm exec supabase db reset).
-- Nada de esto es información real de MPX: fechas, precios, sede y moneda son de relleno.

insert into public.seasons (id, name, starts_on, ends_on, is_active) values
  ('00000000-0000-0000-0000-000000000001', 'Temporada de ejemplo', current_date - 60, current_date + 120, true);

insert into public.tournaments
  (id, season_id, slug, title, starts_at, venue, address, map_url, startgg_url, startgg_tournament_slug, currency, status, published)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000001',
   'dageki-ejemplo-1', 'Dageki Ejemplo #1', now() - interval '21 days',
   'Sede de ejemplo', 'Dirección de ejemplo', null, 'https://www.start.gg', null, 'USD', 'finalizado', true),
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-000000000001',
   'dageki-ejemplo-2', 'Dageki Ejemplo #2', now() + interval '12 days',
   'Sede de ejemplo', 'Dirección de ejemplo', null, 'https://www.start.gg', null, 'USD', 'proximo', true),
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-000000000001',
   'dageki-borrador', 'Torneo sin publicar', now() + interval '40 days',
   null, null, null, null, null, 'USD', 'proximo', false);

insert into public.tournament_prices (tournament_id, label, amount, sort_order) values
  ('00000000-0000-0000-0000-0000000000a1', 'DAGEKI SINGLES', 10, 1),
  ('00000000-0000-0000-0000-0000000000a1', 'DAGEKI DOUBLES', 8, 2),
  ('00000000-0000-0000-0000-0000000000a2', 'DAGEKI SINGLES', 10, 1),
  ('00000000-0000-0000-0000-0000000000a2', 'DAGEKI DOUBLES', 8, 2),
  ('00000000-0000-0000-0000-0000000000a2', 'DAGEKI RISING', 5, 3);

insert into public.tournament_events (tournament_id, type) values
  ('00000000-0000-0000-0000-0000000000a1', 'singles'),
  ('00000000-0000-0000-0000-0000000000a1', 'doubles'),
  ('00000000-0000-0000-0000-0000000000a2', 'singles'),
  ('00000000-0000-0000-0000-0000000000a2', 'doubles'),
  ('00000000-0000-0000-0000-0000000000a2', 'rising');

insert into public.account_entries (tournament_id, kind, concept, amount) values
  ('00000000-0000-0000-0000-0000000000a1', 'ingreso_inscripcion', 'Inscripciones Singles (ejemplo)', 300),
  ('00000000-0000-0000-0000-0000000000a1', 'ingreso_inscripcion', 'Inscripciones Doubles (ejemplo)', 120),
  ('00000000-0000-0000-0000-0000000000a1', 'gasto', 'Renta de sede (ejemplo)', 150),
  ('00000000-0000-0000-0000-0000000000a1', 'premio', 'Premio 1.er lugar Singles (ejemplo)', 150),
  ('00000000-0000-0000-0000-0000000000a1', 'premio', 'Premio 1.er lugar Doubles (ejemplo)', 80);
