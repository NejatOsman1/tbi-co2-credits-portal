import { z } from "zod";

export const projectplanSchema = z.object({
  projectplanTitel: z.string().min(1, "Titel is verplicht"),
  projectplanBeschrijving: z.string().min(1, "Beschrijving is verplicht"),
});
