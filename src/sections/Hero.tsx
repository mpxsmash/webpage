import { ActionLink } from "../components/ActionLink";
import { Countdown } from "../components/Countdown";
import { DateBar } from "../components/DateBar";
import { EventTags } from "../components/EventTags";
import { useNextTournament } from "../hooks/useTournaments";
import styles from "./Hero.module.css";

export function Hero() {
  const { data: next, isPending, error } = useNextTournament();

  return (
    <section aria-labelledby="inicio-titulo" className={styles.hero}>
      <div className={styles.flares} aria-hidden="true" />
      <div className={styles.inner}>
        {/* TODO: logo MPX en SVG o PNG transparente (public/logo/) en lugar del texto */}
        <p className={styles.brand}>MPX</p>
        <h1 id="inicio-titulo" className={styles.title}>
          Torneo
        </h1>
        <p className={styles.game}>Super Smash Bros. Ultimate</p>
        <p className={styles.circuit}>Circuito Dageki · Singles · Doubles · Rising</p>

        <div className={styles.next}>
          {isPending ? (
            <p className={styles.muted} role="status">
              Cargando próximo torneo…
            </p>
          ) : error ? (
            <p className={styles.muted} role="alert">
              No pudimos cargar el próximo torneo.
            </p>
          ) : next ? (
            <>
              <p className={styles.kicker}>Próximo torneo</p>
              <h2 className={styles.nextTitle}>{next.title}</h2>
              <DateBar startsAt={next.starts_at} />
              {next.venue && <p className={styles.venue}>{next.venue}</p>}
              <EventTags types={next.tournament_events.map((e) => e.type)} />
              <Countdown startsAt={next.starts_at} />
              <div className={styles.actions}>
                {next.startgg_url && <ActionLink href={next.startgg_url}>Inscríbete en start.gg</ActionLink>}
                <ActionLink variant="secondary" href="#temporada">
                  Ver temporada
                </ActionLink>
              </div>
            </>
          ) : (
            <>
              <p className={styles.muted}>Pronto anunciamos el próximo torneo. Síguenos en redes.</p>
              <div className={styles.actions}>
                <ActionLink variant="secondary" href="#contacto">
                  Ver redes
                </ActionLink>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
