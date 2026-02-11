import { z } from "zod";

const bouwFasen = [
  "Schetsontwerp",
  "Voorlopig ontwerp",
  "Definitief ontwerp",
  "Uitvoeringsontwerp"
] as const;

export const projectplanSchema = z.object({
  projectplanTitel: z.string().min(1, "Titel is verplicht"),
  projectplanBeschrijving: z.string().min(1, "Beschrijving is verplicht"),
  projectplanNaam: z.string().min(1, "Naam is verplicht"),
  projectplanEmail: z.string().email("Vul een geldig e-mailadres in"),
  projectplanVloeroppervlak: z.number().positive("Vul een positief getal in"),
  projectplanProjectnummer: z.string().min(1, "Projectnummer is verplicht"),
  projectplanBouwfase: z.enum(bouwFasen, { required_error: "Kies een bouwfase" }),
});