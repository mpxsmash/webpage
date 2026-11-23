import type { ReactNode } from "react";
import styles from "./SectionState.module.css";

type Props = {
  isPending: boolean;
  error: Error | null;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
};

/** Estado propio de cada sección: cargando, error o vacío. Si falla, solo afecta a esta sección. */
export function SectionState({ isPending, error, isEmpty, emptyMessage, children }: Props) {
  if (isPending) {
    return (
      <p className={styles.message} role="status">
        Cargando…
      </p>
    );
  }
  if (error) {
    return (
      <p className={styles.message} role="alert">
        No pudimos cargar esta sección. Intenta de nuevo en un rato.
      </p>
    );
  }
  if (isEmpty) return <p className={styles.message}>{emptyMessage}</p>;
  return <>{children}</>;
}
