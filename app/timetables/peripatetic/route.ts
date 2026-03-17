import { NextResponse } from "next/server";
import { serverEnv } from "../../../lib/env";

export async function GET(req: Request) {
  if (serverEnv.peripateticTimetableUrl) {
    return NextResponse.redirect(serverEnv.peripateticTimetableUrl);
  }

  const fallback = new URL("/contact", req.url);
  fallback.searchParams.set("topic", "music-lessons");
  return NextResponse.redirect(fallback);
}
