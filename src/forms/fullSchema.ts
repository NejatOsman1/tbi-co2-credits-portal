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
  // preScanLifeSpanProject2: prescanSchema2.shape.preScanLifeSpanProject2,
  prescanFinishTimeProject2: prescanSchema2.shape.prescanFinishTimeProject2,
  // prescanBinnenSpouwBlad: prescanSchema2.shape.prescanBinnenSpouwBlad,
  aantalm22: prescanSchema2.shape.aantalm22.optional(),
  quickScan: z.array(quickScanRow).optional(),
  // dakelementen: prescanSchema2.shape.dakelementen.optional(),
  // vloeren: prescanSchema2.shape.vloeren.optional(),
  // binnenWanden: prescanSchema2.shape.binnenWanden.optional(),
  // binnenSpouwblad: prescanSchema2.shape.binnenSpouwblad.optional(),
  // prescanBinnenWanden:  prescanSchema2.shape.prescanBinnenWanden.optional(),
  // prescanVloeren:  prescanSchema2.shape.prescanVloeren.optional(),
  structuralElements: prescanSchema2.shape.structuralElements.optional(),
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
