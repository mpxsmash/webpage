import { useQuery } from "@tanstack/react-query";
import { supabase, unwrap } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

export type TournamentWithDetails = Tables<"tournaments"> & {
  tournament_prices: Tables<"tournament_prices">[];
  tournament_events: Tables<"tournament_events">[];
};

const DETAILS = "*, tournament_prices(*), tournament_events(*)";

function sortPrices(t: TournamentWithDetails): TournamentWithDetails {
  return { ...t, tournament_prices: [...t.tournament_prices].sort((a, b) => a.sort_order - b.sort_order) };
}

/** Temporada activa con sus torneos publicados (precios y eventos incluidos). */
export function useSeasonTournaments() {
  return useQuery({
    queryKey: ["season-tournaments"],
    queryFn: async () => {
      if (!supabase) return { season: null, tournaments: [] as TournamentWithDetails[] };
      const season = unwrap(await supabase.from("seasons").select("*").eq("is_active", true).maybeSingle());
      if (!season) return { season: null, tournaments: [] as TournamentWithDetails[] };
      const tournaments = unwrap(
        await supabase
          .from("tournaments")
          .select(DETAILS)
          .eq("season_id", season.id)
          .eq("published", true)
          .order("starts_at", { ascending: true }),
      );
      return { season, tournaments: tournaments.map(sortPrices) };
    },
  });
}

/** Próximo torneo publicado (para el hero). */
export function useNextTournament() {
  return useQuery({
    queryKey: ["next-tournament"],
    queryFn: async () => {
      if (!supabase) return null;
      const row = unwrap(
        await supabase
          .from("tournaments")
          .select(DETAILS)
          .eq("published", true)
          .eq("status", "proximo")
          .gte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
      );
      return row ? sortPrices(row) : null;
    },
  });
}

/** Torneos publicados ya finalizados, del más reciente al más antiguo. */
export function usePastTournaments() {
  return useQuery({
    queryKey: ["past-tournaments"],
    queryFn: async () => {
      if (!supabase) return [];
      return unwrap(
        await supabase
          .from("tournaments")
          .select("id, slug, title, starts_at, currency, startgg_url")
          .eq("published", true)
          .eq("status", "finalizado")
          .order("starts_at", { ascending: false }),
      );
    },
  });
}
