import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

if (!endpoint || !key) {
  throw new Error("COSMOS_ENDPOINT and COSMOS_KEY must be set");
}

const client = new CosmosClient({ endpoint, key });
const database = client.database("co2portal");

export const usersContainer = database.container("users");
export const projectsContainer = database.container("projects");
