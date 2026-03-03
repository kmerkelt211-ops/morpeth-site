import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type IncomingPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  childYearGroup?: "year5" | "year6" | "other" | "";
  admissionYear?: number;
  enquiryType?: "book_visit" | "general" | "callback";
  message?: string;
  audienceSegment?: "prospective" | "parent" | "student" | "staff";
  heroVariant?: "community" | "achievement";
  sourcePage?: string;
  website?: string;
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function getIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (current.count >= RATE_LIMIT_MAX) return true;
  current.count += 1;
  rateLimitStore.set(ip, current);
  return false;
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r/g, "").trim().slice(0, maxLength);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeEnquiryType(value: unknown): "book_visit" | "general" | "callback" {
  if (value === "book_visit" || value === "callback") return value;
  return "general";
}

function normalizeYearGroup(value: unknown): "year5" | "year6" | "other" {
  if (value === "year5" || value === "year6") return value;
  return "other";
}

function normalizeAudience(value: unknown): "prospective" | "parent" | "student" | "staff" {
  if (value === "parent" || value === "student" || value === "staff") return value;
  return "prospective";
}

function normalizeHeroVariant(value: unknown): "community" | "achievement" {
  return value === "achievement" ? "achievement" : "community";
}

export async function POST(req: Request) {
  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please wait and try again." },
      { status: 429 }
    );
  }

  let payload: IncomingPayload;
  try {
    payload = (await req.json()) as IncomingPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (sanitizeText(payload.website, 50)) {
    return NextResponse.json({ ok: true });
  }

  const fullName = sanitizeText(payload.fullName, 120);
  const email = sanitizeText(payload.email, 180).toLowerCase();
  const phone = sanitizeText(payload.phone, 40);
  const message = sanitizeMultiline(payload.message, 2000);
  const childYearGroup = normalizeYearGroup(payload.childYearGroup);
  const enquiryType = normalizeEnquiryType(payload.enquiryType);
  const audienceSegment = normalizeAudience(payload.audienceSegment);
  const heroVariant = normalizeHeroVariant(payload.heroVariant);
  const sourcePage = sanitizeText(payload.sourcePage, 120) || "/";

  const admissionYearRaw = Number(payload.admissionYear);
  const currentYear = new Date().getFullYear();
  const admissionYear =
    Number.isFinite(admissionYearRaw) && admissionYearRaw >= currentYear && admissionYearRaw <= currentYear + 3
      ? admissionYearRaw
      : currentYear;

  if (!fullName || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please complete full name, email and message." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Admissions inbox is not configured. Please contact the school office." },
      { status: 503 }
    );
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8492tcbd";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-01";

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });

  const submittedAt = new Date().toISOString();
  const enquiryId = `admissions-enquiry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    await writeClient.create({
      _id: enquiryId,
      _type: "admissionsEnquiry",
      fullName,
      email,
      phone,
      childYearGroup,
      admissionYear,
      enquiryType,
      message,
      sourcePage,
      submittedAt,
      status: "new",
      audienceSegment,
      heroVariant,
    });

    return NextResponse.json({ ok: true, enquiryId });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not save your enquiry right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
