import { useResultsSelection } from "../hooks/useResultsSelection";
import type { TournamentWithDetails } from "../hooks/useTournaments";
import { formatLongDateTime } from "../lib/format";
import { ActionLink } from "./ActionLink";
import { DateBar } from "./DateBar";
import { EventTags } from "./EventTags";
import { PriceList, PriceRow } from "./PriceRow";
import styles from "./TournamentCard.module.css";

export function TournamentCard({ tournament: t }: { tournament: TournamentWithDetails }) {
  const finished = t.status === "finalizado";
  const { select } = useResultsSelection();
  return (
    <article className={[styles.card, finished ? styles.finished : ""].join(" ")} aria-labelledby={`torneo-${t.id}`}>
      <div className={styles.date}>
        <DateBar startsAt={t.starts_at} />
      </div>

      <h3 id={`torneo-${t.id}`} className={styles.title}>
        {t.title}
      </h3>
      <p className={styles.when}>{formatLongDateTime(t.starts_at)}</p>

      <EventTags types={t.tournament_events.map((e) => e.type)} />

      {t.venue && (
        <p className={styles.venue}>
          {t.map_url ? (
            <a href={t.map_url} target="_blank" rel="noopener noreferrer">
              {t.venue}
            </a>
          ) : (
            t.venue
          )}
          {t.address && <span className={styles.address}>{t.address}</span>}
        </p>
      )}

      {!finished && t.tournament_prices.length > 0 && (
        <PriceList>
          {t.tournament_prices.map((p) => (
            <PriceRow key={p.id} label={p.label} amount={p.amount} currency={t.currency} />
          ))}
        </PriceList>
      )}

      <div className={styles.actions}>
        {finished ? (
          <ActionLink variant="secondary" href="#resultados" onClick={() => select(t.id)}>
            Ver resultados
          </ActionLink>
        ) : t.startgg_url ? (
          <ActionLink href={t.startgg_url}>Inscríbete en start.gg</ActionLink>
        ) : (
          <p className={styles.note}>Inscripciones próximamente.</p>
        )}
      </div>
    </article>
  );
}
