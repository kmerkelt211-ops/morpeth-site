import { NextRequest, NextResponse } from "next/server";
import {
  STAFF_OAUTH_RETURN_COOKIE,
  STAFF_OAUTH_STATE_COOKIE,
  buildGoogleRedirectUri,
  isGoogleAuthConfigured,
  parseAllowedStaffDomains,
  randomUrlSafeString,
  sanitizeReturnTo,
} from "../../../../lib/staffAuth";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export async function GET(req: NextRequest) {
  const returnTo = sanitizeReturnTo(req.nextUrl.searchParams.get("returnTo"));

  if (!isGoogleAuthConfigured()) {
    const loginUrl = new URL("/staff/login", req.url);
    loginUrl.searchParams.set("error", "configuration");
    loginUrl.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const state = randomUrlSafeString(24);
  const redirectUri = buildGoogleRedirectUri(req);
  const allowedDomains = parseAllowedStaffDomains(process.env.STAFF_ALLOWED_GOOGLE_DOMAINS);

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", process.env.STAFF_GOOGLE_CLIENT_ID || "");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  // Hint the domain in Google account chooser when a single school domain is configured.
  if (allowedDomains.length === 1) {
    authUrl.searchParams.set("hd", allowedDomains[0]);
  }

  const response = NextResponse.redirect(authUrl);
  response.cookies.set({
    name: STAFF_OAUTH_STATE_COOKIE,
    value: state,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
    maxAge: 60 * 10,
  });
  response.cookies.set({
    name: STAFF_OAUTH_RETURN_COOKIE,
    value: returnTo,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
    maxAge: 60 * 10,
  });
  return response;
}

