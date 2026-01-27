import { z } from "zod";

export const bouwFasen = ["Schetsontwerp", "Voorlopig ontwerp", "Definitief ontwerp", "Uitvoeringsontwerp"] as const;
export const jaNeeMaybe = ["Ja", "Nee", "Weet ik nog niet"] as const;
export const jaNee = ["Ja", "Nee"] as const;
export const aantalm2 = ["Minder dan 100 m2", "Meer dan 100 m2"] as const;

export const productTypes = [
  "Constructie: Hout",
  "Constructie: Spaanplaat",
  "Constructie: CLT or LVL",
  "Constructie: Bamboo",
  "Isolatie: houtvezels",
  "Isolatie: stro",
  "Isolatie: hemp or flax",
  "Composiet: wood-based",
  "Composiet: mycelium-based",
  "Composiet: conrete based",
] as const;

export const elements = [
  "Dak",
  "Binnenspouwblad",
  "Binnenwanden",
  "Vloeren",
] as const;

const productTypeEnum = z.enum(productTypes);
const elementsEnum = z.enum(elements);

export const prescanSchema2 = z.object({
  prescanFase2: z.enum(bouwFasen, { required_error: "Kies een fase" }),
  aantalm22: z.number().optional(),
  structuralElements: z.array(z.object({
        elements: elementsEnum,
        productTypes: productTypeEnum,
        aantal: z.number().int().positive().optional(),
        eenheid: z.string().min(1, "Voer een eenheid in").optional(),
      })
    ).optional(),

});
