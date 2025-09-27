import { z } from "zod";

export const verkoopKanalenSchema = z.object({
  verkoopKanaal: z.enum(["Marketplace", "Direct", "Veiling"], {
    required_error: "Kies een verkoopkanaal",
  }),
});
