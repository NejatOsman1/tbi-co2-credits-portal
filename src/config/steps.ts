import type { z } from "zod";
import type { FormModel } from "../forms/types";

import { prescanSchema } from "../features/prescan/schema";
import { requireAtLeastOneQuickItem } from "../features/quick-scan/schema";
import {
  oncraResultSchema,
  projectplanSchema,
  bewijsSchema,
  validatieResultSchema,
  publiceerFotoSchema,
  verkoopKanalenSchema,
  onderhandSchema,
} from "../features/validation";

export type FieldKey = keyof FormModel;
export type RenderKey = "quickProducts" | "prescanQuestions";

export type SubstepDef = {
  key: string;
  label: string;
  description: string;
  fields: FieldKey[];
  zod?: z.ZodTypeAny | null;
  render?: RenderKey;
};

export type StepDef = {
  key: string;
  label: string;
  substeps: SubstepDef[];
};

export const steps: StepDef[] = [
  {
    key: "prescan",
    label: "Prescan",
    substeps: [
      {
        key: "prescan-main",
        label: "Prescan",
        description: "Beantwoord de prescan-vragen zodat we uw project beter kunnen inschatten.",
        fields: ["prescanFase", "prescanBio", "aantalm2"],
        zod: prescanSchema,
        render: "prescanQuestions",
      },
    ],
  },
  {
    key: "quick",
    label: "Quick scan",
    substeps: [
      {
        key: "product-materialen",
        label: "Product en Materialen",
        description: "Voeg je producten en materialen toe voor de quick scan.",
        fields: ["quickScan"],
        zod: requireAtLeastOneQuickItem,
        render: "quickProducts",
      },
      {
        key: "oncra-result",
        label: "Oncra scan resultaat",
        description: "Vul (dummy) Oncra scan resultaten in.",
        fields: ["oncraScore", "oncraOpmerking"],
        zod: oncraResultSchema,
      },
    ],
  },
  {
    key: "validatie",
    label: "Project validatie",
    substeps: [
      {
        key: "projectplan",
        label: "Projectplan template invullen",
        description: "Vul het projectplan (dummy) in.",
        fields: ["projectplanTitel", "projectplanBeschrijving"],
        zod: projectplanSchema,
      },
      {
        key: "bewijsstukken",
        label: "Upload bewijsstukken",
        description: "Voeg bewijslinks toe (dummy).",
        fields: ["bewijsLinks"],
        zod: bewijsSchema,
      },
      {
        key: "validatie-result",
        label: "Resultaat validatie Oncra",
        description: "Markeer validatie resultaat (dummy).",
        fields: ["validatieGoedgekeurd", "validatieToelichting"],
        zod: validatieResultSchema,
      },
    ],
  },
  {
    key: "publiceer",
    label: "Publiceer project",
    substeps: [
      {
        key: "foto",
        label: "Upload projectfoto's",
        description: "Voeg foto-URL's toe (dummy).",
        fields: ["fotoUrls"],
        zod: publiceerFotoSchema,
      },
      {
        key: "kanalen",
        label: "Selecteer verkoopkanalen",
        description: "Kies je verkoopkanaal (dummy).",
        fields: ["verkoopKanaal"],
        zod: verkoopKanalenSchema,
      },
      {
        key: "onderhands",
        label: "Onderhands verkoop registreren",
        description: "Registreer onderhandse verkoop (dummy).",
        fields: ["koperNaam", "verkoopBedrag"],
        zod: onderhandSchema,
      },
      {
        key: "overzicht",
        label: "Overzicht",
        description: "Controleer het overzicht (dummy).",
        fields: [],
        zod: null,
      },
    ],
  },
];
