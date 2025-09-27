import { z } from "zod";

export const publiceerFotoSchema = z.object({
  fotoUrls: z.array(z.string().url("Ongeldige URL")).min(1, "Voeg minstens één foto-URL toe"),
});
