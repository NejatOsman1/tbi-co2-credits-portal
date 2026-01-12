import React from "react";
import { Box, Button, Typography } from "@mui/material";

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>

      {/* <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Welkom bij de CO₂ Credits QuickScan
      </Typography> */}
      <Typography variant="body1" color="text.secondary" fontWeight={600}>
        Welkom bij de CO₂ Credits QuickScan. 
      </Typography>
      
      <Typography variant="body1" color="text.secondary">         
        Met deze tool leg je vast hoeveel CO₂ in jouw project wordt opgeslagen door het toepassen van biobased materialen.
      </Typography>

      <Typography variant="body1" color="text.secondary">         
        Deze CO₂-vastlegging wordt uiteindelijk geregistreerd en gecertificeerd, zodat de impact van jouw project aantoonbaar en verifieerbaar is.
      </Typography>

      <Box sx={{ display: "grid", gap: 1.5 }}>
        <Typography variant="body1" color="text.secondary" fontWeight={600}>
          Waarom is dit belangrijk?
        </Typography>

        <Box sx={{ ml: 1, mt: 0.5 }}>
          <Typography variant="body1" color="text.secondary">
            • Sterke onderbouwing richting opdrachtgevers en stakeholders:
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ ml: 1, mt: 0.5 }}
          >
            Gecertificeerde CO₂-vastlegging versterkt aanbestedingen, business cases en rapportages
            en externe verantwoording.
          </Typography>
        </Box>

        <Box sx={{ ml: 1, mt: 0.5 }}>
          <Typography variant="body1" color="text.secondary">
            • Betere keuzes in een vroege fase:
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ ml: 1, mt: 0.5 }}
          >
            Je krijgt snel inzicht in waar biobased oplossingen de meeste impact
            hebben, zonder dat alles al tot in detail is uitgewerkt.
          </Typography>
        </Box>
                <Box sx={{ ml: 1, mt: 0.5 }}>
          <Typography variant="body1" color="text.secondary">
            • Inzicht in bijdrage aan TBI-doelen:
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ ml: 1, mt: 0.5 }}
          >
            Je ziet direct welke CO₂-impact jouw project maakt en hoe dit bijdraagt
            aan de duurzaamheidsambities van TBI.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
