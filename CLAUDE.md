# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sitio web MPX

> **Estado actual:** Fase 1 hecha en código (sin probar contra un Supabase real). Ranking, Rifas, standings y la Edge Function `sync-startgg` todavía no existen. `src/lib/database.types.ts` está escrito a mano; regenerarlo en cuanto haya Docker.

Sitio de **MPX**, organización de torneos presenciales de _Super Smash Bros. Ultimate_ (circuito **Dageki**: Singles, Doubles y Rising).

## Para qué es este sitio

- **Vitrina de resultados**: mostrar los resultados de cada torneo con **imágenes hechas por MPX** (gráficos de top 8, campeones, etc.).
- **Tablas de datos de start.gg**: standings y datos de los eventos, leídos de start.gg y mostrados con el estilo de MPX.
- **Torneos de la temporada**: listar los torneos de la temporada actual con un botón que lleva a **inscribirse en start.gg**.
- **Galería**: fotos de los torneos presenciales.
- **Ranking propio** y **rifas**: datos que MPX administra en Supabase.

### Lo que el sitio NO hace

- **No corre torneos**: nada de brackets propios, inscripciones, pagos, check-in ni reportes de sets. Todo eso vive en start.gg.
- No tiene cuentas de usuario para el público.

Todo el contenido visible va en **español**. El código, nombres de archivos y comentarios pueden ir en inglés.

## Stack

- **React + TypeScript** (estricto) con **Vite**. Sin Next.js, sin SSR.
- **Single page**: una sola página con secciones verticales y scroll. Sin React Router; la navegación son anclas (`#temporada`, `#resultados`…).
- **Supabase**: base de datos (Postgres), Storage para imágenes y Edge Functions para hablar con start.gg.
  - Cliente: `@supabase/supabase-js` con la clave pública (anon/publishable) únicamente.
  - Migraciones SQL versionadas en `supabase/migrations/`.
  - Tipos generados en `src/lib/database.types.ts`; no escribir tipos de tablas a mano.
- **Datos en el cliente**: `@tanstack/react-query` para fetching y caché.
- **Estilos**: CSS Modules + variables globales en `src/styles/tokens.css`. Sin librerías de componentes.
- **Fuentes**: `@fontsource/anton`, `@fontsource/bebas-neue`, `@fontsource/archivo-black`, `@fontsource/montserrat`.
- **Hosting**: estático (Vercel, Netlify o Cloudflare Pages; pendiente).
- **Administrador de paquetes**: pnpm (no hay npm instalado). La CLI de Supabase está como dependencia de desarrollo y se usa con `pnpm exec supabase`.

## Comandos

```bash
pnpm install
pnpm dev             # Vite en local
pnpm build           # tsc + vite build → dist/
pnpm preview
pnpm lint

pnpm exec supabase start                         # Supabase local (requiere Docker)
pnpm exec supabase migration new <nombre>
pnpm exec supabase db reset                      # migraciones + seed
pnpm exec supabase gen types typescript --local > src/lib/database.types.ts
pnpm exec supabase functions serve               # Edge Functions en local
pnpm exec supabase functions deploy sync-startgg
```

No hay tests todavía. Antes de dar una tarea por terminada: `pnpm lint` y `pnpm build` sin errores. Si cambió el esquema, regenerar los tipos.

## Variables y secretos

