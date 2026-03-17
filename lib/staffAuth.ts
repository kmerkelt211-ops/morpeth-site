import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isProduction, serverEnv } from "./env";
import { buildStaffLoginRedirectPath, sanitizeStaffReturnTo } from "./staffAuthPaths";

export const STAFF_SESSION_COOKIE = "morpeth_staff_session";
export const STAFF_OAUTH_STATE_COOKIE = "morpeth_staff_oauth_state";
export const STAFF_OAUTH_RETURN_COOKIE = "morpeth_staff_oauth_return_to";
export const STAFF_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export type StaffSession = {
  email: string;
  name?: string;
  exp: number;
};

type CookieStoreLike = {
  get(name: string): { value: string } | undefined;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64(input: string): string {
  return btoa(input);
}

function fromBase64(input: string): string {
  return atob(input);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return toBase64(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = fromBase64(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toBase64Url(value: string): string {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  return padded + "=".repeat(padLength);
}

function encodeBase64UrlFromString(value: string): string {
  return encodeBase64UrlFromBytes(encoder.encode(value));
}

function decodeBase64UrlToString(value: string): string {
  return decoder.decode(decodeBase64UrlToBytes(value));
}

function encodeBase64UrlFromBytes(value: Uint8Array): string {
  return toBase64Url(bytesToBase64(value));
}

function decodeBase64UrlToBytes(value: string): Uint8Array {
  return base64ToBytes(fromBase64Url(value));
}

async function createHmac(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function signValue(value: string, secret: string): Promise<string> {
  const key = await createHmac(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return encodeBase64UrlFromBytes(new Uint8Array(signature));
}

async function constantTimeEquals(a: string, b: string): Promise<boolean> {
  const aBytes = decodeBase64UrlToBytes(a);
  const bBytes = decodeBase64UrlToBytes(b);
  if (aBytes.length !== bBytes.length) return false;
  let mismatch = 0;
  for (let i = 0; i < aBytes.length; i += 1) {
    mismatch |= aBytes[i] ^ bBytes[i];
  }
  return mismatch === 0;
}

export function parseAllowedStaffDomains(raw: string | undefined): string[] {
  return (raw || "")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(serverEnv.staffGoogleClientId && serverEnv.staffGoogleClientSecret);
}

export function isStaffAuthConfigured(): boolean {
  return Boolean(serverEnv.staffAuthSecret && isGoogleAuthConfigured());
}

export function sanitizeReturnTo(input: string | null | undefined): string {
  return sanitizeStaffReturnTo(input);
}

export function buildGoogleRedirectUri(req: NextRequest): string {
  const configured = serverEnv.staffGoogleRedirectUri;
  if (configured) return configured;
  return new URL("/api/staff-auth/callback", req.nextUrl.origin).toString();
}

export function randomUrlSafeString(bytes = 32): string {
  const out = new Uint8Array(bytes);
  crypto.getRandomValues(out);
  return encodeBase64UrlFromBytes(out);
}

export async function createStaffSessionToken(
  session: Omit<StaffSession, "exp"> & { exp?: number },
  secret: string,
): Promise<string> {
  const payload: StaffSession = {
    email: session.email,
    name: session.name,
    exp: session.exp ?? Math.floor(Date.now() / 1000) + STAFF_SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = encodeBase64UrlFromString(JSON.stringify(payload));
  const signature = await signValue(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function readStaffSessionFromToken(
  token: string,
  secret: string,
): Promise<StaffSession | null> {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await signValue(encodedPayload, secret);
  const validSignature = await constantTimeEquals(signature, expectedSignature);
  if (!validSignature) return null;

  try {
    const parsed = JSON.parse(decodeBase64UrlToString(encodedPayload)) as StaffSession;
    if (!parsed.email || typeof parsed.exp !== "number") return null;
    if (parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function readStaffSessionFromStore(
  cookies: CookieStoreLike,
  secret: string,
): Promise<StaffSession | null> {
  const token = cookies.get(STAFF_SESSION_COOKIE)?.value;
  if (!token) return null;
  return readStaffSessionFromToken(token, secret);
}

export function isAllowedStaffAccount(
  email: string,
  hostedDomain: string | undefined,
  allowedDomains: string[],
): boolean {
  if (!allowedDomains.length) return false;
  const normalizedEmail = email.trim().toLowerCase();
  const emailDomain = normalizedEmail.split("@")[1] || "";
  const normalizedHostedDomain = (hostedDomain || "").trim().toLowerCase();
  return allowedDomains.some((domain) => domain === emailDomain || domain === normalizedHostedDomain);
}

export async function getCurrentStaffSession(): Promise<StaffSession | null> {
  if (!serverEnv.staffAuthSecret) return null;
  const store = await cookies();
  return readStaffSessionFromStore(store, serverEnv.staffAuthSecret);
}

export async function requireStaffSession(returnTo = "/staff"): Promise<StaffSession> {
  const session = await getCurrentStaffSession();
  if (session) return session;
  redirect(buildStaffLoginRedirectPath(returnTo));
}

export function buildSecureCookieOptions(maxAge: number) {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    maxAge,
  };
}
