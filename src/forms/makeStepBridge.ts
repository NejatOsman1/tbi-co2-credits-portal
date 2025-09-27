// src/forms/makeStepBridge.ts
import { ZodBridge } from "uniforms-bridge-zod";
import { z } from "zod";
import { FullSchema } from "./fullSchema";
import type { SubstepDef } from "../config/steps";

/**
 * Build a Uniforms bridge for ONLY the current substep.
 * - If substep has a Zod schema, use it directly.
 * - Otherwise, fall back to FullSchema.partial() (all optional).
 */
export function makeStepBridge(currentSub: SubstepDef) {
  let stepSchema: z.ZodTypeAny;

  if (currentSub.zod) {
    stepSchema = currentSub.zod; // already enforces only this substep
  } else {
    stepSchema = FullSchema.partial(); // fallback: everything optional
  }

  return new ZodBridge({ schema: stepSchema });
}
