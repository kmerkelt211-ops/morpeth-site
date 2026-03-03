import { track } from "@vercel/analytics";

type TrackValue = string | number | boolean | null | undefined;

type TrackPayload = Record<string, TrackValue>;

function normalizePayload(payload?: TrackPayload): Record<string, string | number | boolean> | undefined {
  if (!payload) return undefined;

  const normalized: Record<string, string | number | boolean> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      normalized[key] = value;
    }
  });

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export function safeTrack(name: string, payload?: TrackPayload) {
  try {
    track(name, normalizePayload(payload));
  } catch {
    // Never block UI behavior if analytics fails.
  }
}

export function trackExperimentAssignment(experiment: string, variant: string, extra?: TrackPayload) {
  safeTrack("experiment_assigned", {
    experiment,
    variant,
    ...(extra ?? {}),
  });
}
