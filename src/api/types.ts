import type { FormModel } from "../forms/types";

export interface ProjectSummary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeStep: number;
  activeSub: number;
}

export interface Project extends ProjectSummary {
  userId: string;
  formData: Partial<FormModel>;
}

export interface AuthUser {
  id: string;
  email: string;
}
