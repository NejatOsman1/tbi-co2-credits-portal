import { Box, Typography } from "@mui/material";
import { ListField, NestField, NumField, TextField, ListDelField } from "uniforms-mui";
import { SelectField } from "uniforms-mui";
import type { FormModel } from "@/forms/types";
import { bouwFasen, jaNeeMaybe, aantalm2 } from "./schema.js";

export function PrescanQuestions({ model }: { model: FormModel }) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 300 }}>
        (Vragen nader te specificeren)
      </Typography>

      <Box>
        <SelectField
          name="prescanFase"
          label="In welke fase van het bouwproces bent u?"
          allowedValues={bouwFasen as unknown as string[]}
          fullWidth
        />
      </Box>

      <Box>
        <SelectField
          name="prescanBio"
          label="Overweegt u om bio-based materialen toe te passen in uw project?"
          allowedValues={jaNeeMaybe as unknown as string[]}
          fullWidth
        />
      </Box>

      <Box>
         <NumField name="aantalm2" label="Wat is de omvang van het project in vloeroppervlak (m²)?" decimal={false} fullWidth />
        {/* <SelectField
          name="aantalm2"
          label="Wat is de omvang van het project in vloeroppervlak (m²)?"
          allowedValues={aantalm2 as unknown as string[]}
          fullWidth
        /> */}
      </Box>

      {(model?.prescanBio === "Ja" || model?.prescanBio === "Weet ik nog niet") &&
      model?.aantalm2 === "Meer dan 100 m2" ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main" }}>
            U komt in aanmerking voor CO2 credits! Klik op volgende om te berekenen hoeveel CO2 credits uw project kan opleveren.
          </Typography>
        </Box>
      ) : model?.prescanBio === "Nee" || model?.aantalm2 === "Minder dan 100 m2" ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "error.main" }}>
            Helaas dit project komt niet in aanmerking voor CO2 credits.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
