import { createClient } from "@sanity/client";
import { jsonError, jsonOk } from "../../../lib/apiResponses";
import {
  getAdmissionsRequestFingerprint,
  normalizeAdmissionsPayload,
  type IncomingAdmissionsPayload,
  validateAdmissionsPayload,
} from "../../../lib/admissions";
import { publicEnv, serverEnv } from "../../../lib/env";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function getIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

async function isRateLimited(
  writeClient: ReturnType<typeof createClient>,
  requestFingerprint: string,
  submittedAtIso: string,
): Promise<boolean> {
  const windowStartIso = new Date(Date.parse(submittedAtIso) - RATE_LIMIT_WINDOW_MS).toISOString();
  const recentCount = await writeClient.fetch<number>(
    `count(*[_type == "admissionsEnquiry" && requestFingerprint == $requestFingerprint && dateTime(submittedAt) >= dateTime($windowStartIso)])`,
    { requestFingerprint, windowStartIso },
  );
  return recentCount >= RATE_LIMIT_MAX;
}

export async function POST(req: Request) {
  let payload: IncomingAdmissionsPayload;
  try {
    payload = (await req.json()) as IncomingAdmissionsPayload;
  } catch {
    return jsonError("Invalid request body.", { status: 400 });
  }

  const normalized = normalizeAdmissionsPayload(payload);
  const validationError = validateAdmissionsPayload(normalized);

  if (validationError === "honeypot") {
    return jsonOk({});
  }

  if (validationError) {
    return jsonError(validationError, { status: 400 });
  }

  const token = serverEnv.sanityWriteToken;
  if (!token) {
    return jsonError("Admissions inbox is not configured. Please contact the school office.", { status: 503 });
  }

  const writeClient = createClient({
    projectId: publicEnv.sanityProjectId,
    dataset: publicEnv.sanityDataset,
    apiVersion: publicEnv.sanityApiVersion,
    useCdn: false,
    token,
  });

  const ip = getIp(req);
  const submittedAt = new Date().toISOString();
  const requestFingerprint = getAdmissionsRequestFingerprint(ip);
  const enquiryId = `admissions-enquiry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    if (await isRateLimited(writeClient, requestFingerprint, submittedAt)) {
      return jsonError("Too many submissions. Please wait and try again.", { status: 429 });
    }

    await writeClient.create({
      _id: enquiryId,
      _type: "admissionsEnquiry",
      fullName: normalized.fullName,
      email: normalized.email,
      phone: normalized.phone,
      childYearGroup: normalized.childYearGroup,
      admissionYear: normalized.admissionYear,
      enquiryType: normalized.enquiryType,
      message: normalized.message,
      sourcePage: normalized.sourcePage,
      submittedAt,
      status: "new",
      audienceSegment: normalized.audienceSegment,
      heroVariant: normalized.heroVariant,
      requestFingerprint,
    });

    return jsonOk({ enquiryId });
  } catch {
    return jsonError("We could not save your enquiry right now. Please try again shortly.", { status: 500 });
  }
}
