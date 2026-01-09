import React from "react";
import { Box, Button, Typography } from "@mui/material";

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Welkom bij de CO₂ Credits QuickScan
      </Typography>

      <Typography variant="body1" color="text.secondary">
        In een paar stappen verzamelen we projectinformatie en berekenen we een indicatie van mogelijke CO₂-credits
        op basis van biobased materiaalkeuzes.
      </Typography>

      <Box sx={{ display: "grid", gap: 1 }}>
        <Typography variant="body2">Wat je nodig hebt:</Typography>
        <Typography variant="body2" color="text.secondary">• Projectfase</Typography>
        <Typography variant="body2" color="text.secondary">• Vloeroppervlak / hoeveelheden</Typography>
        <Typography variant="body2" color="text.secondary">• Materiaalkeuzes per element</Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={onStart}>
          Start
        </Button>
      </Box>
    </Box>
  );
}
