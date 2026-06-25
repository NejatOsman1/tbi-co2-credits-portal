import { Box } from "@mui/material";
import { NumField } from "uniforms-mui";
import { useField } from "uniforms";

export function AantalField() {
  const [{ value: eenheid }] = useField<string>("eenheid", { initialValue: false });

  if (eenheid === "m3" || !eenheid) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <NumField name="aantalM" label="Dikte (m)" decimal={true} fullWidth />
        <NumField name="aantalM2" label="Oppervlakte (m²)" decimal={true} fullWidth />
      </Box>
    );
  }

  return <NumField name="aantal" label="Aantal" decimal={false} fullWidth />;
}
