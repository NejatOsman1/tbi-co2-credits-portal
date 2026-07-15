import { Box, Button, Typography } from "@mui/material";


export function Resultaatvalidatie() {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>  
      <Typography sx={{ mt: 2, mb: 1, fontSize: "0.9rem" }}>
        Gefeliciteerd, wanneer u de email hebt verstuurd dan start de validatie process bij ONCRA. De berekeningen en bijlagen worden gecontroleerd en zij zullen met u contact opnemen in geval van vragen en de vervolgstappen.
      </Typography>
      <Typography sx={{ mt: 1, mb: 1, fontSize: "0.9rem" }}>
        U kunt hier meer informatie vinden over het proces: <a href="https://oncra.org/removers/" target="_blank" rel="noopener noreferrer">ONCRA</a>
      </Typography>
    </Box>
  );
}