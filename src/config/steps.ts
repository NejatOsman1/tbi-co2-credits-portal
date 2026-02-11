import type { z } from "zod";
import type { FormModel } from "../forms/types";
import { prescanSchema2 } from "../features/prescan2/schema2";
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
export type RenderKey = "quickProducts" | "prescanQuestions" | "prescanQuestions2" | "intro-waarom" | "intro-hoe" | "projectplanFields";

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
      key: "intro",
      label: "Introductie",
      substeps: [
        {
          key: "waarom",
          label: "Waarom vul je dit in?",
          description: "",          
          fields: [],
          zod: null, // I recommend explicitly setting this
          render: "intro-waarom"
        },
        {
          key: "hoe",
          label: "Hoe gebruik je de tool?",
          description: "",          
          fields: [],
          zod: null, // I recommend explicitly setting this
          render: "intro-hoe"
        }
      ],
    },
    {
    key: "prescan2",
    label: "Quickscan",
    substeps: [
      {
        key: "prescan-main",
        label: "Quickscan",
        description: "Beantwoord de quickscan-vragen zodat we een inschatting kunnen maken voor de CO2 opslag potentie van uw project.",
        fields: ["prescanFase2", "prescanBio2", "structuralElements", "prescanLifeSpanProject2","prescanBinnenSpouwBlad","aantalm22"],
        zod: prescanSchema2,
        render: "prescanQuestions2",
      },
    ],
  },
  {
    key: "quick",
    label: "Oncra input",
    substeps: [
      {
        key: "product-materialen",
        label: "Product en Materialen",
        description: "Voeg je producten en materialen toe voor de quick scan.",
        fields: ["quickScan"],
        zod: requireAtLeastOneQuickItem,
        render: "quickProducts",
      },
      // {
      //   key: "oncra-result",
      //   label: "Oncra scan resultaat",
      //   description: "Vul (dummy) Oncra scan resultaten in.",
      //   fields: ["oncraScore", "oncraOpmerking"],
      //   zod: oncraResultSchema,
      // },
    ],
  },
  {
    key: "validatie",
    label: "Project validatie",
    substeps: [
      {
        key: "projectplan",
        label: "Projectplan template invullen",
        description: "Vul het projectplan in.",
        fields: [
          "projectplanTitel",
          "projectplanNaam",
          "projectplanEmail",
          "projectplanVloeroppervlak",
          "projectplanProjectnummer",
          "projectplanBouwfase",
          "projectplanBeschrijving"
        ],
        zod: projectplanSchema,
        render: "projectplanFields",
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
