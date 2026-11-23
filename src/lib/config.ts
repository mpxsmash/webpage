// Datos de MPX que todavía faltan. Ver "Pendientes" en CLAUDE.md.

/**
 * TODO: zona horaria IANA de la sede (ej. "America/Mexico_City"), pendiente de confirmar.
 * Mientras sea `undefined`, las fechas se muestran en la zona horaria del navegador.
 */
export const VENUE_TIME_ZONE: string | undefined = undefined;

export type ContactLink = { label: string; href: string };

/** TODO: enlaces reales de Instagram, TikTok, Facebook, Discord y correo de MPX. */
export const CONTACT_LINKS: ContactLink[] = [];

/** TODO: correo de contacto de MPX. */
export const CONTACT_EMAIL: string | null = null;

/**
 * TODO: activar si el proyecto de Supabase tiene "Image Transformations" (plan Pro).
 * Con `true`, la galería pide miniaturas redimensionadas; con `false`, usa la imagen original en diferido.
 */
export const STORAGE_IMAGE_TRANSFORMS = false;
