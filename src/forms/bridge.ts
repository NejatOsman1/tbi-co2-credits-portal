import { ZodBridge } from "uniforms-bridge-zod";
import { FullSchema } from "./fullSchema";

export const bridge = new ZodBridge({ schema: FullSchema });
