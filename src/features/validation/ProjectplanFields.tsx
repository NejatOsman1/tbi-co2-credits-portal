import React, { useEffect } from "react";
import { Box, Button, IconButton, TextField as MuiTextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

interface RisicoRow {
  risico?: string;
  kans?: string;
  impact?: string;
  maatregel?: string;
}

export function ProjectplanFields({ model }: { model: FormModel }) {
  const { onChange } = useForm<FormModel>();

  // Risico's (tabel 5 in het projectplan) — de gebruiker kan er meerdere toevoegen.
  const risicos: RisicoRow[] = (model as any)?.risicos ?? [];

  const handleRisicoChange =
    (index: number, field: keyof RisicoRow) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updated = risicos.map((r, i) => (i === index ? { ...r, [field]: e.target.value } : r));
      onChange("risicos", updated);
    };

  const handleAddRisico = () => {
    onChange("risicos", [...risicos, { risico: "", kans: "", impact: "", maatregel: "" }]);
  };

  const handleRemoveRisico = (index: number) => {
    onChange(
      "risicos",
      risicos.filter((_, i) => i !== index)
    );
  };

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

      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Beschrijf hieronder de risico's in het project en de maatregelen die u neemt om deze te
        beperken. U kunt meerdere risico's toevoegen; ze worden allemaal opgenomen in het
        projectplan.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
          gap: 0,
          alignItems: "start",
        }}
      >
        {/* Header row */}
        <Box sx={{ display: "contents" }}>
          {["Risico", "Kans", "Impact", "Maatregel", ""].map((label, i) => (
            <Typography
              key={i}
              sx={{
                fontSize: "0.85rem",
                color: "text.secondary",
                py: 1,
                borderBottom: "2px solid",
                borderColor: "primary.main",
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        {risicos.map((risico, i) => (
          <Box key={i} sx={{ display: "contents" }}>
            {(["risico", "kans", "impact", "maatregel"] as const).map((field) => (
              <Box
                key={field}
                sx={{ py: 1, pr: 1, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <MuiTextField
                  size="small"
                  fullWidth
                  multiline
                  value={risico[field] ?? ""}
                  onChange={handleRisicoChange(i, field)}
                />
              </Box>
            ))}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <IconButton size="small" onClick={() => handleRemoveRisico(i)}>
                <CloseIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddRisico}
          sx={{ fontSize: "0.8rem" }}
        >
          + Risico toevoegen
        </Button>
      </Box>
    </Box>
  );
}