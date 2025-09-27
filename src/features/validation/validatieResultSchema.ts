import { z } from "zod";

export const validatieResultSchema = z.object({
  validatieGoedgekeurd: z.literal(true, {
    errorMap: () => ({ message: "Bevestig goedkeuring om verder te gaan (dummy)" }),
  }),
  validatieToelichting: z.string().optional(),
});
