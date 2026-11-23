import { Section } from "../components/Section";
import { SectionState } from "../components/SectionState";
import { TournamentCard } from "../components/TournamentCard";
import { useSeasonTournaments } from "../hooks/useTournaments";
import styles from "./Season.module.css";

export function Season() {
  const { data, isPending, error } = useSeasonTournaments();
  const tournaments = data?.tournaments ?? [];

  return (
    <Section id="temporada" title="Temporada" subtitle={data?.season?.name}>
      <SectionState
        isPending={isPending}
        error={error}
        isEmpty={tournaments.length === 0}
        emptyMessage="Todavía no hay torneos publicados en esta temporada."
      >
        <div className={styles.grid}>
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </SectionState>
    </Section>
  );
}
