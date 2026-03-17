import { NextRequest, NextResponse } from "next/server";
import {
  STAFF_OAUTH_RETURN_COOKIE,
  STAFF_OAUTH_STATE_COOKIE,
  STAFF_SESSION_COOKIE,
  STAFF_SESSION_MAX_AGE_SECONDS,
  buildSecureCookieOptions,
  buildGoogleRedirectUri,
  createStaffSessionToken,
  isAllowedStaffAccount,
  isStaffAuthConfigured,
  parseAllowedStaffDomains,
  sanitizeReturnTo,
} from "../../../../lib/staffAuth";
import { serverEnv } from "../../../../lib/env";

type GoogleTokenResponse = {
  access_token?: string;
};

type GoogleUserInfoResponse = {
  email?: string;
  email_verified?: boolean;
  hd?: string;
  name?: string;
};

function clearOauthCookies(response: NextResponse) {
  response.cookies.set({
    name: STAFF_OAUTH_STATE_COOKIE,
    value: "",
    ...buildSecureCookieOptions(0),
  });
  response.cookies.set({
    name: STAFF_OAUTH_RETURN_COOKIE,
    value: "",
    ...buildSecureCookieOptions(0),
  });
}

function redirectToLogin(req: NextRequest, error: string, returnTo: string): NextResponse {
  const loginUrl = new URL("/staff/login", req.url);
  loginUrl.searchParams.set("error", error);
  loginUrl.searchParams.set("returnTo", returnTo);
  const response = NextResponse.redirect(loginUrl);
  clearOauthCookies(response);
  return response;
}

export async function GET(req: NextRequest) {
  const oauthError = req.nextUrl.searchParams.get("error");
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get(STAFF_OAUTH_STATE_COOKIE)?.value;
  const returnTo = sanitizeReturnTo(req.cookies.get(STAFF_OAUTH_RETURN_COOKIE)?.value);

  if (oauthError) {
    return redirectToLogin(req, "access_denied", returnTo);
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToLogin(req, "state_mismatch", returnTo);
  }

  if (!isStaffAuthConfigured()) {
    return redirectToLogin(req, "configuration", returnTo);
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: serverEnv.staffGoogleClientId,
      client_secret: serverEnv.staffGoogleClientSecret,
      redirect_uri: buildGoogleRedirectUri(req),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    return redirectToLogin(req, "token_exchange_failed", returnTo);
  }

  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
  if (!tokenData.access_token) {
    return redirectToLogin(req, "token_missing", returnTo);
  }

  const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
    cache: "no-store",
  });

  if (!userInfoResponse.ok) {
    return redirectToLogin(req, "profile_lookup_failed", returnTo);
  }

  const profile = (await userInfoResponse.json()) as GoogleUserInfoResponse;
  const email = (profile.email || "").trim().toLowerCase();
  const allowedDomains = parseAllowedStaffDomains(serverEnv.staffAllowedGoogleDomains);

  if (!email || profile.email_verified !== true) {
    return redirectToLogin(req, "email_unverified", returnTo);
  }

  if (!isAllowedStaffAccount(email, profile.hd, allowedDomains)) {
    return redirectToLogin(req, "not_allowed", returnTo);
  }

  const sessionSecret = serverEnv.staffAuthSecret;
  const token = await createStaffSessionToken(
    {
      email,
      name: profile.name?.trim() || undefined,
    },
    sessionSecret,
  );

  const destination = new URL(returnTo, req.url);
  const response = NextResponse.redirect(destination);

  response.cookies.set({
    name: STAFF_SESSION_COOKIE,
    value: token,
    ...buildSecureCookieOptions(STAFF_SESSION_MAX_AGE_SECONDS),
  });
  clearOauthCookies(response);

  return response;
}
