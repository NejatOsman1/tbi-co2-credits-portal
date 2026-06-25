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
import { getCarbonForRow, getQuantityForRow, calcTonCO2e, calcTotalTonCO2e, formatTonCO2e } from "./calculateCO2.js";

const COLORS = {
  brandDark: [99, 13, 128] as const,
  brandLight: [220, 200, 235] as const,
  textDark: [20, 40, 55] as const,
  grid: [210, 220, 230] as const,
  boxBg: [245, 248, 251] as const,
  helper: [90, 110, 125] as const,
};

export const generateProjectplanPdf = (model: any): Blob => {
  const bewijsLinks: string[] = model.bewijsLinks || [];
  const quickScan = model.quickScan || [];
  const date = new Date().toLocaleDateString("nl-NL");

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
  doc.text("Projectplan Overzicht", marginX, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textDark);
  doc.text("Oncra Project Design Document", marginX, 22);

  // --- Meta grid ---
  const vloeroppervlak = model.projectplanVloeroppervlak ?? "Onbekend";

  const metaRows = [
    ["Naam", model.projectplanNaam || "-", "Datum", date],
    ["Projectnaam", model.projectplanTitel || "-", "Fase", model.projectplanBouwfase || "-"],
    ["Projectnummer", model.projectplanProjectnummer || "-", "Vloeroppervlakte", `${vloeroppervlak} m²`],
    ["Email", model.projectplanEmail || "-", "KVK-nummer", model.projectplanKvkNummer || "-"],
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

  // --- Projectbeschrijving box ---
  const beschrijving = model.projectplanBeschrijving || "";
  let afterBeschrijvingY = afterMetaY;

  if (beschrijving) {
    const boxStartY = afterMetaY + 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Projectbeschrijving", marginX, boxStartY);

    const boxTopY = boxStartY + 3;
    const boxPadding = 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textDark);

    const wrappedLines = doc.splitTextToSize(beschrijving, fullTableW - boxPadding * 2);
    const lineHeight = 4.5;
    const textBlockH = wrappedLines.length * lineHeight;
    const boxH = textBlockH + boxPadding * 2;

    doc.setFillColor(...COLORS.boxBg);
    doc.setDrawColor(...COLORS.grid);
    doc.setLineWidth(0.2);
    doc.roundedRect(marginX, boxTopY, fullTableW, boxH, 2, 2, "FD");

    doc.text(wrappedLines, marginX + boxPadding, boxTopY + boxPadding + 3);

    afterBeschrijvingY = boxTopY + boxH;
  }

  // --- Quickscan table ---
  if (!quickScan.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Geen quickscan gegevens ingevuld.", marginX, afterBeschrijvingY + 12);
    return doc.output("blob");
  }

  const tableStartY = afterBeschrijvingY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textDark);
  doc.text("Quickscan materialen", marginX, tableStartY);

  const floorSize: number = model.aantalm22 ?? 0;

  const tableData = quickScan.map((row: any, i: number) => {
    let hoeveelheid: number | null = null;
    if (row.eenheid === "m3") {
      const m = typeof row.aantalM === "number" ? row.aantalM : 0;
      const m2 = typeof row.aantalM2 === "number" ? row.aantalM2 : 0;
      hoeveelheid = m * m2;
    } else {
      hoeveelheid = row.aantal;
    }

    // Calculate CO2 for this row (negate to show positive value for CO2 storage)
    const carbon = getCarbonForRow(row);
    const qty = getQuantityForRow(row);
    const co2Value = typeof carbon === "number" ? -calcTonCO2e(carbon, qty, floorSize) : null;

    return [
      String(i + 1),
      row.fabrikant || "-",
      row.productCategory || "-",
      hoeveelheid != null && hoeveelheid > 0 ? `${hoeveelheid}` : "-",
      row.eenheid ?? "-",
      co2Value != null ? formatTonCO2e(co2Value) : "-",
      bewijsLinks[i] || "-",
    ];
  });

  // Calculate total CO2 (includes baseline calculation)
  const totalCO2 = calcTotalTonCO2e(quickScan, floorSize);

  // Calculate sum of row CO2 values (for display purposes)
  const sumRowCO2 = quickScan.reduce((sum: number, row: any) => {
    const carbon = getCarbonForRow(row);
    const qty = getQuantityForRow(row);
    if (typeof carbon === "number") {
      sum += -calcTonCO2e(carbon, qty, floorSize);
    }
    return sum;
  }, 0);

  // Baseline calculation
  const baseline = floorSize * 0.001 * 10;

  autoTable(doc, {
    startY: tableStartY + 4,
    margin: { left: marginX, right: marginX },
    tableWidth: fullTableW,
    head: [["Nr.", "Fabrikant", "Productcategorie", "Hoeveelheid", "Eenheid", "ton CO2e", "EPD-link"]],
    body: tableData,
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
      2: { cellWidth: "auto" },
      3: { cellWidth: 22, halign: "right" },
      4: { cellWidth: 18, halign: "right" },
      5: { cellWidth: 22, halign: "right" },
      6: { cellWidth: 45 },
    },
  });

  // --- Summary table ---
  const afterMaterialsY = (doc as any).lastAutoTable?.finalY ?? tableStartY + 50;
  
  autoTable(doc, {
    startY: afterMaterialsY + 8,
    margin: { left: marginX + fullTableW - 80, right: marginX },
    tableWidth: 80,
    body: [
      ["Subtotaal materialen:", formatTonCO2e(sumRowCO2)],
      ["Baseline (vloeropp.):", formatTonCO2e(-baseline)],
      ["Totaal ton CO2 e:", formatTonCO2e(totalCO2)],
    ],
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 2.2,
      lineColor: COLORS.grid as any,
      lineWidth: 0.2,
      textColor: COLORS.textDark as any,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { halign: "right", cellWidth: 30 },
    },
    didParseCell: (data: any) => {
      if (data.row.index === 2) {
        data.cell.styles.fillColor = COLORS.boxBg;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // --- Footer ---
  const footerY = pageH - 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 135, 150);

  const leftFooter = `${model.projectplanProjectnummer || "-"}  |  ${model.projectplanTitel || "-"}`;
  doc.text(leftFooter, marginX, footerY);

  const pageLabel = "Pagina 1";
  doc.text(pageLabel, pageW - marginX - doc.getTextWidth(pageLabel), footerY);

  return doc.output("blob");
};

const ExportProjectplanPdfButton: React.FC = () => {
  const { model } = useForm<any>();

  const generatePdf = () => {
    const pdfBlob = generateProjectplanPdf(model);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projectplan-quickscan.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmGenerate = () => {
    generatePdf();
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={handleConfirmGenerate} sx={{ fontSize: "0.85rem", py: 1, minWidth: 260 }}>
        Export projectplan naar PDF
      </Button>

   </>
  );
};

export default ExportProjectplanPdfButton;