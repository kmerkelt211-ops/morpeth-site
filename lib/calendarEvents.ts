import * as ical from "node-ical";

const ICS_URL = "https://www.morpethschool.org.uk/calendar/events.ics";
const LOOKBACK_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 500;

type IcalEventCandidate = {
  type?: string;
  summary?: string;
  start?: Date | string;
  end?: Date | string;
  location?: string;
  url?: string;
};

export type CalendarEvent = {
  title: string;
  start: string;
  end?: string;
  location?: string;
  url?: string;
};

let lastKnownGoodEvents: CalendarEvent[] = [];

function clampLimit(limit?: number): number {
  if (!Number.isFinite(limit)) return DEFAULT_LIMIT;
  const n = Math.trunc(limit as number);
  if (n < 1) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

function toDate(value?: Date | string): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function parseEventsFromIcs(text: string): CalendarEvent[] {
  const data = ical.sync.parseICS(text);
  const nowCutoff = Date.now() - LOOKBACK_MS;

  return Object.values(data as Record<string, IcalEventCandidate>)
    .filter((entry) => entry?.type === "VEVENT" && !!entry.summary && !!entry.start)
    .flatMap((entry) => {
      const startDate = toDate(entry.start);
      const endDate = toDate(entry.end);
      if (!startDate) return [];

      return [
        {
          title: entry.summary as string,
          start: startDate.toISOString(),
          end: endDate ? endDate.toISOString() : undefined,
          location: entry.location || "",
          url: entry.url || "",
        },
      ] satisfies CalendarEvent[];
    })
    .filter((entry) => {
      const endOrStart = new Date(entry.end || entry.start).getTime();
      return endOrStart >= nowCutoff;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export async function getCalendarEvents(limit?: number): Promise<CalendarEvent[]> {
  const safeLimit = clampLimit(limit);

  try {
    const response = await fetch(ICS_URL, {
      next: { revalidate: 300 },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`Calendar fetch failed: ${response.status}`);

    const text = await response.text();
    const parsed = parseEventsFromIcs(text);
    if (parsed.length > 0) {
      lastKnownGoodEvents = parsed;
    }
    return parsed.slice(0, safeLimit);
  } catch {
    return lastKnownGoodEvents.slice(0, safeLimit);
  }
}
