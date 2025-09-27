import { Box, Typography } from "@mui/material";
import type { FormModel } from "@/forms/types";

export function Review({ model }: { model: FormModel }) {
  const entries = Object.entries(model || {});
  if (!entries.length) return <Typography color="text.secondary">Geen gegevens om te tonen.</Typography>;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
      {entries.map(([k, v]) => (
        <Box
          key={k}
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {k}
          </Typography>
          <Typography variant="body1">
            {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
