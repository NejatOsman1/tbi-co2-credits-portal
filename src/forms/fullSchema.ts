import { z } from "zod";

import { prescanSchema2 } from "../features/prescan2/schema2";
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
  prescanFase2: prescanSchema2.shape.prescanFase2.optional(),
  prescanFinishTimeProject2: prescanSchema2.shape.prescanFinishTimeProject2,

  aantalm22: prescanSchema2.shape.aantalm22.optional(),
  quickScan: z.array(quickScanRow).optional(),

  structuralElements: prescanSchema2.shape.structuralElements.optional(),
  oncraScore: oncraResultSchema.shape.oncraScore.optional(),
  oncraOpmerking: oncraResultSchema.shape.oncraOpmerking.optional(),

  // ✅ Add all projectplan fields
  projectplanTitel: projectplanSchema.shape.projectplanTitel.optional(),
  projectplanBeschrijving: projectplanSchema.shape.projectplanBeschrijving.optional(),
  projectplanNaam: projectplanSchema.shape.projectplanNaam.optional(),
  projectplanEmail: projectplanSchema.shape.projectplanEmail.optional(),
  projectplanVloeroppervlak: projectplanSchema.shape.projectplanVloeroppervlak.optional(),
  projectplanProjectnummer: projectplanSchema.shape.projectplanProjectnummer.optional(),
  projectplanBouwfase: projectplanSchema.shape.projectplanBouwfase.optional(),

  bewijsLinks: bewijsSchema.shape.bewijsLinks.optional(),

  validatieGoedgekeurd: validatieResultSchema.shape.validatieGoedgekeurd.optional(),
  validatieToelichting: validatieResultSchema.shape.validatieToelichting.optional(),

  fotoUrls: publiceerFotoSchema.shape.fotoUrls.optional(),

  verkoopKanaal: verkoopKanalenSchema.shape.verkoopKanaal.optional(),

  koperNaam: onderhandSchema.shape.koperNaam.optional(),
  verkoopBedrag: onderhandSchema.shape.verkoopBedrag.optional(),
});