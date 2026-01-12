'use client';

import { useEffect, useRef, useState } from 'react';

type CalendarEvent = {
  title: string;
  start: string;
  end?: string;
  location?: string;
  url?: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

export default function EventsStrip({ limit = 12 }: { limit?: number }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Fetch upcoming events from the API route you already built
  useEffect(() => {
    let active = true;
    fetch(`/api/events?limit=${limit}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setEvents([]);
      });
    return () => {
      active = false;
    };
  }, [limit]);

  // Simple auto-scroll (loop), pause on hover
  useEffect(() => {
    const el = trackRef.current;
    if (!el || events.length === 0) return;

    let raf = 0;
    const step = () => {
      if (!paused) {
        el.scrollLeft += 0.6; // speed
        // loop when we hit the end
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, events.length]);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4 md:p-6">
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[12px] md:text-sm tracking-[.25em] font-semibold text-morpeth-light uppercase">
          Upcoming events
        </h3>
        <div className="flex items-center gap-2">
          <a
            href="/calendar"
            className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            View full calendar
          </a>
          <a
            href="webcal://www.morpethschool.org.uk/calendar/events.ics"
            className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Subscribe
          </a>
        </div>
      </div>

      {/* Auto-scrolling strip */}
      <div
        ref={trackRef}
        className="no-scrollbar relative flex gap-3 overflow-x-auto scroll-smooth"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Upcoming events carousel"
      >
        {events.length === 0 ? (
          <div className="px-2 text-sm text-slate-500">No upcoming events.</div>
        ) : (
          // duplicate array to create a smooth loop
          [...events, ...events].map((e, i) => (
            <article
              key={`${e.title}-${i}`}
              className="min-w-[240px] sm:min-w-[280px] md:min-w-[320px] shrink-0 rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4"
            >
              <div className="text-xs uppercase tracking-wide text-slate-500">
                {formatDate(e.start)}
              </div>
              <h4 className="mt-1 font-semibold leading-snug text-morpeth-navy">
                {e.title}
              </h4>
              {e.location ? (
                <div className="mt-1 text-xs text-slate-500">{e.location}</div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}