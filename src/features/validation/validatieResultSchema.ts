import { z } from "zod";

export const validatieResultSchema = z.object({
  validatieGoedgekeurd: z.boolean(),
  validatieToelichting: z.string().optional(),
});
