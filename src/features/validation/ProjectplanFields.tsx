import React from "react";
import { Box } from "@mui/material";
import { TextField, NumField, SelectField } from "uniforms-mui";
import type { FormModel } from "../../forms/types";

const bouwFasen = [
  "Schetsontwerp",
  "Voorlopig ontwerp",
  "Definitief ontwerp",
  "Uitvoeringsontwerp"
] as const;

export function ProjectplanFields({ model }: { model: FormModel }) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <TextField
        name="projectplanTitel"
        label="Projectnaam"
        fullWidth
      />

      <TextField
        name="projectplanNaam"
        label="Naam"
        fullWidth
      />

      <TextField
        name="projectplanEmail"
        label="Email"
        type="email"
        fullWidth
      />

      <NumField
        name="projectplanVloeroppervlak"
        label="Bruto vloeroppervlak project (m²)"
        decimal={false}
        fullWidth
      />

      <TextField
        name="projectplanProjectnummer"
        label="Projectnummer"
        fullWidth
      />

      <SelectField
        name="projectplanBouwfase"
        label="Bouwfase"
        allowedValues={bouwFasen as unknown as string[]}
        fullWidth
      />

      <TextField
        name="projectplanBeschrijving"
        label="Projectbeschrijving"
        multiline
        rows={4}
        fullWidth
      />
    </Box>
  );
}