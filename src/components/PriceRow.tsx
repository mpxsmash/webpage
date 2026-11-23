import type { ReactNode } from "react";
import { formatMoney } from "../lib/format";
import styles from "./PriceRow.module.css";

type Props = { label: string; amount: number; currency: string };

export function PriceRow({ label, amount, currency }: Props) {
  return (
    <div className={styles.row}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.price}>{formatMoney(Number(amount), currency)}</dd>
    </div>
  );
}

export function PriceList({ children }: { children: ReactNode }) {
  return <dl className={styles.list}>{children}</dl>;
}
