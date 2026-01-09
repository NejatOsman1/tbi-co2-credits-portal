import { ZodBridge } from "uniforms-bridge-zod";
import { z } from "zod";
import { FullSchema } from "./fullSchema";
import type { SubstepDef } from "../config/steps";

export function makeStepBridge(currentSub: SubstepDef) {
  // 1) If substep provides its own zod schema, use it
  if (currentSub.zod) {
    return new ZodBridge({ schema: currentSub.zod });
  }

  // 2) If the substep has NO fields, validate nothing
  //    (Perfect for intro + final overview screens)
  if (!currentSub.fields || currentSub.fields.length === 0) {
    const emptySchema = z.object({}).passthrough();
    return new ZodBridge({ schema: emptySchema });
  }

  // 3) Otherwise fall back to "everything optional"
  return new ZodBridge({ schema: FullSchema.partial() });
}
