import { useEffect, useRef } from "react";
import styles from "./Lightbox.module.css";

export type LightboxImage = { src: string; alt: string; caption?: string };

type Props = {
  images: LightboxImage[];
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Visor con <dialog>: flechas del teclado, Escape para cerrar y deslizar en móvil. */
export function Lightbox({ images, index, onChange }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const image = index === null ? undefined : images[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (image && !dialog.open) dialog.showModal();
    if (!image && dialog.open) dialog.close();
  }, [image]);

  const go = (delta: number) => {
    if (index === null || images.length === 0) return;
    onChange((index + delta + images.length) % images.length);
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Foto ampliada"
      onClose={() => onChange(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onChange(null);
      }}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        const end = e.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start === null || end === undefined) return;
        if (Math.abs(end - start) > 50) go(end < start ? 1 : -1);
      }}
    >
      {image && (
        <figure className={styles.figure}>
          <img src={image.src} alt={image.alt} className={styles.image} />
          <figcaption className={styles.caption}>
            {image.caption && <span>{image.caption}</span>}
            <span>
              {(index ?? 0) + 1} / {images.length}
            </span>
          </figcaption>
        </figure>
      )}
      <button type="button" className={`${styles.button} ${styles.close}`} onClick={() => onChange(null)}>
        <span aria-hidden="true">×</span>
        <span className="visually-hidden">Cerrar</span>
      </button>
      {images.length > 1 && (
        <>
          <button type="button" className={`${styles.button} ${styles.prev}`} onClick={() => go(-1)}>
            <span aria-hidden="true">‹</span>
            <span className="visually-hidden">Foto anterior</span>
          </button>
          <button type="button" className={`${styles.button} ${styles.next}`} onClick={() => go(1)}>
            <span aria-hidden="true">›</span>
            <span className="visually-hidden">Foto siguiente</span>
          </button>
        </>
      )}
    </dialog>
  );
}
