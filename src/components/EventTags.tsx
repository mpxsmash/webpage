import type { Enums } from "../lib/database.types";
import { EVENT_LABELS, EVENT_ORDER } from "../lib/events";
import styles from "./EventTags.module.css";

export function EventTags({ types }: { types: Enums<"event_type">[] }) {
  if (types.length === 0) return null;
  const sorted = EVENT_ORDER.filter((t) => types.includes(t));
  return (
    <ul className={styles.tags} aria-label="Categorías">
      {sorted.map((t) => (
        <li key={t} className={styles.tag}>
          {EVENT_LABELS[t]}
        </li>
      ))}
    </ul>
  );
}
