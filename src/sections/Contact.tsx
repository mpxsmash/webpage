import { NintendoDisclaimer } from "../components/NintendoDisclaimer";
import { CONTACT_EMAIL, CONTACT_LINKS } from "../lib/config";
import styles from "./Contact.module.css";

export function Contact() {
  const hasContact = CONTACT_LINKS.length > 0 || CONTACT_EMAIL;

  return (
    <footer className={styles.footer}>
      <section aria-labelledby="contacto-titulo" className={styles.inner}>
        <h2 id="contacto-titulo" className={styles.title}>
          Contacto
        </h2>

        {hasContact ? (
          <ul className={styles.links}>
            {CONTACT_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
            {CONTACT_EMAIL && (
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            )}
          </ul>
        ) : (
          // TODO: completar CONTACT_LINKS y CONTACT_EMAIL en src/lib/config.ts
          <p className={styles.muted}>Pronto publicamos nuestras redes y correo de contacto.</p>
        )}

        <div className={styles.legal}>
          <NintendoDisclaimer />
          <p className={styles.muted}>
            Torneo comunitario de Super Smash Bros. Ultimate organizado por MPX. Inscripciones y brackets en start.gg.
          </p>
        </div>
      </section>
    </footer>
  );
}
