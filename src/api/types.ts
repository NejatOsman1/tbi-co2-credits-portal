import type { FormModel } from "../forms/types";

export interface ProjectSummary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeStep: number;
  activeSub: number;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  contentType: string;
  category: string;
  rowIndex?: number;
  uploadedAt: string;
  blobPath: string;
}

export interface Project extends ProjectSummary {
  userId: string;
  formData: Partial<FormModel>;
  files?: ProjectFile[];
}

export interface AuthUser {
  id: string;
  email: string;
}
