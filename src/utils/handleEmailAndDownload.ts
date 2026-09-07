import JSZip from "jszip";
import { generateProjectplanDocx } from "./exportProjectplanPDF.js";
import { api } from "../api/client.js";
import type { ProjectFile } from "../api/types.js";

interface HandleEmailAndDownloadParams {
  model: any;
  projectId: string;
  projectFiles: ProjectFile[];
}

export const handleEmailAndDownload = async ({
  model,
  projectId,
  projectFiles,
}: HandleEmailAndDownloadParams) => {
  const zip = new JSZip();

  // Generate and add projectplan Word document to ZIP
  const docxName = `${model.projectplanTitel || "projectplan"}.docx`;
  const docxBlob = await generateProjectplanDocx(model);
  zip.file(docxName, docxBlob);

  // Fetch the stored bewijsstukken from the project and add them to the ZIP.
  // Names are de-duplicated so two uploads with the same filename both survive.
  const usedNames = new Set<string>([docxName]);
  const allFiles: string[] = [];

  for (const file of projectFiles) {
    let name = file.name;
    for (let n = 2; usedNames.has(name); n++) {
      const dot = file.name.lastIndexOf(".");
      name =
        dot > 0 ? `${file.name.slice(0, dot)} (${n})${file.name.slice(dot)}` : `${file.name} (${n})`;
    }
    usedNames.add(name);
    allFiles.push(name);

    const blob = await api.downloadProjectFile(projectId, file.id);
    zip.file(name, blob);
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
  const allFileNames = [docxName, ...allFiles];
  const projectName = model.projectplanTitel || "Onbekend project";
  const subject = encodeURIComponent(`TBI CO2 Credits - Certificering: ${projectName}`);
  const body = encodeURIComponent(
    `Beste Oncra,\n\nGraag willen wij ons project laten certificeren. Hierbij stuur ik de projectplan data en bijbehorende bewijsdocumenten voor het CO2 credits project.\n\nBijgevoegde documenten (${allFileNames.length} bestanden):\n${allFileNames.map((name) => "- " + name).join("\n")}\n\nDe documenten zijn gedownload als ZIP-bestand. Voeg het ZIP-bestand als bijlage toe aan deze email.\n\nMet vriendelijke groet`
  );
  window.location.href = `mailto:act@oncra.org?subject=${subject}&body=${body}`;
};