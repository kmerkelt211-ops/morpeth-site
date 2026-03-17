import { createClient, type QueryParams } from "@sanity/client";
import { publicEnv } from "../lib/env";

export const client = createClient({
  projectId: publicEnv.sanityProjectId,
  dataset: publicEnv.sanityDataset,
  apiVersion: publicEnv.sanityApiVersion,
  useCdn: true,
  perspective: "published",
});

export const sanityFetch = async <T>(q: string, params?: QueryParams) =>
  params ? client.fetch<T>(q, params) : client.fetch<T>(q);
