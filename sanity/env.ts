import { publicEnv } from "../lib/env";

export const apiVersion = publicEnv.sanityApiVersion;

export const dataset = assertValue(publicEnv.sanityDataset);

export const projectId = assertValue(publicEnv.sanityProjectId);

function assertValue<T>(value: T): T {
  return value;
}
