import type { AnchorHTMLAttributes } from "react";
import styles from "./ActionLink.module.css";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "secondary" };

/** Botón principal (amarillo) o secundario (borde verde) como enlace. */
export function ActionLink({ variant = "primary", className, ...props }: Props) {
  const external = props.href?.startsWith("http");
  return (
    <a
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className={[styles.link, styles[variant], className].filter(Boolean).join(" ")}
    />
  );
}