```
# .env.local (frontend) — TODO lo que empieza con VITE_ es público y llega al navegador
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- `STARTGG_TOKEN` y `SUPABASE_SERVICE_ROLE_KEY` **nunca** van en `.env` del frontend ni con prefijo `VITE_`. Se guardan como secretos de Supabase (`pnpm exec supabase secrets set STARTGG_TOKEN=...`) y solo los usa la Edge Function.
- `.env.local` no se sube al repositorio; mantener `.env.example` sin valores.

## Estructura de la página (orden del scroll)

| #   | Sección (`id`)            | Contenido                                                                                                                                    | Fuente de datos                               |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | Hero (`inicio`)           | Logo MPX, próximo torneo con DateBar, cuenta regresiva, botón "Inscríbete en start.gg"                                                       | `tournaments`                                 |
| 2   | Temporada (`temporada`)   | Torneos de la temporada activa: fecha, sede, tabla de precios, botón a start.gg; los pasados muestran "Ver resultados" (salta a #resultados) | `seasons`, `tournaments`, `tournament_prices` |
| 3   | Resultados (`resultados`) | Selector de torneo; gráficos de resultados hechos por MPX + tabla de standings de start.gg por evento                                        | `result_graphics`, `startgg_standings`        |
| 4   | Ranking (`ranking`)       | Tabla del ranking de la temporada: posición, tag, puntos, torneos jugados                                                                    | vista `season_ranking`                        |
| 5   | Rifas (`rifas`)           | Rifa activa: premio (ej. Switch 2), fecha del sorteo, cómo se participa, progreso; ganadores anteriores                                      | `raffles`, vista `raffle_public_stats`        |
| 6   | Galería (`galeria`)       | Fotos de torneos presenciales, filtrables por torneo, con lightbox                                                                           | `gallery_photos`                              |
| 7   | Cuentas (`cuentas`)       | Cuentas por torneo (exigido por Nintendo, ver abajo)                                                                                         | `account_entries`                             |
| 8   | Contacto y footer         | Redes (Instagram, TikTok, Facebook, Discord), contacto, aviso de no afiliación con Nintendo                                                  | estático                                      |

Navegación:

- Header fijo con enlaces a las secciones, scroll suave (`scroll-behavior: smooth`) y `scroll-margin-top` igual a la altura del header.
- Sección activa resaltada en el menú con `IntersectionObserver`.
- En móvil, menú hamburguesa que se cierra al elegir una sección.
- Cada sección carga sus datos de forma independiente y muestra su propio estado de carga/vacío/error; si una falla, las demás siguen funcionando.
- Las secciones de abajo (galería, cuentas) cargan imágenes en diferido (`loading="lazy"`).

## Estructura del código

```
src/
  main.tsx
  App.tsx                    # compone las secciones en orden
  sections/                  # Hero, Season, Results, Ranking, Raffles, Gallery, Accounts, Contact
  components/                # Header, PriceRow, DateBar, TournamentCard, Countdown, StandingsTable,
                             # RankingTable, RaffleCard, GalleryGrid, Lightbox, NintendoDisclaimer…
  hooks/                     # useTournaments, useStandings, useRanking, useRaffles, useActiveSection…
  lib/
    supabase.ts              # cliente con clave pública
    database.types.ts        # generado
    format.ts                # fechas y montos en español
  styles/
    tokens.css
    globals.css
supabase/
  migrations/
  seed.sql
  functions/
    sync-startgg/index.ts    # lee start.gg y guarda en startgg_standings
public/
  logo/                      # logo MPX (SVG o PNG transparente), favicon, imagen OG
