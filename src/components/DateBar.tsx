import { dateBarParts } from "../lib/format";
import styles from "./DateBar.module.css";

export function DateBar({ startsAt }: { startsAt: string }) {
  const { weekday, day, month } = dateBarParts(startsAt);
  return (
    <time dateTime={startsAt} className={styles.bar}>
      <span className={styles.word}>{weekday}</span>
      <span className={styles.day}>{day}</span>
      <span className={styles.word}>{month}</span>
    </time>
  );
}
