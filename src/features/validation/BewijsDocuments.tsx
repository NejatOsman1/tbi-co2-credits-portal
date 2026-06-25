import { Box, Button, Typography, TextField, IconButton, Tooltip, Link, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "uniforms";
import { ThemeProvider } from "@mui/material/styles";
import { smallFormTheme } from "../../app/theme.js";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EmailIcon from "@mui/icons-material/Email";
import JSZip from "jszip";
import ExportProjectplanPdfButton, { generateProjectplanPdf } from "../../utils/exportProjectplanPDF.js"
type FileKey = "biomaterialen" | "bouwkundigRapport";

const biomaterialenOptions = [
  "Material lijst",
  "MPG rapport",
  "Building informamtion model (BIM)",
];

const buildingLifespanOptions = [
  "Bouwvergunning",
  "MPG rapport",
  "Anders",
];

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

  const [files, setFiles] = useState<Record<FileKey, File | null>>({ biomaterialen: null, bouwkundigRapport: null });
  const [rowFiles, setRowFiles] = useState<Record<number, File | null>>({});
  const [selectedBiomaterialen, setSelectedBiomaterialen] = useState<string>("");
  const [selectedBuildingLifespan, setSelectedBuildingLifespan] = useState<string>("");

  const handleFileChange = (key: FileKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFiles((prev) => ({ ...prev, [key]: selected }));
  };

  const handleRowFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setRowFiles((prev) => ({ ...prev, [index]: selected }));
  };

  const handleBiomaterialenChange = (e: SelectChangeEvent<string>) => {
    setSelectedBiomaterialen(e.target.value);
  };

  const handleBuildingLifespanChange = (e: SelectChangeEvent<string>) => {
    setSelectedBuildingLifespan(e.target.value);
  };

  const handleEmailAndDownload = async () => {
    const zip = new JSZip();
    const allFiles: File[] = [];

    // Generate and add projectplan PDF to ZIP
    const pdfBlob = generateProjectplanPdf(model);
    zip.file("projectplan-quickscan.pdf", pdfBlob);

    // Collect main document files
    if (files.biomaterialen) allFiles.push(files.biomaterialen);
    if (files.bouwkundigRapport) allFiles.push(files.bouwkundigRapport);

    // Collect row files
    Object.values(rowFiles).forEach((file) => {
      if (file) allFiles.push(file);
    });

    // Add files to ZIP
    for (const file of allFiles) {
      const arrayBuffer = await file.arrayBuffer();
      zip.file(file.name, arrayBuffer);
    }

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bewijsdocumenten.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Open email with prefilled content
    const allFileNames = ["projectplan-quickscan.pdf", ...allFiles.map((f) => f.name)];
    const subject = encodeURIComponent("TBI CO2 Credits - Certificering projectplan en bewijsdocumenten");
    const body = encodeURIComponent(
      `Beste Oncra,\n\nGraag willen wij ons project laten certificeren. Hierbij stuur ik de projectplan data en bijbehorende bewijsdocumenten voor het CO2 credits project.\n\nBijgevoegde documenten (${allFileNames.length} bestanden):\n${allFileNames.map((name) => "- " + name).join("\n")}\n\nDe documenten zijn gedownload als ZIP-bestand. Voeg het ZIP-bestand als bijlage toe aan deze email.\n\nMet vriendelijke groet`
    );
    window.location.href = `mailto:act@oncra.org?subject=${subject}&body=${body}`;
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
        Kies hieronder per categorie het type bewijsstuk en upload het document. Deze bewijsstukken dienen in ieder geval te worden ingediend voor oplevering van het project.
      </Typography>
      
      {/* Biomaterialen dropdown + upload */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="biomaterialen-label">Gebruikte biomaterialen</InputLabel>
          <Select
            labelId="biomaterialen-label"
            value={selectedBiomaterialen}
            label="Gebruikte biomaterialen"
            onChange={handleBiomaterialenChange}
          >
            {biomaterialenOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          component="label" 
          startIcon={<UploadFileIcon />} 
          sx={{ fontSize: "0.85rem", py: 1 }}
        >
          Upload
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange("biomaterialen")}
          />
        </Button>
        {files.biomaterialen && (
          <Typography sx={{ fontSize: "0.85rem" }}>
            {files.biomaterialen.name}
          </Typography>
        )}
      </Box>

      {/* Building lifespan dropdown + upload */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="building-lifespan-label">Gebouwgegevens</InputLabel>
          <Select
            labelId="building-lifespan-label"
            value={selectedBuildingLifespan}
            label="Gebouwgegevens"
            onChange={handleBuildingLifespanChange}
          >
            {buildingLifespanOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          component="label" 
          startIcon={<UploadFileIcon />} 
          sx={{ fontSize: "0.85rem", py: 1 }}
        >
          Upload
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange("bouwkundigRapport")}
          />
        </Button>
        {files.bouwkundigRapport && (
          <Typography sx={{ fontSize: "0.85rem" }}>
            {files.bouwkundigRapport.name}
          </Typography>
        )}
      </Box>


      <Typography variant="subtitle2" sx={{ mt: 2, fontSize: "0.9rem" }}>
        Plak in het "EPD-link" veld een link naar de Environment Product Declaration (EPD) pagina. Je kan hier zoeken op EPD's en de link toevoegen aan de tabel hieronder bij het product:{" "}
        <Link href="https://eco-portal.eco-platform.org/#epdtable" target="_blank" rel="noopener noreferrer">
          EPD database
        </Link>.
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: "0.9rem" }}>
        Indiend al beschikbaar in deze fase upload per biobased product hieronder de aankoopfacturen of soortgelijk bewijs.
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
      
      <Typography sx={{ mt: 3, mb: 1, fontSize: "0.9rem" }}>
        Gefeliciteerd, uw project is nu gereed om ingediend te worden bij ONCRA. Door op onderstaande Download & Email projectplan te klikken wordt voor u een email aangemaakt en de benodigde bewijsstukken als een zipbestand gedownload. Het zip bestand moet u toevoegen aan de email en vervolgens versturen.
      </Typography>

      <Typography sx={{ mt: 1, mb: 1, fontSize: "0.9rem" }}>
        U kunt eerst ook het projectplan exporteren naar pdf ter controle en vervolgens zelf indienen bij ONCRA. Klik hiervoor op de knop "Export projectplan naar PDF" hieronder.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}>
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          onClick={handleEmailAndDownload}
          sx={{ fontSize: "0.85rem", py: 1, minWidth: 260 }}
        >
          Download & E-mail Projectplan
        </Button>
        <ExportProjectplanPdfButton />
      </Box>
      
  </Box>
  );
}