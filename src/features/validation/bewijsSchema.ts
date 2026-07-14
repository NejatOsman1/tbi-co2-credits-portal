import { z } from "zod";

export const bewijsSchema = z.object({
  bewijsLinks: z.array(z.string().min(1, "Voeg minstens één link toe")).min(1, "Voeg minstens één link toe"),
});
