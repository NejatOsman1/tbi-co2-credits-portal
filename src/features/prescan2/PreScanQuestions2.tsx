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

import React, { useEffect, useMemo } from "react";
import { useField } from "uniforms";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { primaryColor } from "../../app/theme.js";
import type { FormModel } from "../../forms/types.js";
import { bouwFasen, jaNee, productTypes, elements } from "./schema2.js";
import { getCarbonByType } from "../../data/productCatalog.js";
import  ExportProductenPdfButton  from "../../utils/exportPDF.js"
import { computeCO2Equivalent } from "../../utils/calculateCO2V2.js"
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

      <Box>
        <NumField
          name="aantalm22"
          label="Wat is de omvang van het project in vloeroppervlak (m²)?"
          decimal={false}
          fullWidth
        />
      </Box>
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

      {/* <Box>
        <SelectField
          name="prescanLifeSpanProject2"
          label="Heeft het project dakoppervlakte met biobased materialen?"
          allowedValues={jaNee as unknown as string[]}
          fullWidth
        />
      </Box>
      {model?.prescanLifeSpanProject2 === "Ja" && (
        <ProductList
          name="dakelementen"
          label="Welke biobased materialen worden toegepast op het dak?"
        />
      )}

      <Box>
        <SelectField
          name="prescanBinnenSpouwBlad"
          label="Heeft het project binnenspouwblad met biobased materialen?"
          allowedValues={jaNee as unknown as string[]}
          fullWidth
        />
      </Box>
      {model?.prescanBinnenSpouwBlad === "Ja" && (
        <ProductList
          name="binnenSpouwblad"
          label="Welke biobased materialen worden toegepast in het binnenspouwblad?"
        />
      )}
Automatic testing: add pipeliine with sql script
      <Box>
        <SelectField
          name="prescanBinnenWanden"
          label="Heeft het project een binnenwanden met biobased materialen?"
          allowedValues={jaNee as unknown as string[]}
          fullWidth
        />
      </Box>
      {model?.prescanBinnenWanden === "Ja" && (
        <ProductList
          name="binnenWanden"
          label="Welke biobased materialen worden toegepast in de binnenwanden?"
        />
      )}

      <Box>
        <SelectField
          name="prescanVloeren"
          label="Heeft het project vloerelementen met biobased materialen?"
          allowedValues={jaNee as unknown as string[]}
          fullWidth
        />
      </Box>
      {model?.prescanVloeren === "Ja" && (
        <ProductList
          name="vloeren"
          label="Welke biobased materialen worden toegepast in de vloeren?"
        />
      )} */}
      
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
      <Box>
      {/* <TextField
        // component="legend"
        // sx={{
        //   fontSize: "1rem",      // make this as big as you wan
        //   mb: 0.5,
        // }}
      >
        {label ?? "Welke biobased materialen worden toegepast?"}
      </TextField>  */}

      </Box>

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
            allowedValues={productTypes as unknown as string[]}
            fullWidth
          />
                    <NumField
            name="aantal"
            label="Oppervlakte element (m2)"
            decimal={false}
            fullWidth
          />

          <SelectField
            name="productType"
            label="Biobased product"
            allowedValues={productTypes as unknown as string[]}
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

