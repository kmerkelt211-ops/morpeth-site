// app/api/events/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import * as ical from 'node-ical';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Use HTTPS (webcal:// can't be fetched by Node)
    const icsUrl = 'https://www.morpethschool.org.uk/calendar/events.ics';

    const res = await fetch(icsUrl, { cache: 'no-store', redirect: 'follow' });
    if (!res.ok) return NextResponse.json([], { status: 200 });

    const text = await res.text();
    const data = ical.sync.parseICS(text);

    const now = Date.now() - 24 * 60 * 60 * 1000; // keep events from yesterday onwards

    const events = Object.values<any>(data)
      .filter((e: any) => e?.type === 'VEVENT' && e.summary && e.start)
      .map((e: any) => ({
        title: e.summary as string,
        start: e.start instanceof Date ? e.start.toISOString() : String(e.start),
        end: e.end instanceof Date ? e.end.toISOString() : (e.end ? String(e.end) : undefined),
        location: e.location || '',
        url: e.url || '',
      }))
      .filter((e) => new Date(e.end || e.start).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, limit);

    return NextResponse.json(events);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}