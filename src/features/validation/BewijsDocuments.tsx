import { Box, Button, Typography, TextField, IconButton, Tooltip, Link } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "uniforms";
import { ThemeProvider } from "@mui/material/styles";
import { smallFormTheme } from "../../app/theme.js";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExportProjectplanPdfButton  from "../../utils/exportProjectplanPDF.js"
type FileKey = "mpgRapport" | "bouwkundigRapport";

export function BewijsDocuments() {
  const { model, onChange } = useForm<any>();
  const rows = model?.quickScan ?? [];
  const bewijsLinks: string[] = model?.bewijsLinks ?? [];

  const handleLinkChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...bewijsLinks];
    updated[index] = e.target.value;
    onChange("bewijsLinks", updated);
  };

  useEffect(() => {
    if (rows.length > 0 && bewijsLinks.length !== rows.length) {
      const initialized = rows.map((_: any, i: number) => bewijsLinks[i] ?? "");
      onChange("bewijsLinks", initialized);
    }
  }, [rows.length]);

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

  const buttons: { key: FileKey; label: string; tooltip: string; }[] = [
    { key: "mpgRapport", label: "MPG Rapport", tooltip: "Upload hier het MilieuPrestatie Gebouwen indien al beschikbaar" },
    { key: "bouwkundigRapport", label: "Bouwvergunning", tooltip: "Upload hier de bouwvergunning van de gemeente." },
  ];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
        Upload hieronder de benodigde bewijsstukken voor uw project.
      </Typography>
      {/* Upload buttons */}
      {buttons.map(({ key, label, tooltip }) => (
        <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip
            title={tooltip}
            arrow
            placement="top"
          >
            <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ fontSize: "0.85rem", py: 1, width: 200, justifyContent: "flex-start", }}>
              {label}

              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange(key)}
              />
            </Button>
          </Tooltip>


          {files[key] && (
            <Typography sx={{ mt: 1, fontSize: "0.85rem" }}>
              {files[key]!.name}
            </Typography>
          )}
        </Box>
      ))}


      <Typography variant="subtitle2" sx={{ mt: 2, fontSize: "0.9rem" }}>
        Plak in het "EPD-link" veld een link naar de Environment Product Declaration (EPD) pagina. Je kan hier zoeken op EPD's en de link toevoegen aan de tabel hieronder bij het product:{" "}
        <Link href="https://eco-portal.eco-platform.org/#epdtable" target="_blank" rel="noopener noreferrer">
          EPD database
        </Link>.
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: "0.9rem" }}>
        Upload per biobased product hieronder de aankoopfacturen of soortgelijk bewijs dat CO₂-vastlegging is gerealiseerd zoals berekend.
      </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr auto",
        gap: 0,
        px: 1,
      }}
    >
      {/* Header row */}
      <Box sx={{ display: "contents" }}>
        {["Fabrikant", "Productcategorie", "EPD-link", "Aankoopbewijs"].map((label) => (
          <Typography
            key={label}
            sx={{
              fontSize: "0.85rem",
              color: "text.secondary",
              py: 1,
              borderBottom: "2px solid",
              borderColor: "primary.main",
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Data rows */}
        {rows.map((row: any, i: number) => (
          <Box key={i} sx={{ display: "contents", "&:hover > *": { bgcolor: "grey.50" } }}>
            <Typography sx={{ fontSize: "0.85rem", py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              {row.fabrikant || "—"}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              {row.productCategory || "—"}
            </Typography>
            <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              <TextField
                name={`bewijsLinks.${i}`}
                size="small"
                placeholder="https://..."
                value={bewijsLinks[i] ?? ""}
                onChange={handleLinkChange(i)}
                sx={{ mr: 2 }}
              />
            </Box>


          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <IconButton component="label" color="primary" size="small">
              <UploadFileIcon sx={{ fontSize: "1.2rem" }} />
              <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleRowFileChange(i)} />
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
      <ExportProjectplanPdfButton></ExportProjectplanPdfButton>
      
  </Box>
  );
}