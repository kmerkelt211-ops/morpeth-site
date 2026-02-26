// app/api/events/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCalendarEvents } from "../../../lib/calendarEvents";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const events = await getCalendarEvents(limit);
    return NextResponse.json(events);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
