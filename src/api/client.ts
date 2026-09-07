import type { FormModel } from "../forms/types";
import type { AuthUser, Project, ProjectFile, ProjectSummary } from "./types";

const TOKEN_KEY = "co2portal_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => undefined);
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? "Er is iets misgegaan");
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ token: string; user: AuthUser }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  listProjects: () => request<ProjectSummary[]>("/projects"),
  createProject: (name?: string) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify({ name }) }),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  saveProject: (
    id: string,
    patch: { formData: Partial<FormModel>; activeStep: number; activeSub: number; name?: string }
  ) => request<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(patch) }),

  uploadProjectFile: async (
    projectId: string,
    file: File,
    meta: { category: string; rowIndex?: number }
  ): Promise<ProjectFile> => {
    const params = new URLSearchParams({ name: file.name, category: meta.category });
    if (meta.rowIndex !== undefined) params.set("rowIndex", String(meta.rowIndex));

    const token = getToken();
    const res = await fetch(`/api/projects/${projectId}/files?${params}`, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: file,
    });
    const data = await res.json().catch(() => undefined);
    if (!res.ok) throw new ApiError(res.status, data?.error ?? "Uploaden is mislukt");
    return data as ProjectFile;
  },

  downloadProjectFile: async (projectId: string, fileId: string): Promise<Blob> => {
    const token = getToken();
    const res = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new ApiError(res.status, "Downloaden is mislukt");
    return res.blob();
  },

  deleteProjectFile: async (projectId: string, fileId: string): Promise<void> => {
    const token = getToken();
    const res = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new ApiError(res.status, "Verwijderen is mislukt");
  },
};
