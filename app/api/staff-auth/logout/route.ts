import { NextRequest, NextResponse } from "next/server";
import { STAFF_SESSION_COOKIE, buildSecureCookieOptions } from "../../../../lib/staffAuth";

function buildResponse(req: NextRequest) {
  const destination = new URL("/staff/login", req.url);
  destination.searchParams.set("signedOut", "1");

  const response = NextResponse.redirect(destination);
  response.cookies.set({
    name: STAFF_SESSION_COOKIE,
    value: "",
    ...buildSecureCookieOptions(0),
  });
  return response;
}

export async function POST(req: NextRequest) {
  return buildResponse(req);
}

export async function GET(req: NextRequest) {
  return buildResponse(req);
}
