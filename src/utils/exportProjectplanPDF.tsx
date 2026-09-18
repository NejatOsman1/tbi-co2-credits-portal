import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { useForm } from "uniforms";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { getCarbonForRow, getQuantityForRow, calcTonCO2e, calcTotalTonCO2e, formatTonCO2e } from "./calculateCO2.js";

// Fills the Oncra "projectplan" Word template (public/projectplan_template.docx)
// with the data already present in the app's form model. The template keeps
// all of its own fonts, styles, tables and header/footer — only the {tags}
// inside it are replaced.
export const generateProjectplanDocx = async (model: any): Promise<Blob> => {
  const res = await fetch("/projectplan_template.docx");
  if (!res.ok) {
    throw new Error("Kon het projectplan-sjabloon (projectplan_template.docx) niet laden");
  }
  const templateBuf = await res.arrayBuffer();

  const zip = new PizZip(templateBuf);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => "",
  });

  const quickScan = model.quickScan || [];
  const bewijsLinks: string[] = model.bewijsLinks || [];
  const vloeroppervlak = model.projectplanVloeroppervlak ?? model.aantalm22 ?? "";

  const products = quickScan.map((row: any, i: number) => {
    const hoeveelheid = getQuantityForRow(row);
    const carbon = getCarbonForRow(row);

    return {
      name: row.productCategory || "-",
      supplier: row.fabrikant || "-",
      epd: bewijsLinks[i] || "-",
      quantity: hoeveelheid ? String(hoeveelheid) : "-",
      unit: row.eenheid || "-",
      csc: typeof carbon === "number" ? carbon.toLocaleString("nl-NL") : "-",
    };
  });

  doc.render({
    // Project header
    projectTitle: model.projectplanTitel || "",
    buildingCategory: "",
    projectOperator: model.projectplanBedrijfsnaam || "",
    documentPreparedBy: model.projectplanNaam || "",
    preparerContact: model.projectplanEmail || "",
    grossFloorArea: vloeroppervlak !== "" ? `${vloeroppervlak} m²` : "",
    projectType: model.projectplanProjectType || "",
    projectStage: model.projectplanBouwfase || "",
    submissionDate: new Date().toLocaleDateString("nl-NL"),
    version: "",
    submitter: model.projectplanNaam || "",
    ownSpecifications: "",

    // 1. Project details
    projectDescription: model.projectplanBeschrijving || "",
    organizationsIntro: "",
    projectLocation: model.projectplanLocatie || "",
    scope: vloeroppervlak !== "" ? `${vloeroppervlak} m² bruto vloeroppervlak` : "",
    timelineStartDate: model.projectplanStartdatum || "",
    // Template tag is spelled "timelineEnddate" (lowercase d) in the current .docx — keep in sync if the template tag is ever corrected.
    timelineEnddate: model.projectplanEinddatum || "",
    media: "",

    // Main project operator (Table 1)
    op1LegalName: model.projectplanNaam || "",
    op1Registration: model.projectplanKvkNummer != null ? String(model.projectplanKvkNummer) : "",
    op1Address: model.projectplanAdres || "",
    op1Contact: model.projectplanEmail || "",
    op1Role: model.projectplanRol || "",

    // Other project operators (Table 2) — not collected in this app
    otherOperators: [],

    // Biobased products, sourced from the quickscan rows
    products,

    // 2. Quality criteria — not collected in this app
    baselineBuildingType: model.projectplanGebouwtype || "",
    additionalitySubsidy: "",
    additionalityValuation: "",
    lifespanCompliance: "",
    lifespanSource: "",

    // 2.4 Sustainability — not collected in this app
    sustAdaptationMin: "",
    sustAdaptationAbove: "",
    sustWaterMin: "",
    sustWaterAbove: "",
    sustCircularMin: "",
    sustCircularAbove: "",
    sustPollutionMin: "",
    sustPollutionAbove: "",
    sustBiodiversityMin: "",
    sustBiodiversityAbove: "",

    // Risks (tabel 5), zoals ingevuld op de stap "Upload bewijsstukken"
    risks: (model.risicos ?? [])
      .filter((r: any) => r?.risico || r?.kans || r?.impact || r?.maatregel)
      .map((r: any) => ({
        risk: r.risico || "",
        likelihood: r.kans || "",
        impact: r.impact || "",
        mitigation: r.maatregel || "",
      })),

    // 3. Monitoring, reporting, verification
    reporting: "",

    // Evidence dropdowns (BewijsDocuments step)
    evidence_used_biomaterials: model.bewijsBiomaterialen || "",
    evidence_building_lifespan: model.bewijsMilieuImpact || "",
    evidence_building_permit: model.bewijsGebouwgegevens || "",
    "evidence_wood-sustainability": model.bewijsDuurzaamHout || "",
  });

  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }) as Blob;
};

const ExportProjectplanPdfButton: React.FC = () => {
  const { model } = useForm<any>();
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    try {
      const blob = await generateProjectplanDocx(model);
      saveAs(blob, `${model.projectplanTitel || "projectplan"}.docx`);
    } catch (e: any) {
      const detail =
        e?.properties?.errors
          ?.map((x: any) => x?.properties?.explanation)
          .filter(Boolean)
          .join("; ") || e.message;
      setError(detail);
      console.error(e);
    }
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={handleGenerate} sx={{ fontSize: "0.85rem", py: 1, minWidth: 260 }}>
        Export projectplan naar Word
      </Button>
      {error && (
        <Typography sx={{ color: "error.main", fontSize: "0.8rem" }}>
          Sjabloon fout: {error}
        </Typography>
      )}
    </>
  );
};

export default ExportProjectplanPdfButton;