# Sitio web MPX

Web de los torneos Dageki de Super Smash Bros. Ultimate organizados por MPX: torneos de la temporada con inscripción en start.gg, resultados con gráficos de MPX y standings de start.gg, ranking, rifas, galería de fotos y cuentas de cada evento.

Single page con React + TypeScript (Vite) y Supabase. Guía completa del proyecto (stack, reglas visuales, reglas de Nintendo): [CLAUDE.md](CLAUDE.md).

> Fase 1 lista (inicio, temporada, resultados, galería, cuentas y contacto). Ranking y rifas vienen en las fases 2 y 3.

## Arranque local

```bash
pnpm install
cp .env.example .env.local    # completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
pnpm exec supabase start      # requiere Docker
pnpm exec supabase db reset   # migraciones + datos de ejemplo
pnpm dev
```

El token de start.gg no va en `.env.local`: se guarda como secreto de Supabase (`pnpm exec supabase secrets set STARTGG_TOKEN=...`) y solo lo usa la Edge Function `sync-startgg`.

## Contenido

El sitio es de solo lectura. El equipo carga torneos, imágenes, cuentas y rifas desde el dashboard de Supabase (Table Editor y Storage).
