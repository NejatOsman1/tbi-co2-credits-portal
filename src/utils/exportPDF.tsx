import React, { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "uniforms";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { computeCO2Equivalent } from "./calculateCO2V2.js";
import { CurrencyBitcoin } from "@mui/icons-material";

type PdfMeta = {
  name: string;
  projectName: string;
  projectNumber: string;
};

const ExportProductenPdfButton: React.FC = () => {
  const { model } = useForm<any>();

  // Dialog state
  const [open, setOpen] = useState(false);

  // Form state for dialog inputs
  const [meta, setMeta] = useState<PdfMeta>({
    name: "",
    projectName: "",
    projectNumber: "",
  });

  // Simple validation
  const errors = useMemo(() => {
    const e: Partial<Record<keyof PdfMeta, string>> = {};
    if (!meta.name.trim()) e.name = "Naam is verplicht";
    if (!meta.projectName.trim()) e.projectName = "Projectnaam is verplicht";
    if (!meta.projectNumber.trim()) e.projectNumber = "Projectnummer is verplicht";
    return e;
  }, [meta]);

  const canGenerate = Object.keys(errors).length === 0;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const generatePdf = (pdfMeta: PdfMeta) => {
    const producten = model.structuralElements || [];
    const totaalOppervlakteRaw = model.aantalm22;
    const bouwFase = model.prescanFase2 || "Onbekend";
    const date = new Date().toLocaleDateString();
    const totaalOppervlakte =
      totaalOppervlakteRaw === undefined || totaalOppervlakteRaw === null || totaalOppervlakteRaw === ""
        ? "Onbekend"
        : totaalOppervlakteRaw;

    let totaalCO2credits = 0;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(99, 13, 128);
    doc.text("Overzicht CO2 opslag potentie", 14, 20);

    // Header meta block
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    

    doc.text(`Naam: ${pdfMeta.name}`, 14, 30);
    doc.text(`Projectnaam: ${pdfMeta.projectName}`, 14, 35);
    doc.text(`Projectnummer: ${pdfMeta.projectNumber}`, 14, 40);
    doc.text(`Datum: ${date}`, 14, 45);

    doc.text(`Fase bouwproject: ${bouwFase}`, 14, 50);
    doc.text(`Totaal vloeroppervlakte project: ${totaalOppervlakte} m²`, 14, 55);

    if (!producten.length) {
      doc.setFontSize(12);
      doc.text("Geen materialen ingevuld.", 14, 70);
      doc.save("biobased-materialen.pdf");
      return;
    }

    // Prepare table data
    const tableData = producten.map((item: any, index: number) => {
      const eenheid = item.eenheid ?? computeCO2Equivalent(item.elements, item.productType, item.aantal);
      if (eenheid !== undefined && eenheid !== null && eenheid !== "") {
        const n = Number(eenheid);
        if (!Number.isNaN(n)) totaalCO2credits += n;
      }

      return [
        index + 1,
        item.elements || "-",
        item.aantal ?? "-",
        item.productType || "-",
        eenheid === "" ? "" : eenheid,
      ];
    });    

    const totaalOppervlakteNum = Number(totaalOppervlakte);
    const CO2Creditsperm2 =
      Number.isFinite(totaalOppervlakteNum) && totaalOppervlakteNum > 0
        ? ((totaalCO2credits / totaalOppervlakteNum) * 1000).toFixed(2)
        : "Onbekend";

    // Table
    autoTable(doc, {
      head: [["", "Element", "Oppervlakte element", "Biobased materiaal", "CO2 credits"]],
      body: tableData,
      startY: 65,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 13, 128], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
      },
      margin: { top: 40, left: 14, right: 14 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? 65;

    let newline = finalY
    function getNextline(lineOffset: number): number {
      newline += lineOffset
      return newline;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Voor de berekening worden de volgende aannames gehanteerd:", 14, getNextline(15));
    doc.text("- Voor de HSB dakelementen wordt er uitgegaan van een dikte van 0,32m", 18, getNextline(10));
    doc.text("- Voor de HSB dakelementen wordt er uitgegaan van een oppervlakte van 9% van het totaal oppervlak", 18, getNextline(5));
    doc.text("- Voor de HSB binnenspouwblad wordt er uitgegaan van een dikte van 0,0254m", 18, getNextline(5));
    doc.text("- Voor de HSB binnenspouwblad wordt er uitgegaan van oppervlakte van 18% van het totaal oppervlak", 18, getNextline(5));
    doc.text("- Voor het binnenspouwblad wordt er uitgegaan van OSB-plaat van 18mm", 18, getNextline(5));
    doc.text("- Voor het dak wordt er uitgegaan van binnen spaanplaat van 18mm en buiten spaanplaat van 11mm", 18, getNextline(5));

    
    doc.text("- Voor het HSB wordt er uitgegaan van naaldhout biogeen CO2 opslag van 618 kg CO2/m3", 18, getNextline(5));
    //  doc.setFontSize(6);
    //  doc.text("1", 20, getNextline(0));
     doc.setFontSize(11);
    doc.text("- Voor het dak wordt er uitgegaan van bioblow stro met biogeen CO2 opslag van 775 kg CO2/m3", 18, getNextline(5));
    doc.text("- Voor de muren wordt er uitgegaan van GUTEX Thermoflex met biogeen CO2 opslag van 198 kg CO2/m3", 18, getNextline(5));
    doc.text("- Voor de spaanplaten wordt er uitgegaan van Unilin spaanplaten met biogeen CO2 opslag van", 18, getNextline(5));
    doc.text("1051.7 kg CO2/m3", 20, getNextline(5));
    doc.text("- Aantal CO2 credits wordt berekened oppervlakte element * dikte * biogeen CO2 opslag toegepast product", 18, getNextline(5));

    doc.setFont("helvetica", "bold");


    doc.text(`Totaal aantal CO2 credits: ${totaalCO2credits}`, 14, getNextline(15));
    doc.text(`Kg CO2 opslag per m² BVO : ${CO2Creditsperm2}`, 14, getNextline(5));
// https://unilin.showpad.com/share/fSnQZUVXs10cC0z5ZXFk5
// https://www.mrpi.nl/epd-files/epd/1.1.00756.2025%20PDF_Template_V9_NL.ondertekend%20FvdB%20en%20LO.pdf
// hout
    doc.save("biobased-materialen.pdf");
  };

  const handleConfirmGenerate = () => {
    if (!canGenerate) return;
    setOpen(false);
    generatePdf(meta);
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={handleOpen} sx={{ mt: 2 }}>
        Export naar PDF
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>PDF export gegevens</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Vul deze gegevens in. Ze worden meegenomen in de PDF.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Naam"
              value={meta.name}
              onChange={(e) => setMeta((m) => ({ ...m, name: e.target.value }))}
              // error={!!errors.name}
              helperText={errors.name}
              autoFocus
              fullWidth
            />
            <TextField
              label="Projectnaam"
              value={meta.projectName}
              onChange={(e) => setMeta((m) => ({ ...m, projectName: e.target.value }))}
             // error={!!errors.projectName}
              helperText={errors.projectName}
              fullWidth
            />
            <TextField
              label="Projectnummer"
              value={meta.projectNumber}
              onChange={(e) => setMeta((m) => ({ ...m, projectNumber: e.target.value }))}
              // error={!!errors.projectNumber}
              helperText={errors.projectNumber}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Annuleren</Button>
          <Button variant="contained" onClick={handleConfirmGenerate} disabled={!canGenerate}>
            Genereer PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportProductenPdfButton;
