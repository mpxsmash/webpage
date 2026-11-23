import type { ReactNode } from "react";
import styles from "./Section.module.css";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ id, title, subtitle, children }: Props) {
  const headingId = `${id}-titulo`;
  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
