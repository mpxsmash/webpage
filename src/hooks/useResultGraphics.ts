import { useQuery } from "@tanstack/react-query";
import { supabase, unwrap } from "../lib/supabase";

export function useResultGraphics(tournamentId: string | null) {
  return useQuery({
    queryKey: ["result-graphics", tournamentId],
    enabled: tournamentId !== null,
    queryFn: async () => {
      if (!supabase || !tournamentId) return [];
      return unwrap(
        await supabase
          .from("result_graphics")
          .select("*")
          .eq("tournament_id", tournamentId)
          .order("sort_order", { ascending: true }),
      );
    },
  });
}