```

## Base de datos (Supabase)

### Tablas

| Tabla               | Para qué                              | Campos clave                                                                                                                                                                                          |
| ------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `seasons`           | Temporadas                            | `id`, `name`, `starts_on`, `ends_on`, `is_active`                                                                                                                                                     |
| `tournaments`       | Torneos de MPX                        | `id`, `season_id`, `slug`, `title`, `starts_at` (timestamptz), `venue`, `address`, `map_url`, `startgg_url`, `startgg_tournament_slug`, `currency`, `status` (`proximo` \| `finalizado`), `published` |
| `tournament_prices` | Filas de la tabla de precios          | `tournament_id`, `label`, `amount`, `sort_order`                                                                                                                                                      |
| `tournament_events` | Eventos en start.gg                   | `tournament_id`, `type` (`singles` \| `doubles` \| `rising`), `startgg_event_slug`                                                                                                                    |
| `result_graphics`   | Imágenes de resultados hechas por MPX | `tournament_id`, `event_type`, `image_path`, `alt_text`, `sort_order`                                                                                                                                 |
| `startgg_standings` | Copia de standings de start.gg        | `tournament_event_id`, `placement`, `gamer_tag`, `startgg_player_id`, `synced_at`                                                                                                                     |
| `players`           | Jugadores del ranking                 | `id`, `tag`, `startgg_player_id` (único), `main_character` (texto)                                                                                                                                    |
| `ranking_points`    | Puntos por torneo                     | `season_id`, `player_id`, `tournament_id`, `points`                                                                                                                                                   |
| `raffles`           | Rifas                                 | `id`, `title`, `prize`, `description`, `rules`, `draw_date`, `status` (`activa` \| `cerrada` \| `sorteada`), `goal_amount`, `current_amount`, `winner_tag`                                            |
| `raffle_entries`    | Participaciones (privado)             | `raffle_id`, `player_id` o `participant_name`, `tickets`, `source`, `created_at`                                                                                                                      |
| `gallery_photos`    | Fotos de torneos                      | `tournament_id`, `image_path`, `alt_text`, `sort_order`                                                                                                                                               |
| `account_entries`   | Cuentas del evento                    | `tournament_id`, `kind` (`ingreso_inscripcion` \| `gasto` \| `premio`), `concept`, `amount`                                                                                                           |
| `admins`            | Quién puede editar                    | `user_id` (referencia a `auth.users`)                                                                                                                                                                 |

Vistas:

- `season_ranking`: suma de `ranking_points` por jugador en la temporada activa. El **sistema de puntos lo define MPX** (pendiente); no inventarlo.
- `raffle_public_stats`: por rifa, total de boletos y participantes, sin datos personales.

### Reglas de base de datos

- **RLS activado en todas las tablas.**
- Lectura pública (`anon`) solo de contenido publicado: torneos, precios, gráficos, standings, ranking, rifas, galería y cuentas.
- **`raffle_entries` nunca es legible por el público**: puede contener nombres o contactos. El frontend solo usa `raffle_public_stats` y `raffles.winner_tag`.
- Escritura solo para usuarios en `admins` (función SQL `is_admin()` en las políticas). El frontend público no escribe nada.
- Todo cambio de esquema = una migración nueva. Nunca editar migraciones aplicadas.
- Montos en `numeric(10,2)`; fechas en `timestamptz`.

### Storage

Buckets con lectura pública y escritura solo de admins:

- `results`: gráficos de resultados hechos por MPX.
- `gallery`: fotos de torneos presenciales.
- `flyers`: flyers de cada torneo.

Las imágenes se suben ya optimizadas (WebP, máximo 1600 px de lado largo para galería, peso menor a 400 KB) y siempre con `alt_text`. En la galería, mostrar miniaturas y cargar la imagen grande solo en el lightbox.

### Cómo se cargan los datos (por ahora)

El equipo administra contenido desde el **dashboard de Supabase** (Table Editor y Storage). El sitio público es de solo lectura. Un panel de administración propio queda fuera del alcance hasta que se pida.

## Integración con start.gg

- start.gg es la fuente de verdad de torneos, inscripciones y brackets. El sitio solo **lee** datos y **enlaza** a start.gg para inscribirse.
- El token **nunca** llega al navegador. La Edge Function `sync-startgg`:
  1. Recibe un `tournament_id` (o recorre los torneos finalizados sin sincronizar).
  2. Consulta `https://api.start.gg/gql/alpha` con `Authorization: Bearer ${STARTGG_TOKEN}` por cada `startgg_event_slug`.
  3. Guarda los standings en `startgg_standings` y crea/actualiza `players` por `startgg_player_id`.
  4. Solo la puede invocar un admin (verificar JWT y pertenencia a `admins`) o un cron de Supabase.
- El frontend lee los standings desde Supabase, nunca desde start.gg directamente.
- Si un torneo no tiene datos sincronizados, la tabla muestra un enlace "Ver en start.gg".
- Los puntos del ranking se calculan a partir de los standings con la regla que defina MPX y se guardan en `ranking_points`.

## Guía visual (obligatoria)

La web replica el sistema de los flyers de MPX: fondo negro, verde neón como color de marca, amarillo solo para precios y llamados a la acción, cajas negras con borde verde.

### Colores

```css
:root {
  --color-bg: #000000; /* fondo general */
  --color-surface: #111111; /* tarjetas, filas de tabla alternas */
  --color-brand: #7dff00; /* títulos, bordes, enlaces, número de fecha */
  --color-action: #ffc700; /* precios, botón Inscríbete, barras de progreso */
  --color-text: #ffffff;
  --color-text-muted: #b3b3b3;
  /* --color-energy: rojo del fondo del flyer, código pendiente. Solo fondos y destellos, nunca texto. */
}
```

Reglas de contraste:

- Sobre verde o amarillo, el texto siempre es **negro**.
- El texto blanco **nunca** va sobre verde ni amarillo.
- No inventar colores nuevos; si hace falta uno, preguntar.

### Tipografía

| Elemento                               | Fuente                       | Color          | Tamaño (móvil → escritorio) |
| -------------------------------------- | ---------------------------- | -------------- | --------------------------- |
| Título de sección / hero ("TORNEO")    | Anton, mayúsculas, inclinado | Verde          | `clamp(56px, 10vw, 110px)`  |
| Subtítulos                             | Bebas Neue                   | Blanco         | `clamp(36px, 6vw, 62px)`    |
| Número del día en la barra de fecha    | Anton                        | Verde          | `clamp(56px, 8vw, 90px)`    |
| Barra de fecha, encabezados de tabla   | Anton                        | Blanco         | `clamp(28px, 4vw, 40px)`    |
| Precios, botones, sede, tags en tablas | Archivo Black, mayúsculas    | Blanco o negro | `clamp(18px, 2.5vw, 28px)`  |
| Texto de lectura y celdas de tabla     | Montserrat 400 / 700         | Blanco         | `16px → 18px`               |

