import React from "react";
import { Button } from "@mui/material";
import { useForm } from "uniforms";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { computeCO2Equivalent } from './calculateCO2V2.js'

 
const ExportProductenPdfButton: React.FC = () => {
  const { model } = useForm<any>();
 
  const handleExport = () => {
    const producten = model.structuralElements || [];
    const totaalOppervlakte = model.aantalm22 || 'Onbekend';
    const bouwFase = model.prescanFase2 || 'Onbekend';
    let totaalCO2credits = 0;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Overzicht biobased materialen', 14, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fase bouwproject: ${bouwFase}`, 14, 30);
    doc.text(`Totaal vloeroppervlakte project: ${totaalOppervlakte} m²`, 14, 35);

    if (!producten.length) {
      doc.setFontSize(12);
      doc.text('Geen materialen ingevuld.', 14, 45);
      doc.save('biobased-materialen.pdf');
      return;
    }

    // Prepare table data
    const tableData = producten.map((item: any, index: number) => {
    const eenheid = item.eenheid ?? computeCO2Equivalent(item.elements, item.productType, item.aantal);
    if(eenheid) {
        const eenheidNumber = Number(eenheid);
        totaalCO2credits += eenheidNumber;    }  

    return [
        index + 1,
        item.elements || "-",
        item.aantal ?? "-",                    
        item.productType || "-",               
        eenheid === "" ? "" : eenheid,          
    ];
    });
    const CO2Creditsperm2 = (totaalCO2credits/totaalOppervlakte * 1000).toFixed(2);
    // Generate table with autoTable
    autoTable(doc, {
        head: [['', 'Element', 'Oppervlakte element', 'Biobased materiaal', 'CO2 credits']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [46, 125, 50], textColor: 255 },
        columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        },
        margin: { top: 40, left: 14, right: 14 },
    });

    // Optional: Add total carbon or summary below table
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Totaal aantal elementen: ${producten.length}`, 14, finalY + 15);
    doc.text(`Totaal aantal CO2 credits: ${totaalCO2credits}`, 14, finalY + 20);
    doc.text(`Kg CO2 opslag per m² BVO : ${CO2Creditsperm2}`, 14, finalY + 25);
    // Save
    doc.setFont('helvetica', 'normal');
    doc.text(`Voor de berekening worden de volgende aannames gehanteerd:`, 14, finalY + 35);
    doc.text(`- Op basis van de ingevulde gegevens is er een schatting gemaakt van potentiële aantal CO2-credits`, 18, finalY + 40);
    doc.save('biobased-materialen.pdf');
  };

  return (
    <Button variant="outlined" color="success" onClick={handleExport} sx={{ mt: 2 }}>
      Export naar PDF
    </Button>
  );
};


export default ExportProductenPdfButton;
