import type { Enums } from "./database.types";

export const EVENT_LABELS: Record<Enums<"event_type">, string> = {
  singles: "Singles",
  doubles: "Doubles",
  rising: "Rising",
};

export const EVENT_ORDER: Enums<"event_type">[] = ["singles", "doubles", "rising"];
