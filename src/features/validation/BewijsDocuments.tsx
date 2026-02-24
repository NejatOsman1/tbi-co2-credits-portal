import { Box, Button, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { useForm } from "uniforms";
import { ThemeProvider } from "@mui/material/styles";
import { smallFormTheme } from "../../app/theme.js";
import UploadFileIcon from "@mui/icons-material/UploadFile";

type FileKey = "mpgRapport" | "bouwkundigRapport";

export function BewijsDocuments() {
  const { model } = useForm<any>();
  const rows = model?.quickScan ?? [];

  const [files, setFiles] = useState<Record<FileKey, File | null>>({ mpgRapport: null, bouwkundigRapport: null });
  const [rowFiles, setRowFiles] = useState<Record<number, File | null>>({});

  const handleFileChange = (key: FileKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFiles((prev) => ({ ...prev, [key]: selected }));
  };

  const handleRowFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setRowFiles((prev) => ({ ...prev, [index]: selected }));
  };

  const buttons: { key: FileKey; label: string }[] = [
    { key: "mpgRapport", label: "MPG Rapport" },
    { key: "bouwkundigRapport", label: "Bouwvergunning" },
  ];

  return (

      <Box sx={{ display: "grid", gap: 2 }}>

        {/* Upload buttons */}
        {buttons.map(({ key, label }) => (
          <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button variant="contained" component="label" sx={{ fontSize: "0.85rem", py: 1, width: 200 }}>
              {label}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange(key)}
              />
            </Button>

            {files[key] && (
              <Typography sx={{ mt: 1, fontSize: "0.85rem" }}>
                {files[key]!.name}
              </Typography>
            )}
          </Box>
        ))}

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontSize: "0.9rem" }}>
          Upload bewijs per product
        </Typography>

        {/* Header row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: 2,
            px: 1,
            pb: 1,
            borderBottom: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <Typography sx={{ fontSize: "0.85rem" }}>
            Fabrikant
          </Typography>
        <Typography sx={{  fontSize: "0.85rem" }}>
            Productcategorie
          </Typography>
          <Typography sx={{ fontSize: "0.85rem" }}>
            EPD nummer
          </Typography>
          <Typography sx={{ fontSize: "0.85rem" }}>
            Bewijs
          </Typography>
        </Box>

        {/* Data rows */}
        {rows.map((row: any, i: number) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: 2,
              alignItems: "center",
              px: 1,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:hover": { bgcolor: "grey.50" },
            }}
          >
            <Typography sx={{ fontSize: "0.85rem" }}>
              {row.fabrikant || "—"}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem" }}>
              {row.productCategory || "—"}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem" }}>
              {row.epdNummer || "—"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton component="label" color="primary" size="small">
                <UploadFileIcon sx={{ fontSize: "1.2rem" }} />
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleRowFileChange(i)}
                />
              </IconButton>

              {rowFiles[i] && (
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  {rowFiles[i]!.name}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
  
  );
}