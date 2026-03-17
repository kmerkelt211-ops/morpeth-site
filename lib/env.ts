const DEFAULT_SITE_URL = "https://morpeth-site.vercel.app";
const DEFAULT_SANITY_PROJECT_ID = "8492tcbd";
const DEFAULT_SANITY_DATASET = "production";
const DEFAULT_SANITY_API_VERSION = "2024-11-01";
const DEFAULT_EXTERNAL_GALLERY_URL = "https://morpeth-gallery.vercel.app";
const DEFAULT_EXTERNAL_MUSIC_URL = "https://www.morpethmusic.net";
const DEFAULT_EMAIL_URL =
  "https://mail.lgflmail.org/owa/auth/logon.aspx?replaceCurrent=1&url=https%3a%2f%2fmail.lgflmail.org%2fowa%2f%23authRedirect%3dtrue";
const DEFAULT_REMOTE_ACCESS_URL =
  "https://remote.morpeth.towerhamlets.sch.uk/rdweb/webclient/";

function trimEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function readEnv(name: string): string | undefined {
  return trimEnv(process.env[name]);
}

function parseUrl(value: string | undefined, fallback: string): string {
  try {
    return new URL(value || fallback).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const publicEnv = {
  siteUrl: parseUrl(readEnv("NEXT_PUBLIC_SITE_URL"), DEFAULT_SITE_URL),
  sanityProjectId: readEnv("NEXT_PUBLIC_SANITY_PROJECT_ID") || DEFAULT_SANITY_PROJECT_ID,
  sanityDataset: readEnv("NEXT_PUBLIC_SANITY_DATASET") || DEFAULT_SANITY_DATASET,
  sanityApiVersion: readEnv("NEXT_PUBLIC_SANITY_API_VERSION") || DEFAULT_SANITY_API_VERSION,
  clarityProjectId: readEnv("NEXT_PUBLIC_CLARITY_ID") || "",
  hotjarSiteId: readEnv("NEXT_PUBLIC_HOTJAR_ID") || "",
  hotjarSnippetVersion: readEnv("NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION") || "6",
  externalGalleryUrl:
    readEnv("NEXT_PUBLIC_EXTERNAL_GALLERY_URL") || DEFAULT_EXTERNAL_GALLERY_URL,
  externalMusicUrl:
    readEnv("NEXT_PUBLIC_EXTERNAL_MUSIC_URL") || DEFAULT_EXTERNAL_MUSIC_URL,
  emailUrl: readEnv("NEXT_PUBLIC_EMAIL_URL") || DEFAULT_EMAIL_URL,
  emailHelpUrl: readEnv("NEXT_PUBLIC_EMAIL_HELP_URL") || "",
  remoteAccessUrl:
    readEnv("NEXT_PUBLIC_REMOTE_ACCESS_URL") || DEFAULT_REMOTE_ACCESS_URL,
};

export const serverEnv = {
  nodeEnv: process.env.NODE_ENV || "development",
  instagramAccessToken: readEnv("INSTAGRAM_ACCESS_TOKEN") || "",
  instagramUserId: readEnv("INSTAGRAM_USER_ID") || "",
  sanityWriteToken: readEnv("SANITY_API_WRITE_TOKEN") || "",
  staffGoogleClientId: readEnv("STAFF_GOOGLE_CLIENT_ID") || "",
  staffGoogleClientSecret: readEnv("STAFF_GOOGLE_CLIENT_SECRET") || "",
  staffGoogleRedirectUri: readEnv("STAFF_GOOGLE_REDIRECT_URI") || "",
  staffAllowedGoogleDomains: readEnv("STAFF_ALLOWED_GOOGLE_DOMAINS") || "",
  staffAuthSecret: readEnv("STAFF_AUTH_SECRET") || "",
  peripateticTimetableUrl: readEnv("PRIVATE_PERIPATETIC_TIMETABLE_URL") || "",
};

export const isProduction = serverEnv.nodeEnv === "production";

export function assertEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
