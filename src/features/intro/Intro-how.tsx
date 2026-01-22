import React from "react";
import { Box, Button, Typography } from "@mui/material";

export function IntroHow({ onStart }: { onStart: () => void }) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* <Typography variant="body1" color="text.secondary">
        In enkele stappen verzamelen we projectinformatie en berekenen we een
        indicatie van de mogelijke gecertificeerde CO₂-credits op basis van
        biobased materiaalkeuzes.
      </Typography> */}

      <Typography variant="body1" color="text.secondary">
        De tool is opgebouwd uit verschillende stappen die aansluiten op de
        ontwerpfasen van een bouwproject.      
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Het is toepasbaar op zowel één individuele woning als op een volledig
        bouwproject. Afhankelijk van de gekozen invoer worden
        de resultaten per woning of op projectniveau weergegeven.
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Per stap staat hieronder uitgelegd wanneer deze kan worden gebruikt en hoe de output ingezet kan worden in het ontwerp-, aanbestedings- en realisatieproces:
      </Typography>

  <Box sx={{ ml: 1, mt: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      • <strong>Quickscan</strong>
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ ml: 1, mt: 0.5 }}
    >
      Vanaf schetsontwerp. Geeft snel inzicht in het CO₂-opslagpotentieel op basis
      van globale aannames. Resultaten en berekeningen zijn beschikbaar als PDF
      voor verkenningen en aanbestedingen.
    </Typography>
  </Box>

  <Box sx={{ ml: 1, mt: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      • <strong>Oncra input</strong>
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ ml: 1, mt: 0.5 }}
    >
      Vanaf voorlopig ontwerp. Materiaalkeuzes worden verder
      uitgewerkt en het aantal CO₂-credits wordt nauwkeurig berekend als input
      voor Oncra.
    </Typography>
  </Box>

  <Box sx={{ ml: 1, mt: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      • <strong>Projectvalidatie</strong>
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ ml: 1, mt: 0.5 }}
    >
      Bij definitief ontwerp. Ingevoerde data en berekeningen worden gecontroleerd
      en gevalideerd ter voorbereiding op certificering.
    </Typography>
  </Box>

  <Box sx={{ ml: 1, mt: 0.5 }}>
    <Typography variant="body2" color="text.secondary">
      • <strong>Publiceer project</strong>
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ ml: 1, mt: 0.5 }}
    >
      Na start van bouw. Gecertificeerde CO₂-credits kunnen worden gepubliceerd en,
      indien gewenst, aangeboden voor verkoop.
    </Typography>
  </Box>

      {/* <Box sx={{ display: "grid", gap: 1 }}>
        <Typography variant="body2">Wat je nodig hebt:</Typography>
        <Typography variant="body2" color="text.secondary">
          • Projectfase
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Vloeroppervlak en/of hoeveelheden
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Materiaalkeuzes per bouwelement
        </Typography>
      </Box> */}
    </Box>
  );
}

