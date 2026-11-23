import { useId } from "react";
import { formatLongDate } from "../lib/format";
import styles from "./TournamentSelect.module.css";

type Option = { id: string; title: string; starts_at: string };

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  allLabel?: string;
};

export function TournamentSelect({ label, options, value, onChange, allLabel }: Props) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select id={id} className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {allLabel && <option value="">{allLabel}</option>}
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.title} — {formatLongDate(o.starts_at)}
          </option>
        ))}
      </select>
    </div>
  );
}
