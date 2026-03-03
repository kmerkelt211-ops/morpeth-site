// app/api/events/route.ts
export const runtime = "nodejs";
export const revalidate = 300;

import { NextResponse } from "next/server";
import { getCalendarEvents } from "../../../lib/calendarEvents";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const events = await getCalendarEvents(limit);
    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json([], {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600",
      },
    });
  }
}
