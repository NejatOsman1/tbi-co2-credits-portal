import { z } from "zod";

export const oncraResultSchema = z.object({
  oncraScore: z.number({ invalid_type_error: "Voer een score in" }).min(0, "≥ 0").optional(),
  oncraOpmerking: z.string().optional(),
});
