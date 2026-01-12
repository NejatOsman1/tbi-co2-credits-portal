import React from "react";
import { Box, Button, Typography } from "@mui/material";

export function IntroHow({ onStart }: { onStart: () => void }) {
    return (
    <Box sx={{ display: "grid", gap: 2 }}>

      <Typography variant="body1" color="text.secondary">
        In een paar stappen verzamelen we projectinformatie en berekenen we een indicatie van mogelijke CO₂-credits
        op basis van biobased materiaalkeuzes.
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Deze tool kan vanaf schetsonwerpVanaf schestontwerp
        Quickscan :vanaf schetsontwerp. krijg inzicht gebruik in aanbestedingen
        Oncra input :vanaf schestontwerp. 
        Project validatie : definitief ontwerp 
        
      </Typography>

      <Box sx={{ display: "grid", gap: 1 }}>
        <Typography variant="body2">Wat je nodig hebt:</Typography>
        <Typography variant="body2" color="text.secondary">• Projectfase</Typography>
        <Typography variant="body2" color="text.secondary">• Vloeroppervlak / hoeveelheden</Typography>
        <Typography variant="body2" color="text.secondary">• Materiaalkeuzes per element</Typography>
      </Box>

    </Box>
  );
}
