import { ActionLink } from "../components/ActionLink";
import { EVENT_LABELS } from "../lib/events";
import { Section } from "../components/Section";
import { SectionState } from "../components/SectionState";
import { TournamentSelect } from "../components/TournamentSelect";
import { useResultGraphics } from "../hooks/useResultGraphics";
import { useResultsSelection } from "../hooks/useResultsSelection";
import { usePastTournaments } from "../hooks/useTournaments";
import { publicImageUrl } from "../lib/supabase";
import styles from "./Results.module.css";

export function Results() {
  const past = usePastTournaments();
  const { tournamentId, select } = useResultsSelection();
  const tournaments = past.data ?? [];
  const current = tournaments.find((t) => t.id === tournamentId) ?? tournaments[0] ?? null;

  return (
    <Section id="resultados" title="Resultados">
      <SectionState
        isPending={past.isPending}
        error={past.error}
        isEmpty={tournaments.length === 0}
        emptyMessage="Aún no hay resultados publicados."
      >
        {current && (
          <>
            <TournamentSelect label="Torneo" options={tournaments} value={current.id} onChange={select} />
            <Graphics tournamentId={current.id} />
            {/* Fase 2: tabla de standings sincronizada desde start.gg (startgg_standings). */}
            {current.startgg_url && (
              <div className={styles.startgg}>
                <ActionLink variant="secondary" href={current.startgg_url}>
                  Ver standings en start.gg
                </ActionLink>
              </div>
            )}
          </>
        )}
      </SectionState>
    </Section>
  );
}

function Graphics({ tournamentId }: { tournamentId: string }) {
  const { data, isPending, error } = useResultGraphics(tournamentId);
  const graphics = data ?? [];

  return (
    <SectionState
      isPending={isPending}
      error={error}
      isEmpty={graphics.length === 0}
      emptyMessage="Los gráficos de este torneo todavía no están listos."
    >
      <ul className={styles.graphics}>
        {graphics.map((g) => (
          <li key={g.id}>
            <figure className={styles.figure}>
              <img src={publicImageUrl("results", g.image_path)} alt={g.alt_text} loading="lazy" decoding="async" />
              {g.event_type && <figcaption className={styles.caption}>{EVENT_LABELS[g.event_type]}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </SectionState>
  );
}
