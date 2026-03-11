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

const COLORS = {
  brandDark: [99, 13, 128] as const,
  brandLight: [220, 200, 235] as const,
  textDark: [20, 40, 55] as const,
  grid: [210, 220, 230] as const,
  boxBg: [245, 248, 251] as const,
  helper: [90, 110, 125] as const,
};

const ExportProjectplanPdfButton: React.FC = () => {
  const { model } = useForm<any>();
  const bewijsLinks: string[] = model.bewijsLinks || [];

  const generatePdf = () => {
    const quickScan = model.quickScan || [];
    console.log(quickScan);
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
    doc.text("CO2 Credits Quickscan", marginX, 22);

    // --- Meta grid ---
    const vloeroppervlak = model.projectplanVloeroppervlak ?? "Onbekend";

    const metaRows = [
      [
        "Naam",
        model.projectplanNaam || "-",
        "Datum",
        date,
      ],
      [
        "Projectnaam",
        model.projectplanTitel || "-",
        "Fase",
        model.projectplanBouwfase || "-",
      ],
      [
        "Projectnummer",
        model.projectplanProjectnummer || "-",
        "Vloeroppervlakte",
        `${vloeroppervlak} m²`,
      ],
      [
        "Email",
        model.projectplanEmail || "-",
        "KVK-nummer",
        model.projectplanKvkNummer || "-",
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

      // Background box
      doc.setFillColor(...COLORS.boxBg);
      doc.setDrawColor(...COLORS.grid);
      doc.setLineWidth(0.2);
      doc.roundedRect(marginX, boxTopY, fullTableW, boxH, 2, 2, "FD");

      // Text inside box
      doc.text(wrappedLines, marginX + boxPadding, boxTopY + boxPadding + 3);

      afterBeschrijvingY = boxTopY + boxH;
    }

    // --- Quickscan table ---
    if (!quickScan.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.textDark);
      doc.text("Geen quickscan gegevens ingevuld.", marginX, afterBeschrijvingY + 12);
      doc.save("projectplan-quickscan.pdf");
      return;
    }

    const tableStartY = afterBeschrijvingY + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Quickscan materialen", marginX, tableStartY);

    const tableData = quickScan.map((row: any, i: number) => [
      String(i + 1),
      row.fabrikant || "-",
      row.productCategory || "-",
      row.aantal != null ? `${row.aantal}` : "-",
      row.eenheid ?? "-",
      bewijsLinks[i] || "-",
    ]);

    autoTable(doc, {
      startY: tableStartY + 4,
      margin: { left: marginX, right: marginX },
      tableWidth: fullTableW,
      head: [
        ["Nr.", "Fabrikant", "Productcategorie", "Hoeveelheid", "Eenheid", "EPD-link"],
      ],
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
        3: { cellWidth: 24, halign: "right" },
        4: { cellWidth: 20, halign: "right" },
        5: { cellWidth: 55 },
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

    doc.save("projectplan-quickscan.pdf");
  };

  const handleConfirmGenerate = () => {
    generatePdf();
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={handleConfirmGenerate} sx={{ mt: 2 }}>
        Export naar PDF
      </Button>

   </>
  );
};

export default ExportProjectplanPdfButton;