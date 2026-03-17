import { publicEnv, assertEnv } from "../lib/env";

export const apiVersion = publicEnv.sanityApiVersion;

export const dataset = assertValue(assertEnv("NEXT_PUBLIC_SANITY_DATASET"));

export const projectId = assertValue(assertEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"));

function assertValue<T>(value: T): T {
  return value;
}
