import { Box, Typography } from "@mui/material";
import { ListField, NestField, NumField, ListDelField, TextField } from "uniforms-mui";
import { useField, useForm } from "uniforms";
import { calcTotalTonCO2e, formatTonCO2e } from "../../utils/calculateCO2";
import { FabrikantField } from "./fields/FabrikantField";
import { ProductCategoryField } from "./fields/ProductCategoryField";
import { AutoEenheidField } from "./fields/UnitField";
import { smallFormTheme } from "../../app/theme.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export function QuickScanFields() {
  const { model } = useForm<any>();
  const [{ value: rows = [] }] = useField("quickScan", { initialValue: false });

  const floorSize: number | undefined = model?.aantalm22;

  const totalTon = calcTotalTonCO2e(rows, floorSize);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Op basis van het gebruik van de bio based materialen krijgt u snel inzicht in het aantal CO2 credits die u kunt genereren voor uw project.
      </Typography>
      <ThemeProvider theme={smallFormTheme}>
            <ListField name="quickScan" label="">
              <NestField name="$" label="">
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1.1fr 1fr 1fr 1fr 1fr auto" }, // ✅ 6 cols
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  {/* ✅ NEW read-only column */}
                  <TextField
                    name="element"
                    label="Element"
                    fullWidth
                    disabled
                    InputProps={{ readOnly: true }}
                  />

                  <FabrikantField />
                  <ProductCategoryField />
                  <NumField name="aantal" label="Aantal" decimal={false} fullWidth />
                  <AutoEenheidField />

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <ListDelField name="" />
                  </Box>
                </Box>
              </NestField>
            </ListField> 
      </ThemeProvider>


      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "grey.100",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Totaal t CO₂e
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} color="success.main">
          {formatTonCO2e(totalTon)}
        </Typography>
      </Box>
    </Box>
  );
}
