import { Box, Button, Typography, TextField, IconButton, Tooltip, Link, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "uniforms";
import { ThemeProvider } from "@mui/material/styles";
import { smallFormTheme } from "../../app/theme.js";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import ExportProjectplanPdfButton from "../../utils/exportProjectplanPDF.js";
import { handleEmailAndDownload } from "../../utils/handleEmailAndDownload.js"
type FileKey = "biomaterialen" | "bouwkundigRapport" | "mpgRapport" | "duurzaamHout";

const biomaterialenOptions = [
  "Materiaal lijst",
  "MPG rapport",
  "Building informamtion model (BIM)",
];

const buildingLifespanOptions = [
  "MPG rapport",
  "Anders",
];

const buildingpermitOptions = [
  "Bouwvergunning",
  "Anders",
];

const duurzaamHoutOptions = [
  "FSC certificaat",
  "PEFC certificaat",
  "Chain of Custody (CoC) certificaat",
];

interface DocumentUploadRowProps {
  labelId: string;
  label: string;
  options: string[];
  selectedValue: string;
  onSelectChange: (e: SelectChangeEvent<string>) => void;
  fileKey: FileKey;
  uploadedFiles: File[];
  onFileChange: (key: FileKey) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (key: FileKey, index: number) => void;
}

function DocumentUploadRow({
  labelId,
  label,
  options,
  selectedValue,
  onSelectChange,
  fileKey,
  uploadedFiles,
  onFileChange,
  onRemoveFile,
}: DocumentUploadRowProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 240 }}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          value={selectedValue}
          label={label}
          onChange={onSelectChange}
        >
          {options.map((option) => (
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
          multiple
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={onFileChange(fileKey)}
        />
      </Button>
      {uploadedFiles.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {uploadedFiles.map((file, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: "0.85rem" }}>{file.name}</Typography>
              <IconButton size="small" onClick={() => onRemoveFile(fileKey, idx)}>
                <CloseIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}



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

  const [files, setFiles] = useState<Record<FileKey, File[]>>({ biomaterialen: [], mpgRapport: [], bouwkundigRapport: [], duurzaamHout: [] });
  const [rowFiles, setRowFiles] = useState<Record<number, File | null>>({});
  const [selectedBiomaterialen, setSelectedBiomaterialen] = useState<string>("");
  const [selectedBuildingLifespan, setSelectedBuildingLifespan] = useState<string>("");  
  const [selectedBuildingPermit, setSelectedBuildingPermit] = useState<string>("");
  const [selectedDuurzaamHout, setSelectedDuurzaamHout] = useState<string>("");

  const handleFileChange = (key: FileKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => ({ ...prev, [key]: [...prev[key], ...selected] }));
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleRemoveFile = (key: FileKey, index: number) => {
    setFiles((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
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

  const handleBuildingPermitChange = (e: SelectChangeEvent<string>) => {
    setSelectedBuildingPermit(e.target.value);
  };

  const handleDuurzaamHoutChange = (e: SelectChangeEvent<string>) => {
  setSelectedDuurzaamHout(e.target.value);
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
        Kies hieronder per categorie het type bewijsstuk en upload het document. Deze bewijsstukken dienen in ieder geval te worden ingediend voor oplevering van het project.
      </Typography>
      
      <DocumentUploadRow
        labelId="biomaterialen-label"
        label="Gebruikte biomaterialen"
        options={biomaterialenOptions}
        selectedValue={selectedBiomaterialen}
        onSelectChange={handleBiomaterialenChange}
        fileKey="biomaterialen"
        uploadedFiles={files.biomaterialen}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
      />

      <DocumentUploadRow
        labelId="milieu-impact-label"
        label="Milieu impact"
        options={buildingLifespanOptions}
        selectedValue={selectedBuildingLifespan}
        onSelectChange={handleBuildingLifespanChange}
        fileKey="mpgRapport"
        uploadedFiles={files.mpgRapport}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
      />

      <DocumentUploadRow
        labelId="gebouwgegevens-label"
        label="Gebouwgegevens"
        options={buildingpermitOptions}
        selectedValue={selectedBuildingPermit}
        onSelectChange={handleBuildingPermitChange}
        fileKey="bouwkundigRapport"
        uploadedFiles={files.bouwkundigRapport}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
      />

      <DocumentUploadRow
        labelId="duurzaam-hout-label"
        label="Bewijs duurzaam hout"
        options={duurzaamHoutOptions}
        selectedValue={selectedDuurzaamHout}
        onSelectChange={handleDuurzaamHoutChange}
        fileKey="duurzaamHout"
        uploadedFiles={files.duurzaamHout}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
      />


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
          onClick={() => handleEmailAndDownload({ model, files, rowFiles })}
          sx={{ fontSize: "0.85rem", py: 1, minWidth: 260 }}
        >
          Download & E-mail Projectplan
        </Button>
        <ExportProjectplanPdfButton />
      </Box>
      
  </Box>
  );
}