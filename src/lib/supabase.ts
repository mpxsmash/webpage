import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { STORAGE_IMAGE_TRANSFORMS } from "./config";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Cliente público (solo lectura vía RLS). `null` si faltan las variables: las secciones salen vacías. */
export const supabase =
  url && anonKey
    ? createClient<Database>(url, anonKey, { auth: { persistSession: false } })
    : null;

export type Bucket = "results" | "gallery" | "flyers";

/** URL pública de un archivo en un bucket de Storage. */
export function publicImageUrl(bucket: Bucket, path: string): string {
  if (!supabase) return "";
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Miniatura: redimensionada si Storage lo permite; si no, la imagen original. */
export function thumbnailUrl(bucket: Bucket, path: string, width = 480): string {
  if (!supabase) return "";
  if (!STORAGE_IMAGE_TRANSFORMS) return publicImageUrl(bucket, path);
  return supabase.storage.from(bucket).getPublicUrl(path, { transform: { width, quality: 70 } }).data.publicUrl;
}

type QueryResult = { data: unknown; error: { message: string } | null };

/** Lanza el error de Supabase para que React Query lo muestre como estado de error. */
export function unwrap<R extends QueryResult>(result: R): Extract<R, { error: null }>["data"] {
  if (result.error) throw new Error(result.error.message);
  return result.data as Extract<R, { error: null }>["data"];
}
