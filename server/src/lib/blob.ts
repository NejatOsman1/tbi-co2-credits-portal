import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("AZURE_STORAGE_CONNECTION_STRING must be set");
}

const service = BlobServiceClient.fromConnectionString(connectionString);

export const filesContainer = service.getContainerClient("project-files");

// The container is private: files are only reachable through the authenticated
// /api/projects/:id/files routes, never by a public blob URL.
let ensured: Promise<unknown> | null = null;
export function ensureContainer(): Promise<unknown> {
  ensured ??= filesContainer.createIfNotExists();
  return ensured;
}
