import { z } from "zod";
import { prescanSchema } from "../features/prescan/schema";
import { quickScanRow } from "../features/quick-scan/schema";
import {
  oncraResultSchema,
  projectplanSchema,
  bewijsSchema,
  validatieResultSchema,
  publiceerFotoSchema,
  verkoopKanalenSchema,
  onderhandSchema,
} from "../features/validation";

// Compose the full shape from partial schemas
export const FullSchema = z.object({
  prescanFase: prescanSchema.shape.prescanFase.optional(),
  prescanBio: prescanSchema.shape.prescanBio.optional(),
  aantalm2: prescanSchema.shape.aantalm2.optional(),

  quickScan: z.array(quickScanRow).optional(),

  oncraScore: oncraResultSchema.shape.oncraScore.optional(),
  oncraOpmerking: oncraResultSchema.shape.oncraOpmerking.optional(),

  projectplanTitel: projectplanSchema.shape.projectplanTitel.optional(),
  projectplanBeschrijving: projectplanSchema.shape.projectplanBeschrijving.optional(),

  bewijsLinks: bewijsSchema.shape.bewijsLinks.optional(),

  validatieGoedgekeurd: validatieResultSchema.shape.validatieGoedgekeurd.optional(),
  validatieToelichting: validatieResultSchema.shape.validatieToelichting.optional(),

  fotoUrls: publiceerFotoSchema.shape.fotoUrls.optional(),

  verkoopKanaal: verkoopKanalenSchema.shape.verkoopKanaal.optional(),

  koperNaam: onderhandSchema.shape.koperNaam.optional(),
  verkoopBedrag: onderhandSchema.shape.verkoopBedrag.optional(),
});
