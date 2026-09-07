import { Router, raw } from "express";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { projectsContainer } from "../lib/cosmos.js";
import { ensureContainer, filesContainer } from "../lib/blob.js";
import { requireAuth, type AuthedRequest } from "../lib/auth.js";
import type { Project, ProjectFile } from "../lib/types.js";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  const { resources } = await projectsContainer.items
    .query({
      query:
        "SELECT c.id, c.name, c.createdAt, c.updatedAt, c.activeStep, c.activeSub FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: userId }],
    })
    .fetchAll();
  res.json(resources);
});

projectsRouter.post("/", async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  const name =
    typeof req.body?.name === "string" && req.body.name.trim() ? req.body.name.trim() : "Nieuw project";
  const now = new Date().toISOString();
  const project: Project = {
    id: randomUUID(),
    userId,
    name,
    createdAt: now,
    updatedAt: now,
    activeStep: 0,
    activeSub: 0,
    formData: { projectplanTitel: name },
  };
  await projectsContainer.items.create(project);
  res.status(201).json(project);
});

projectsRouter.get("/:id", async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  const { resource } = await projectsContainer.item(req.params.id, userId).read<Project>();
  if (!resource) {
    res.status(404).json({ error: "Project niet gevonden" });
    return;
  }
  res.json(resource);
});

projectsRouter.put("/:id", async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  const { resource: existing } = await projectsContainer.item(req.params.id, userId).read<Project>();
  if (!existing) {
    res.status(404).json({ error: "Project niet gevonden" });
    return;
  }

  const { name, formData, activeStep, activeSub } = req.body ?? {};
  const nextFormData = formData ?? existing.formData;
  const projectplanTitel = (nextFormData as { projectplanTitel?: unknown } | undefined)?.projectplanTitel;

  const derivedName =
    typeof projectplanTitel === "string" && projectplanTitel.trim()
      ? projectplanTitel.trim()
      : typeof name === "string" && name.trim()
        ? name.trim()
        : existing.name;

  const updated: Project = {
    ...existing,
    name: derivedName,
    formData: nextFormData,
    activeStep: typeof activeStep === "number" ? activeStep : existing.activeStep,
    activeSub: typeof activeSub === "number" ? activeSub : existing.activeSub,
    updatedAt: new Date().toISOString(),
  };

  const { resource } = await projectsContainer.item(req.params.id, userId).replace(updated);
  res.json(resource);
});

// --- Bewijsstukken -----------------------------------------------------------
// The bytes live in blob storage; only the metadata is kept on the project
// document, so uploads never run into the 2MB Cosmos document limit.

projectsRouter.post(
  "/:id/files",
  raw({ type: () => true, limit: MAX_UPLOAD_BYTES }),
  async (req: AuthedRequest, res) => {
    const userId = req.auth!.userId;
    const body = req.body;
    if (!Buffer.isBuffer(body) || body.length === 0) {
      res.status(400).json({ error: "Geen bestand ontvangen" });
      return;
    }

    const name = typeof req.query.name === "string" ? req.query.name : "bestand";
    const category = typeof req.query.category === "string" ? req.query.category : "overig";
    const rowIndex = Number(req.query.rowIndex);

    const { resource: existing } = await projectsContainer.item(req.params.id, userId).read<Project>();
    if (!existing) {
      res.status(404).json({ error: "Project niet gevonden" });
      return;
    }

    const fileId = randomUUID();
    const blobPath = `${userId}/${existing.id}/${fileId}${path.extname(name)}`;
    const contentType = req.headers["content-type"] || "application/octet-stream";

    await ensureContainer();
    await filesContainer.getBlockBlobClient(blobPath).uploadData(body, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    const file: ProjectFile = {
      id: fileId,
      name,
      size: body.length,
      contentType,
      category,
      ...(Number.isInteger(rowIndex) ? { rowIndex } : {}),
      uploadedAt: new Date().toISOString(),
      blobPath,
    };

    await projectsContainer.item(req.params.id, userId).replace<Project>({
      ...existing,
      files: [...(existing.files ?? []), file],
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json(file);
  }
);

projectsRouter.get("/:id/files/:fileId", async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  const { resource: existing } = await projectsContainer.item(req.params.id, userId).read<Project>();
  const file = existing?.files?.find((f) => f.id === req.params.fileId);
  if (!file) {
    res.status(404).json({ error: "Bestand niet gevonden" });
    return;
  }

  const download = await filesContainer.getBlockBlobClient(file.blobPath).download();
  if (!download.readableStreamBody) {
    res.status(404).json({ error: "Bestand niet gevonden" });
    return;
  }

  res.setHeader("Content-Type", file.contentType);
  res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`);
  download.readableStreamBody.pipe(res);
});

projectsRouter.delete("/:id/files/:fileId", async (req: AuthedRequest, res) => {
  const userId = req.auth!.userId;
  const { resource: existing } = await projectsContainer.item(req.params.id, userId).read<Project>();
  const file = existing?.files?.find((f) => f.id === req.params.fileId);
  if (!existing || !file) {
    res.status(404).json({ error: "Bestand niet gevonden" });
    return;
  }

  await filesContainer.getBlockBlobClient(file.blobPath).deleteIfExists();
  await projectsContainer.item(req.params.id, userId).replace<Project>({
    ...existing,
    files: (existing.files ?? []).filter((f) => f.id !== file.id),
    updatedAt: new Date().toISOString(),
  });

  res.status(204).end();
});
