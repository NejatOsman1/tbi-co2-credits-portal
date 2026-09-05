export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
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
}
