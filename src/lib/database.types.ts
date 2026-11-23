// TODO: escrito a mano a partir de supabase/migrations porque no hay Docker en esta máquina.
// Regenerar con: pnpm exec supabase gen types typescript --local > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Relationship<Name extends string, Column extends string, Referenced extends string> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: Referenced;
  referencedColumns: ["id"];
};

type ToTournament<T extends string> = [Relationship<`${T}_tournament_id_fkey`, "tournament_id", "tournaments">];

type Table<Row, Required extends keyof Row, Rel extends unknown[] = []> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required>>;
  Update: Partial<Row>;
  Relationships: Rel;
};

type SeasonRow = {
  id: string;
  name: string;
  starts_on: string;
  ends_on: string;
  is_active: boolean;
  created_at: string;
};

type TournamentRow = {
  id: string;
  season_id: string | null;
  slug: string;
  title: string;
  starts_at: string;
  venue: string | null;
  address: string | null;
  map_url: string | null;
  startgg_url: string | null;
  startgg_tournament_slug: string | null;
  currency: string;
  status: Database["public"]["Enums"]["tournament_status"];
  published: boolean;
  created_at: string;
  updated_at: string;
};

type TournamentPriceRow = {
  id: string;
  tournament_id: string;
  label: string;
  amount: number;
  sort_order: number;
};

type TournamentEventRow = {
  id: string;
  tournament_id: string;
  type: Database["public"]["Enums"]["event_type"];
  startgg_event_slug: string | null;
};

type ResultGraphicRow = {
  id: string;
  tournament_id: string;
  event_type: Database["public"]["Enums"]["event_type"] | null;
  image_path: string;
  alt_text: string;
  sort_order: number;
};

type GalleryPhotoRow = {
  id: string;
  tournament_id: string;
  image_path: string;
  alt_text: string;
  sort_order: number;
};

type AccountEntryRow = {
  id: string;
  tournament_id: string;
  kind: Database["public"]["Enums"]["account_kind"];
  concept: string;
  amount: number;
  created_at: string;
};

type AdminRow = {
  user_id: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      seasons: Table<SeasonRow, "name" | "starts_on" | "ends_on">;
      tournaments: Table<
        TournamentRow,
        "slug" | "title" | "starts_at" | "currency",
        [Relationship<"tournaments_season_id_fkey", "season_id", "seasons">]
      >;
      tournament_prices: Table<TournamentPriceRow, "tournament_id" | "label" | "amount", ToTournament<"tournament_prices">>;
      tournament_events: Table<TournamentEventRow, "tournament_id" | "type", ToTournament<"tournament_events">>;
      result_graphics: Table<ResultGraphicRow, "tournament_id" | "image_path" | "alt_text", ToTournament<"result_graphics">>;
      gallery_photos: Table<GalleryPhotoRow, "tournament_id" | "image_path" | "alt_text", ToTournament<"gallery_photos">>;
      account_entries: Table<AccountEntryRow, "tournament_id" | "kind" | "concept" | "amount", ToTournament<"account_entries">>;
      admins: Table<AdminRow, "user_id">;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_tournament_published: { Args: { t_id: string }; Returns: boolean };
    };
    Enums: {
      tournament_status: "proximo" | "finalizado";
      event_type: "singles" | "doubles" | "rising";
      account_kind: "ingreso_inscripcion" | "gasto" | "premio";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicTables = Database["public"]["Tables"];
export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
