import { useState } from "react";
import { Lightbox, type LightboxImage } from "./Lightbox";
import styles from "./GalleryGrid.module.css";

export type GalleryItem = LightboxImage & { id: string; thumbnail: string };

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className={styles.grid}>
        {items.map((item, i) => (
          <li key={item.id}>
            <button type="button" className={styles.thumb} onClick={() => setOpen(i)}>
              <img src={item.thumbnail} alt={item.alt} loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={items} index={open} onChange={setOpen} />
    </>
  );
}
