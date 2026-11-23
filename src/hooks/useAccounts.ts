import { useQuery } from "@tanstack/react-query";
import { supabase, unwrap } from "../lib/supabase";
import type { Enums } from "../lib/database.types";

export type AccountEntry = { id: string; kind: Enums<"account_kind">; concept: string; amount: number };

export type TournamentAccounts = {
  id: string;
  title: string;
  startsAt: string;
  currency: string;
  entries: AccountEntry[];
  totals: Record<Enums<"account_kind">, number>;
};

/** Cuentas agrupadas por torneo, del más reciente al más antiguo. */
export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<TournamentAccounts[]> => {
      if (!supabase) return [];
      const rows = unwrap(
        await supabase
          .from("account_entries")
          .select("id, kind, concept, amount, created_at, tournaments(id, title, starts_at, currency)")
          .order("created_at", { ascending: true }),
      );

      const byTournament = new Map<string, TournamentAccounts>();
      for (const row of rows) {
        const t = row.tournaments;
        if (!t) continue;
        let group = byTournament.get(t.id);
        if (!group) {
          group = {
            id: t.id,
            title: t.title,
            startsAt: t.starts_at,
            currency: t.currency,
            entries: [],
            totals: { ingreso_inscripcion: 0, gasto: 0, premio: 0 },
          };
          byTournament.set(t.id, group);
        }
        const amount = Number(row.amount);
        group.entries.push({ id: row.id, kind: row.kind, concept: row.concept, amount });
        group.totals[row.kind] += amount;
      }
      return [...byTournament.values()].sort((a, b) => b.startsAt.localeCompare(a.startsAt));
    },
  });
}
