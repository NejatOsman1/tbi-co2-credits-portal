import JSZip from "jszip";
import { generateProjectplanPdf } from "./exportProjectplanPDF.js";

type FileKey = "biomaterialen" | "bouwkundigRapport" | "mpgRapport";

interface HandleEmailAndDownloadParams {
  model: any;
  files: Record<FileKey, File[]>;
  rowFiles: Record<number, File | null>;
}

export const handleEmailAndDownload = async ({
  model,
  files,
  rowFiles,
}: HandleEmailAndDownloadParams) => {
  const zip = new JSZip();
  const allFiles: File[] = [];

  // Generate and add projectplan PDF to ZIP
  const pdfBlob = generateProjectplanPdf(model);
  zip.file("projectplan-quickscan.pdf", pdfBlob);

  // Collect main document files (arrays)
  allFiles.push(...files.biomaterialen);
  allFiles.push(...files.bouwkundigRapport);
  allFiles.push(...files.mpgRapport);

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
  const projectName = model.projectplanTitel || "Onbekend project";
  const subject = encodeURIComponent(`TBI CO2 Credits - Certificering: ${projectName}`);
  const body = encodeURIComponent(
    `Beste Oncra,\n\nGraag willen wij ons project laten certificeren. Hierbij stuur ik de projectplan data en bijbehorende bewijsdocumenten voor het CO2 credits project.\n\nBijgevoegde documenten (${allFileNames.length} bestanden):\n${allFileNames.map((name) => "- " + name).join("\n")}\n\nDe documenten zijn gedownload als ZIP-bestand. Voeg het ZIP-bestand als bijlage toe aan deze email.\n\nMet vriendelijke groet`
  );
  window.location.href = `mailto:act@oncra.org?subject=${subject}&body=${body}`;
};