import { z } from "zod";

export const bewijsSchema = z.object({
  bewijsLinks: z.array(z.string().url("Ongeldige URL")).min(1, "Voeg minstens één link toe"),
});
