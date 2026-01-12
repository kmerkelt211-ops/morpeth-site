import { NextRequest, NextResponse } from "next/server";

// `atob` is available in the Edge runtime, but may not be typed depending on TS lib settings.
declare function atob(data: string): string;

export function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER || "";
  const pass = process.env.BASIC_AUTH_PASS || "";

  // Avoid locking yourself out if env vars aren't set yet
  if (!user || !pass) return NextResponse.next();

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
        if (u === user && p === pass) return NextResponse.next();
      } catch {
        // ignore malformed auth header
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Morpeth Preview"' },
  });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};