import { z } from "zod";

export const bewijsSchema = z.object({
  bewijsLinks: z.array(z.string().min(1, "Voeg minstens één link toe")).min(1, "Voeg minstens één link toe"),

  // Gekozen type bewijsstuk per categorie
  bewijsBiomaterialen: z.string().optional(),
  bewijsMilieuImpact: z.string().optional(),
  bewijsGebouwgegevens: z.string().optional(),
  bewijsDuurzaamHout: z.string().optional(),
});
