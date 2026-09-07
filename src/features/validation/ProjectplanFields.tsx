import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { TextField, NumField, SelectField } from "uniforms-mui";
import { useForm } from "uniforms";
import type { FormModel } from "../../forms/types";
import { getPdfMetaFromStorage } from "../../utils/localStorage";
import { gebouwtypen } from "./projectplanSchema";

const bouwFasen = [
  "Schetsontwerp",
  "Voorlopig ontwerp",
  "Definitief ontwerp",
  "Uitvoeringsontwerp"
] as const;

export function ProjectplanFields({ model }: { model: FormModel }) {
  const { onChange } = useForm<FormModel>();

  // Prefill from localStorage when component mounts
  useEffect(() => {
    const stored = getPdfMetaFromStorage();

    if (stored) {
      // Only prefill if fields are empty
      if (!model.projectplanNaam && stored.name) {
        onChange("projectplanNaam", stored.name);
      }
      if (!model.projectplanTitel && stored.projectName) {
        onChange("projectplanTitel", stored.projectName);
      }
      if (!model.projectplanProjectnummer && stored.projectNumber) {
        onChange("projectplanProjectnummer", stored.projectNumber);
      }
    }

    // Prefill vloeroppervlak from aantalm22 if available
    if (model.aantalm22 && !model.projectplanVloeroppervlak) {
      onChange("projectplanVloeroppervlak", model.aantalm22);
    }

    // Prefill bouwfase from prescanFase2 if available
    if (model.prescanFase2 && !model.projectplanBouwfase) {
      onChange("projectplanBouwfase", model.prescanFase2);
    }
  }, []); // Run only once when component mounts

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      
      <TextField
        name="projectplanNaam"
        label="Naam aanvrager"
        fullWidth
      />

      <TextField
        name="projectplanEmail"
        label="Email aanvrager"
        type="email"
        fullWidth
      />
      
      <TextField
        name="projectplanTitel"
        label="Projectnaam"
        fullWidth
      />

      <TextField
        name="projectplanBedrijfsnaam"
        label="Bedrijfsnaam"
        fullWidth
      />

      <TextField
        name="projectplanAdres"
        label="Adres bedrijf"
        fullWidth
      />

      <NumField
        name="projectplanKvkNummer"
        label="KVK nummer bedrijf "
        fullWidth
      />

      <TextField
        name="projectplanRol"
        label="Rol van bedrijf in project"
        fullWidth
      />

      <TextField
        name="projectplanLocatie"
        label="Locatie project"
        fullWidth
      />

      <TextField
        name="projectplanStartdatum"
        label="Startdatum project"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        name="projectplanEinddatum"
        label="Einddatum project"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
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

      <SelectField
        name="projectplanGebouwtype"
        label="Gebouwtype"
        allowedValues={gebouwtypen as unknown as string[]}
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