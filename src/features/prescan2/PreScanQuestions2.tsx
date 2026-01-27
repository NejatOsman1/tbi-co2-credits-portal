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
import { Tooltip, Paper, FormControl, InputLabel, FormHelperText} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useField } from "uniforms";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { smallFormTheme } from "../../app/theme.js";
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
            label="Wat is de omvang van het project in bruto vloeroppervlakte (m²)?"
            decimal={false}
            fullWidth
          />
        </Box>
      </Tooltip>

    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <FormControl fullWidth margin="dense" variant="standard">
        <InputLabel
          shrink
          sx={{
            position: "static",
            transform: "none",
            mb: 0,
          }}
        >
          Welke biobased materialen worden toegepast?
        </InputLabel>
        <FormHelperText sx={{ mt: 0, mb: 0 }}>
          Klik op het plusteken om per element de hoeveelheid biobased materialen toe te voegen.
        </FormHelperText>
      </FormControl>

      <ProductList name="structuralElements" label="" />
    </Paper>
              
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



type ProductListProps = {
  name: string;
  label?: string;
};

const ProductList: React.FC<ProductListProps> = ({ name }) => (
  <ThemeProvider theme={smallFormTheme}>
    <Box sx={{ mb: 0 }}>
      <ListField
        name={name}
        label=""
        sx={{
          "& .MuiList-root": {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        <NestField name="$" label="">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr 1fr 1fr auto",
              },
              gap: 1,
              alignItems: "center",
            }}
          >
            <SelectField name="elements" label="Element" fullWidth />

            <Tooltip
              title="Vul hier de oppervlakte van dit specifieke element in vierkante meters in."
              arrow
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

            <SelectField name="productTypes" label="Biobased product" fullWidth />
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
  const [{ value: productTypes }] = useField<string>("productTypes",{ initialValue: "" });
  const [{ value: aantal }] = useField<number>("aantal",{ initialValue: false });
 
  const computedValue = useMemo(
    () => computeCO2Equivalent(elements, productTypes, aantal),
    [elements, productTypes, aantal]
  );

  return (
    <TextField     
      label="CO₂ equivalent (Ton CO₂ opslag)"
      name="eenheid"
      value={computedValue}
      disabled
      InputProps={{ readOnly: true }}
      fullWidth
    />
  );
};

