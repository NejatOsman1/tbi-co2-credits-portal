import { Box, Typography } from "@mui/material";
import {
  ListField,
  NestField,
  NumField,
  TextField,
  ListDelField,
  ListAddField,
  SelectField,
} from "uniforms-mui";
import { Tooltip } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useField } from "uniforms";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { primaryColor } from "../../app/theme.js";
import type { FormModel } from "../../forms/types.js";
import { bouwFasen, jaNee, productTypes, elements } from "./schema2.js";
import { getCarbonByType } from "../../data/productCatalog.js";
import  ExportProductenPdfButton  from "../../utils/exportPDF.js"
import { computeCO2Equivalent, computeCO2Equivalent2 } from "../../utils/calculateCO2V2.js"
// (other imports stay as they are)


export function PrescanQuestions2({ model }: { model: FormModel }) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 300 }}>
        (Vragen nader te specificeren)
      </Typography> */}

      <Box>
        <SelectField
          name="prescanFase2"
          label="In welke fase van het bouwproces bent u?"
          allowedValues={bouwFasen as unknown as string[]}
          fullWidth
        />
      </Box>
      <Tooltip
        title="Vloeroppervlakte wordt gebruikt in de export pdf en geeft een eerste indicatie van het CO₂ potentieel."
        arrow
        placement="top"
      >
        <Box>
          <NumField
            name="aantalm22"
            label="Wat is de omvang van het project in vloeroppervlak (m²)?"
            decimal={false}
            fullWidth
          />
        </Box>
      </Tooltip>

      <TextField
          label="Welke biobased materialen worden toegepast?"
          name=""
          fullWidth
            InputProps={{
          readOnly: true,
          disabled: true,
          }}
          value=""
      />
      <ProductList
          name="structuralElements"
          label=""
        />
    
      <ExportProductenPdfButton />

      {(model?.prescanBio2 === "Ja" || model?.prescanBio2 === "Weet ik nog niet") && model?.aantalm22 > 100 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main" }}>
            U komt in aanmerking voor CO2 credits! Klik op volgende om te berekenen hoeveel CO2 credits uw project kan opleveren.
          </Typography>
        </Box>
      ) : model?.prescanBio2 === "Nee" || model?.aantalm22 <= 100 || model?.prescanLifeSpanProject2 === "Nee" ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "error.main" }}>
            Helaas dit project komt niet in aanmerking voor CO2 credits.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

const smallFormTheme = createTheme({
  palette: {
    primary: { main: primaryColor },
  },
  components: {
    MuiFormControl: {
      defaultProps: { margin: "dense" },
    },
    MuiTextField: {
      defaultProps: { margin: "dense", size: "small" },
    },
    MuiSelect: {
      defaultProps: { margin: "dense", size: "small" },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.75rem" },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: "0.75rem" },
      },
    },
  },
  typography: { fontSize: 12 },
});

type ProductListProps = {
  name: string;
  label?: string;
};

const ProductList: React.FC<ProductListProps> = ({ name, label }) => (
  
  <ThemeProvider theme={smallFormTheme}>
    <Box sx={{ mb: 1 }}>

    <ListField
      label="Klik op het plusteken om per element de hoeveelheid biobased materialen toe te voegen"
      name={name}
    >
      <NestField name="$">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr 1fr auto" },
            gap: 1,
            alignItems: "center",
          }}
        >
          <SelectField
            name="elements"
            label="Element"
            fullWidth
          />
        <Tooltip
          title="Vul hier de oppervlakte van dit specifieke element in vierkante meters in. Aan de hand van deze wordt er berekend hoeveel biobased materiaal er nodig is voor het desbetreffende element."
          arrow
          placement="top"
        >
          <Box>
            <NumField
              name="aantal"
              label="Oppervlakte element (m2)"
              decimal={false}
              fullWidth
            />
          </Box>
        </Tooltip>
          
          <SelectField
            name="productType"
            label="Biobased product"
            fullWidth
          />

          <CalculatedEenheidField />
          <ListDelField />
        </Box>
      </NestField>
    </ListField> 

    </Box>
  </ThemeProvider>
);




const CalculatedEenheidField: React.FC = () => {
  // Read siblings inside the same NestField row
  const [{ value: elements }] = useField<string>("elements",{ initialValue: false });  
  const [{ value: productType }] = useField<string>("productType",{ initialValue: "" });
  const [{ value: aantal }] = useField<number>("aantal",{ initialValue: false });

  const computedValue = useMemo(
    () => computeCO2Equivalent(elements, productType, aantal),
    [elements, productType, aantal]
  );

  return (
    <TextField     
      label="CO2 equivalent"
      name="eenheid"
      value={computedValue}
      disabled
      InputProps={{ readOnly: true }}
      fullWidth
    />
  );
};

