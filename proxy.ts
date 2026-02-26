import { NextRequest, NextResponse } from "next/server";
import {
  STAFF_SESSION_COOKIE,
  isStaffAuthConfigured,
  readStaffSessionFromToken,
  sanitizeReturnTo,
} from "./lib/staffAuth";

// `atob` is available in the Edge runtime, but may not be typed depending on TS lib settings.
declare function atob(data: string): string;

function redirectToStaffLogin(req: NextRequest, error?: string) {
  const returnTo = sanitizeReturnTo(`${req.nextUrl.pathname}${req.nextUrl.search}`);
  const destination = new URL("/staff/login", req.url);
  destination.searchParams.set("returnTo", returnTo);
  if (error) destination.searchParams.set("error", error);
  return NextResponse.redirect(destination);
}

function startsWithPath(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

export default async function proxy(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER || "";
  const pass = process.env.BASIC_AUTH_PASS || "";

  // Avoid locking yourself out if env vars aren't set yet
  if (user && pass) {
    const auth = req.headers.get("authorization");
    if (auth) {
      const [type, encoded] = auth.split(" ");
      if (type === "Basic" && encoded) {
        try {
          // Edge-safe base64 decode
          const decoded = atob(encoded);
          const idx = decoded.indexOf(":");
          const u = idx >= 0 ? decoded.slice(0, idx) : decoded;
          const p = idx >= 0 ? decoded.slice(idx + 1) : "";
          if (u === user && p === pass) {
            // Continue to optional staff auth checks below.
          } else {
            return new NextResponse("Authentication required", {
              status: 401,
              headers: { "WWW-Authenticate": 'Basic realm="Morpeth Preview"' },
            });
          }
        } catch {
          // ignore malformed auth header
          return new NextResponse("Authentication required", {
            status: 401,
            headers: { "WWW-Authenticate": 'Basic realm="Morpeth Preview"' },
          });
        }
      } else {
        return new NextResponse("Authentication required", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="Morpeth Preview"' },
        });
      }
    } else {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Morpeth Preview"' },
      });
    }
  }

  const pathname = req.nextUrl.pathname;
  const isStaffPath = startsWithPath(pathname, "/staff");
  const isStaffLoginPath = pathname === "/staff/login";
  const isStaffAuthApiPath = startsWithPath(pathname, "/api/staff-auth");

  if (!isStaffPath || isStaffLoginPath || isStaffAuthApiPath) {
    return NextResponse.next();
  }

  if (!isStaffAuthConfigured()) {
    return redirectToStaffLogin(req, "configuration");
  }

  const token = req.cookies.get(STAFF_SESSION_COOKIE)?.value;
  if (!token) {
    return redirectToStaffLogin(req);
  }

  const secret = process.env.STAFF_AUTH_SECRET || "";
  const session = await readStaffSessionFromToken(token, secret);
  if (!session) {
    return redirectToStaffLogin(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
