import { z } from "zod";

export const bouwFasen = ["Ontwerp", "Aanbesteding", "Bouw", "Afgerond"] as const;
export const jaNeeMaybe = ["Ja", "Nee", "Weet ik nog niet"] as const;
export const jaNee = ["Ja", "Nee"] as const;
export const aantalm2 = ["Minder dan 100 m2", "Meer dan 100 m2"] as const;

export const prescanSchema = z.object({
  prescanFase: z.enum(bouwFasen, { required_error: "Kies een fase" }),
  prescanBio: z.enum(jaNeeMaybe, { required_error: "Kies een optie" }),
  prescanFinishTimeProject: z.enum(jaNee, { required_error: "Kies een optie" }),
  prescanLifeSpanProject: z.enum(jaNee, { required_error: "Kies een optie" }),
  aantalm2: z.number().optional()
});
