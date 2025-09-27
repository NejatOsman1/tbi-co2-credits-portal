import { z } from "zod";
import { FullSchema } from "./fullSchema";

export type FormModel = z.infer<typeof FullSchema>;
