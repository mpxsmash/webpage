import { Section } from "../components/Section";
import { SectionState } from "../components/SectionState";
import { useAccounts, type TournamentAccounts } from "../hooks/useAccounts";
import type { Enums } from "../lib/database.types";
import { formatLongDate, formatMoney } from "../lib/format";
import styles from "./Accounts.module.css";

const KIND_LABELS: Record<Enums<"account_kind">, string> = {
  ingreso_inscripcion: "Inscripciones cobradas",
  gasto: "Gastos",
  premio: "Premios entregados",
};

const KINDS: Enums<"account_kind">[] = ["ingreso_inscripcion", "gasto", "premio"];

export function Accounts() {
  const { data, isPending, error } = useAccounts();
  const groups = data ?? [];

  return (
    <Section id="cuentas" title="Cuentas" subtitle="En qué se usa cada inscripción">
      <SectionState
        isPending={isPending}
        error={error}
        isEmpty={groups.length === 0}
        emptyMessage="Las cuentas de cada torneo se publican aquí al terminar el evento."
      >
        <div className={styles.list}>
          {groups.map((g, i) => (
            <TournamentAccountsTable key={g.id} group={g} defaultOpen={i === 0} />
          ))}
        </div>
      </SectionState>
    </Section>
  );
}

function TournamentAccountsTable({ group, defaultOpen }: { group: TournamentAccounts; defaultOpen: boolean }) {
  const money = (n: number) => formatMoney(n, group.currency);
  const balance = group.totals.ingreso_inscripcion - group.totals.gasto - group.totals.premio;

  return (
    <details className={styles.details} open={defaultOpen}>
      <summary className={styles.summary}>
        <span className={styles.title}>{group.title}</span>
        <span className={styles.date}>{formatLongDate(group.startsAt)}</span>
      </summary>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <caption className="visually-hidden">Cuentas de {group.title}</caption>
          <thead>
            <tr>
              <th scope="col">Concepto</th>
              <th scope="col" className={styles.amount}>
                Monto
              </th>
            </tr>
          </thead>
          {KINDS.map((kind) => {
            const entries = group.entries.filter((e) => e.kind === kind);
            if (entries.length === 0) return null;
            return (
              <tbody key={kind}>
                <tr className={styles.groupRow}>
                  <th scope="rowgroup" colSpan={2}>
                    {KIND_LABELS[kind]}
                  </th>
                </tr>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.concept}</td>
                    <td className={styles.amount}>{money(e.amount)}</td>
                  </tr>
                ))}
                <tr className={styles.subtotal}>
                  <th scope="row">Total</th>
                  <td className={styles.amount}>{money(group.totals[kind])}</td>
                </tr>
              </tbody>
            );
          })}
          <tfoot>
            <tr>
              <th scope="row">Saldo (inscripciones − gastos − premios)</th>
              <td className={styles.amount}>{money(balance)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}
