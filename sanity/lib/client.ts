import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

/**
 * If env vars are present, use a real client.
 * If not, export a no-op client so pages can compile and render gracefully.
 */
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : { fetch: async () => [] as any[] };

export default client;
