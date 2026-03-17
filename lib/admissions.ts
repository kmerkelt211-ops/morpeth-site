import { createHash } from "node:crypto";

export type IncomingAdmissionsPayload = {
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

export type NormalizedAdmissionsPayload = {
  fullName: string;
  email: string;
  phone: string;
  childYearGroup: "year5" | "year6" | "other";
  admissionYear: number;
  enquiryType: "book_visit" | "general" | "callback";
  message: string;
  audienceSegment: "prospective" | "parent" | "student" | "staff";
  heroVariant: "community" | "achievement";
  sourcePage: string;
  website: string;
};

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r/g, "").trim().slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
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

export function normalizeAdmissionsPayload(
  payload: IncomingAdmissionsPayload,
  now = new Date(),
): NormalizedAdmissionsPayload {
  const fullName = sanitizeText(payload.fullName, 120);
  const email = sanitizeText(payload.email, 180).toLowerCase();
  const phone = sanitizeText(payload.phone, 40);
  const message = sanitizeMultiline(payload.message, 2000);
  const childYearGroup = normalizeYearGroup(payload.childYearGroup);
  const enquiryType = normalizeEnquiryType(payload.enquiryType);
  const audienceSegment = normalizeAudience(payload.audienceSegment);
  const heroVariant = normalizeHeroVariant(payload.heroVariant);
  const sourcePage = sanitizeText(payload.sourcePage, 120) || "/";
  const website = sanitizeText(payload.website, 50);

  const admissionYearRaw = Number(payload.admissionYear);
  const currentYear = now.getFullYear();
  const admissionYear =
    Number.isFinite(admissionYearRaw) &&
    admissionYearRaw >= currentYear &&
    admissionYearRaw <= currentYear + 3
      ? admissionYearRaw
      : currentYear;

  return {
    fullName,
    email,
    phone,
    childYearGroup,
    admissionYear,
    enquiryType,
    message,
    audienceSegment,
    heroVariant,
    sourcePage,
    website,
  };
}

export function validateAdmissionsPayload(payload: NormalizedAdmissionsPayload): string | null {
  if (payload.website) return "honeypot";
  if (!payload.fullName || !payload.email || !payload.message) {
    return "Please complete full name, email and message.";
  }
  if (!isValidEmail(payload.email)) {
    return "Please enter a valid email.";
  }
  return null;
}

export function getAdmissionsRequestFingerprint(ip: string): string {
  return createHash("sha256").update(`admissions:${ip}`).digest("hex");
}
