import { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

function remaining(target: number, now: number) {
  const diff = Math.max(0, target - now);
  return {
    done: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

export function Countdown({ startsAt }: { startsAt: string }) {
  const target = new Date(startsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const t = remaining(target, now);
  if (t.done) return <p className={styles.live}>¡Ya empezó!</p>;

  const units = [
    { value: t.days, label: "días" },
    { value: t.hours, label: "horas" },
    { value: t.minutes, label: "min" },
    { value: t.seconds, label: "seg" },
  ];

  return (
    <div className={styles.countdown}>
      {/* Lectores de pantalla: texto fijo, sin anunciar cada segundo */}
      <p className="visually-hidden">
        Faltan {t.days} días y {t.hours} horas
      </p>
      <ol className={styles.units} aria-hidden="true">
        {units.map((u) => (
          <li key={u.label} className={styles.unit}>
            <span className={styles.value}>{String(u.value).padStart(2, "0")}</span>
            <span className={styles.label}>{u.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
