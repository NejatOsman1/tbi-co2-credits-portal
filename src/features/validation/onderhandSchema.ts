import { z } from "zod";

export const onderhandSchema = z.object({
  koperNaam: z.string().min(1, "Kopernaam is verplicht"),
  verkoopBedrag: z.number({ invalid_type_error: "Voer bedrag in" }).positive("Moet > 0 zijn"),
});
