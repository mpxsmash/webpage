import styles from "./NintendoDisclaimer.module.css";

export function NintendoDisclaimer() {
  return (
    <div className={styles.disclaimer}>
      <p lang="en">Nintendo is not a sponsor of or affiliated with this tournament.</p>
      <p>Nintendo no patrocina ni está afiliado a este torneo.</p>
    </div>
  );
}
