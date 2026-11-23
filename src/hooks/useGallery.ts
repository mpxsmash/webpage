import { useQuery } from "@tanstack/react-query";
import { supabase, unwrap } from "../lib/supabase";

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!supabase) return [];
      return unwrap(
        await supabase
          .from("gallery_photos")
          .select("*, tournaments(id, title, starts_at)")
          .order("sort_order", { ascending: true }),
      );
    },
  });
}
