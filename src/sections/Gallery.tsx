import { useMemo, useState } from "react";
import { GalleryGrid, type GalleryItem } from "../components/GalleryGrid";
import { Section } from "../components/Section";
import { SectionState } from "../components/SectionState";
import { TournamentSelect } from "../components/TournamentSelect";
import { useGallery } from "../hooks/useGallery";
import { publicImageUrl, thumbnailUrl } from "../lib/supabase";

export function Gallery() {
  const { data, isPending, error } = useGallery();
  const [filter, setFilter] = useState("");

  const photos = useMemo(() => data ?? [], [data]);

  const tournaments = useMemo(() => {
    const seen = new Map<string, { id: string; title: string; starts_at: string }>();
    for (const p of photos) if (p.tournaments) seen.set(p.tournaments.id, p.tournaments);
    return [...seen.values()].sort((a, b) => b.starts_at.localeCompare(a.starts_at));
  }, [photos]);

  const items: GalleryItem[] = useMemo(
    () =>
      photos
        .filter((p) => !filter || p.tournament_id === filter)
        .map((p) => ({
          id: p.id,
          src: publicImageUrl("gallery", p.image_path),
          thumbnail: thumbnailUrl("gallery", p.image_path),
          alt: p.alt_text,
          caption: p.tournaments?.title,
        })),
    [photos, filter],
  );

  return (
    <Section id="galeria" title="Galería">
      <SectionState
        isPending={isPending}
        error={error}
        isEmpty={photos.length === 0}
        emptyMessage="Pronto subimos las fotos de los torneos."
      >
        {tournaments.length > 1 && (
          <TournamentSelect
            label="Filtrar por torneo"
            options={tournaments}
            value={filter}
            onChange={setFilter}
            allLabel="Todos los torneos"
          />
        )}
        <GalleryGrid key={filter} items={items} />
      </SectionState>
    </Section>
  );
}
