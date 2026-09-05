import { Router } from "express";
import { randomUUID } from "node:crypto";
import { projectsContainer } from "../lib/cosmos.js";
import { requireAuth, type AuthedRequest } from "../lib/auth.js";
import type { Project } from "../lib/types.js";

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
