export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  /** SHA-256 of the reset token; the raw token only ever exists in the e-mail. */
  resetTokenHash?: string;
  resetTokenExpiresAt?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  contentType: string;
  /** Bewijsstuk-categorie, of "row" voor een aankoopbewijs bij een quickscan-regel. */
  category: string;
  /** Alleen gevuld wanneer category === "row". */
  rowIndex?: number;
  uploadedAt: string;
  blobPath: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeStep: number;
  activeSub: number;
  formData: Record<string, unknown>;
  files?: ProjectFile[];
}
