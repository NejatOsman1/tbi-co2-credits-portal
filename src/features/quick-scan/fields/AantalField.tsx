import { Box, Tooltip } from "@mui/material";
import { NumField } from "uniforms-mui";
import { useField } from "uniforms";

export function AantalField() {
  const [{ value: eenheid }] = useField<string>("eenheid", { initialValue: false });

  if (eenheid === "m3" || !eenheid) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Voer hier de dikte van het gebruikte materiaal in" arrow placement="top">
          <Box>
            <NumField name="aantalM" label="Dikte (m)" decimal={true} sx={{ minWidth: 120 }} />
          </Box>
        </Tooltip>
        <Tooltip title="Voer hier de totaal gebruikte oppervlakte van het materiaal in." arrow placement="top">
          <Box>
            <NumField name="aantalM2" label="Oppervlakte (m²)" decimal={true} sx={{ minWidth: 120 }} />
          </Box>
        </Tooltip>
      </Box>
    );
  }

  return <NumField name="aantal" label="Aantal" decimal={false} fullWidth />;
}
