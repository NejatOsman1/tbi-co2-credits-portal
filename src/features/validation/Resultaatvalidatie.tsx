import { Box, Button, Typography } from "@mui/material";


export function Resultaatvalidatie() {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>  
      <Typography sx={{ mt: 3, mb: 1, fontSize: "0.9rem" }}>
        Gefeliciteerd, uw project is nu gereed om ingediend te worden bij ONCRA. Door op onderstaande Download & Email projectplan te klikken wordt voor u een email aangemaakt en de benodigde bewijsstukken als een zipbestand gedownload. Het zip bestand moet u toevoegen aan de email en vervolgens versturen.
      </Typography>

      <Typography sx={{ mt: 1, mb: 1, fontSize: "0.9rem" }}>
        U kunt eerst ook het projectplan exporteren naar pdf ter controle en vervolgens zelf indienen bij ONCRA. Klik hiervoor op de knop "Export projectplan naar PDF" hieronder.
      </Typography>
    </Box>
  );
}