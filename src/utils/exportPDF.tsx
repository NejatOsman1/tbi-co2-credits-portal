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

type PdfMeta = {
  name: string;
  projectName: string;
  projectNumber: string;
};

const COLORS = {
  brandDark: [0, 102, 153] as const, // dark blue
  brandLight: [232, 243, 249] as const, // light blue banner
  textDark: [20, 40, 55] as const,
  grid: [210, 220, 230] as const,
  boxBg: [245, 248, 251] as const,
  helper: [90, 110, 125] as const,
};

function formatNl(value: any, digits = 2): string {
  if (value === "Onbekend") return "Onbekend";
  const n = Number(value);
  if (!Number.isFinite(n)) return "Onbekend";
  return n.toLocaleString("nl-NL", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function drawKpiCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string
) {
  doc.setDrawColor(...COLORS.grid);
  doc.setFillColor(...COLORS.boxBg);
  doc.roundedRect(x, y, w, h, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.helper);
  doc.setFontSize(9);
  doc.text(label, x + 6, y + 7.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textDark);
  doc.setFontSize(18);
  doc.text(value, x + 6, y + 18.5);
}

function splitTwoColumns(items: string[]) {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
}

const ExportProductenPdfButton: React.FC = () => {
  const { model } = useForm<any>();

  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<PdfMeta>({
    name: "",
    projectName: "",
    projectNumber: "",
  });

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
    const bouwFase = model.prescanFase2 || "Onbekend";

    const totaalOppervlakteRaw = model.aantalm22;
    const totaalOppervlakte =
      totaalOppervlakteRaw === undefined ||
        totaalOppervlakteRaw === null ||
        totaalOppervlakteRaw === ""
        ? "Onbekend"
        : totaalOppervlakteRaw;

    const date = new Date().toLocaleDateString("nl-NL");

    // First pass: table rows + total credits
    let totaalCO2credits = 0;

    const tableData = producten.map((item: any, index: number) => {
      const eenheid =
        item.eenheid ?? computeCO2Equivalent(item.elements, item.productTypes, item.aantal);

      const n = Number(eenheid);
      if (Number.isFinite(n)) totaalCO2credits += n;

      return [
        String(index + 1),
        item.elements || "-",
        item.aantal ?? "-",
        item.productType || "-",
        Number.isFinite(n) ? n : (eenheid ?? ""),
      ];
    });

    const totaalOppervlakteNum = Number(totaalOppervlakte);
    const CO2Creditsperm2 =
      Number.isFinite(totaalOppervlakteNum) && totaalOppervlakteNum > 0
        ? (totaalCO2credits / totaalOppervlakteNum) * 1000
        : "Onbekend";

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const marginX = 14;

    const fullTableW = pageW - marginX * 2;

    // --- Header banner ---
    doc.setFillColor(...COLORS.brandLight);
    doc.rect(0, 0, pageW, 28, "F");

    doc.setFillColor(...COLORS.brandDark);
    doc.rect(0, 0, 8, 28, "F");

    doc.setTextColor(...COLORS.textDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Overzicht CO2 opslag potentie", marginX, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.helper);
    doc.text("CO2 Credits Quickscan", marginX, 22);

    // --- Meta grid ---
    const metaRows = [
      ["Naam", pdfMeta.name || "-", "Datum", date],
      ["Projectnaam", pdfMeta.projectName || "-", "Fase", bouwFase || "-"],
      [
        "Projectnummer",
        pdfMeta.projectNumber || "-",
        "Vloeroppervlakte",
        `${totaalOppervlakte} m²`,
      ],
    ];

    autoTable(doc, {
      startY: 34,
      theme: "grid",
      margin: { left: marginX, right: marginX },
      tableWidth: fullTableW,
      body: metaRows,
      styles: {
        fontSize: 9,
        cellPadding: 2.2,
        lineColor: COLORS.grid as any,
        lineWidth: 0.2,
        textColor: COLORS.textDark as any,
      },

      columnStyles: {
        0: { cellWidth: 32, fontStyle: "bold", textColor: COLORS.helper as any },
        1: { cellWidth: "auto" },
        2: { cellWidth: 32, fontStyle: "bold", textColor: COLORS.helper as any },
        3: { cellWidth: "auto" },
      },
    });

    const afterMetaY = (doc as any).lastAutoTable?.finalY ?? 52;

    // --- KPI cards ---
    const kpiY = afterMetaY + 6;
    const kpiW = (pageW - marginX * 2 - 8) / 2;
    drawKpiCard(doc, marginX, kpiY, kpiW, 22, "Totaal CO2 credits", formatNl(totaalCO2credits, 0));
    drawKpiCard(
      doc,
      marginX + kpiW + 8,
      kpiY,
      kpiW,
      22,
      "Kg CO2 opslag per m² BVO",
      formatNl(CO2Creditsperm2, 2)
    );

    // If nothing filled
    if (!producten.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.textDark);
      doc.text("Geen materialen ingevuld.", marginX, kpiY + 34);
      doc.save("biobased-materialen.pdf");
      return;
    }

    // --- Main table ---
    const tableStartY = kpiY + 30;


    autoTable(doc, {
      startY: tableStartY,
      margin: { left: marginX, right: marginX },
      tableWidth: fullTableW,
      head: [["Nr.", "Element", "Oppervlakte", "Biobased materiaal", "CO2 credits"]],
      body: tableData.map((r) => [
        r[0],
        r[1],
        r[2] === "-" ? "-" : `${r[2]} m²`,
        r[3],
        typeof r[4] === "number" ? formatNl(r[4], 0) : (r[4] ?? ""),
      ]),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2.2,
        lineColor: COLORS.grid as any,
        lineWidth: 0.2,
        textColor: COLORS.textDark as any,
      },
      headStyles: {
        fillColor: COLORS.brandDark as any,
        textColor: 255,
        fontStyle: "bold",
      },

      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 26, halign: "right" },
        3: { cellWidth: "auto" },
        4: { cellWidth: 26, halign: "right" },
      },
    });

    let y = ((doc as any).lastAutoTable?.finalY ?? tableStartY) + 8;

    // --- Assumptions (boxed 2 columns) ---
    const aannames = [
      "Voor de HSB dakelementen wordt er uitgegaan van een dikte van 0,32 m.",
      "Voor de HSB dakelementen wordt er uitgegaan van een oppervlakte van 9% van het totaal oppervlak.",
      "Voor de HSB binnenspouwblad wordt er uitgegaan van een dikte van 0,0254 m.",
      "Voor de HSB binnenspouwblad wordt er uitgegaan van oppervlakte van 18% van het totaal oppervlak.",
      "Voor het binnenspouwblad wordt er uitgegaan van OSB-plaat van 18 mm.",
      "Voor het dak wordt er uitgegaan van binnen spaanplaat van 18 mm en buiten spaanplaat van 11 mm.",
      "Voor het HSB wordt er uitgegaan van naaldhout biogene CO2 opslag van 618 kg CO2/m³.",
      "Voor het dak wordt er uitgegaan van bioblow stro biogene CO2 opslag van 775 kg CO2/m³.",
      "Voor de muren wordt er uitgegaan van GUTEX Thermoflex biogene CO2 opslag van 198 kg CO2/m³.",
      "Voor de spaanplaten wordt er uitgegaan van Unilin spaanplaten biogene CO2 opslag van 1051,7 kg CO2/m³.",
      "Aantal CO2 credits wordt berekend als: oppervlakte element × dikte × biogene CO2 opslag toegepast product.",
    ];

    // Keep assumptions from going beyond page
    const minSpaceNeeded = 55;
    if (y + minSpaceNeeded > pageH - 16) {
      doc.addPage();
      y = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Aannames voor de berekening", marginX, y);
    y += 3;

    const [left, right] = splitTwoColumns(aannames);
    const leftText = left.map((s) => `• ${s}`).join("\n");
    const rightText = right.map((s) => `• ${s}`).join("\n");

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      theme: "grid",
      body: [[leftText, rightText]],
      styles: {
        fontSize: 8.5,
        cellPadding: 4,
        valign: "top",
        fillColor: COLORS.boxBg as any,
        lineColor: COLORS.grid as any,
        lineWidth: 0.2,
        textColor: COLORS.textDark as any,
      },
      columnStyles: {
        0: { cellWidth: fullTableW / 2 },
        1: { cellWidth: fullTableW / 2 },
      },
    });

    // --- Footer ---
    const footerY = pageH - 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 135, 150);

    const leftFooter = `${pdfMeta.projectNumber || "-"}  |  ${pdfMeta.projectName || "-"}`;
    doc.text(leftFooter, marginX, footerY);

    const pageLabel = `Pagina 1`;
    doc.text(pageLabel, pageW - marginX - doc.getTextWidth(pageLabel), footerY);

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
              helperText={errors.name}
              autoFocus
              fullWidth
            />
            <TextField
              label="Projectnaam"
              value={meta.projectName}
              onChange={(e) => setMeta((m) => ({ ...m, projectName: e.target.value }))}
              helperText={errors.projectName}
              fullWidth
            />
            <TextField
              label="Projectnummer"
              value={meta.projectNumber}
              onChange={(e) => setMeta((m) => ({ ...m, projectNumber: e.target.value }))}
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