### Componentes

- **PriceRow**: fila negra con borde verde de 2 px; nombre a la izquierda (Archivo Black, blanco); precio en caja amarilla con texto negro y corte diagonal (`clip-path`).
- **DateBar**: barra negra con borde verde; día y mes en Anton blanco; número del día grande en verde.
- **Botón principal**: amarillo, texto negro en Archivo Black; en hover/focus, resplandor verde.
- **StandingsTable / RankingTable**: encabezado en Anton blanco sobre negro con línea verde; filas alternas `--color-bg` / `--color-surface`; top 3 con la posición en verde; en móvil, scroll horizontal dentro de la tabla, nunca de la página.
- **RaffleCard**: premio destacado, fecha del sorteo en DateBar, barra de progreso amarilla, reglas plegables.
- **GalleryGrid**: cuadrícula con miniaturas, borde verde en hover, lightbox con navegación por teclado y swipe.
- Estilo general: cortes diagonales en esquinas, resplandor verde suave en títulos y bordes, destellos rojo/verde de fondo solo en el hero.

Diseño **mobile-first**: la mayoría de las visitas llegan desde Instagram/TikTok en el celular.

## Reglas de Nintendo (no negociables)

MPX organiza torneos comunitarios bajo las _Community Tournament Guidelines_ de Nintendo:

1. **No usar** logos oficiales de Nintendo o de Smash, arte o renders de personajes, música ni efectos de sonido en el sitio. "Super Smash Bros. Ultimate" se escribe como texto. Sí se permiten capturas y video de partidas, y fotos propias. Si un gráfico de resultados subido por MPX trae logos o renders oficiales, avisar.
2. El footer muestra siempre: "Nintendo is not a sponsor of or affiliated with this tournament." con su traducción. Usar `NintendoDisclaimer`.
3. Nunca presentar un torneo como "oficial" o "avalado" por Nintendo.
4. La sección **Cuentas** publica por torneo: inscripciones cobradas, gastos y premios entregados. Es obligatoria.
5. Sin tienda ni venta de mercancía, comida o bebidas ligada a los torneos.
6. Límites de referencia: inscripción hasta el equivalente de 20 USD por persona, máximo 200 participantes presenciales, ningún premio mayor a 5,000 USD.

Referencia: https://en-americas-support.nintendo.com/app/answers/detail/a_id/63433/~/community-tournament-guidelines

## Convenciones

- Accesibilidad: HTML semántico (`<section aria-labelledby>`, `<table>` real para tablas), `alt` en todas las imágenes, foco visible verde, `prefers-reduced-motion` desactiva scroll suave, destellos y animaciones.
- Rendimiento: dividir el código por sección con `React.lazy` para lo que está debajo del primer pantallazo; imágenes en diferido.
- SEO básico: título, descripción e imagen Open Graph en `index.html`.
- Fechas en formato largo en español ("Sábado 21 de noviembre"), zona horaria de la sede.
- Textos cortos y directos, tono de comunidad competitiva.
- No inventar datos (fechas, precios, resultados, puntos, premios, ganadores). Si falta información, dejar un `TODO` visible y avisar.

## Fases

1. **Fase 1**: esquema base con RLS y buckets, Hero, Temporada, Resultados (gráficos de MPX), Galería, Cuentas, Contacto/footer.
2. **Fase 2**: Edge Function `sync-startgg`, tablas de standings, Ranking de temporada.
3. **Fase 3**: Rifas.

No empezar una fase sin terminar la anterior salvo indicación explícita.

## Pendientes que afectan al código

- Hosting y dominio.
- Logo en SVG o PNG transparente, favicon e imagen Open Graph.
- Código exacto del rojo del fondo de los flyers.
- Moneda de los precios y ciudad/zona horaria de la sede.
- Sistema de puntos del ranking.
- Mecánica de las rifas (cómo se obtienen boletos, qué datos se guardan de cada participante) y revisión de los requisitos legales para rifas en su localidad.
- Correos de las personas que serán admins en Supabase.
