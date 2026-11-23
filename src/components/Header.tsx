import { useEffect, useState } from "react";
import { useActiveSection } from "../hooks/useActiveSection";
import styles from "./Header.module.css";

export type NavItem = { id: string; label: string };

export function Header({ items }: { items: readonly NavItem[] }) {
  const [ids] = useState(() => items.map((i) => i.id));
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#inicio" className={styles.brand} onClick={() => setOpen(false)}>
          {/* TODO: reemplazar por el logo MPX en SVG o PNG transparente (public/logo/) */}
          MPX
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? "Cerrar menú" : "Abrir menú"}</span>
          <span className={styles.bars} aria-hidden="true" />
        </button>

        <nav aria-label="Secciones">
          <ul id="menu-principal" className={[styles.menu, open ? styles.open : ""].join(" ")}>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={styles.link}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
