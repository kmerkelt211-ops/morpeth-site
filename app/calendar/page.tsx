import Link from "next/link";

// Event shape coming from /api/events
type CalendarEvent = {
  title: string;
  start: string; // ISO
  end?: string; // ISO
  location?: string;
  url?: string;
  category?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function formatMonthLabel(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatDateBadge(iso: string) {
  const d = new Date(iso);
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" })
    .format(d)
    .toUpperCase();
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" })
    .format(d)
    .toUpperCase();
  const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(d);
  return { weekday, month, day, date: d };
}

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  // Treat midnight as all‑day (most ICS all‑day entries come through as 00:00)
  if (h === 0 && m === 0) return "";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isPastDay(d: Date) {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d < todayMidnight;
}

// --- Category helpers -------------------------------------------------------
const categoryStyles: Record<string, { dot: string; badgeBg: string; badgeText: string; ring?: string }> = {
  Parents:   { dot: "bg-rose-500",   badgeBg: "bg-rose-100",   badgeText: "text-rose-900",   ring: "ring-rose-300" },
  Closure:   { dot: "bg-amber-500",  badgeBg: "bg-amber-100",  badgeText: "text-amber-900",  ring: "ring-amber-300" },
  Exams:     { dot: "bg-indigo-500", badgeBg: "bg-indigo-100", badgeText: "text-indigo-900", ring: "ring-indigo-300" },
  Trips:     { dot: "bg-teal-500",   badgeBg: "bg-teal-100",   badgeText: "text-teal-900",   ring: "ring-teal-300" },
  "Sixth Form": { dot: "bg-purple-500", badgeBg: "bg-purple-100", badgeText: "text-purple-900", ring: "ring-purple-300" },
  General:   { dot: "bg-morpeth-navy", badgeBg: "bg-morpeth-offwhite", badgeText: "text-morpeth-navy", ring: "ring-morpeth-navy/10" },
};

function deriveCategory(ev: CalendarEvent): string {
  const t = `${ev.title} ${ev.location ?? ""}`.toLowerCase();
  if (/(parent|parents'|parents’)/.test(t)) return "Parents";
  if (/(training day|closed|closure|inset)/.test(t)) return "Closure";
  if (/(exam|mock)/.test(t)) return "Exams";
  if (/(trip|visit|excursion)/.test(t)) return "Trips";
  if (/(sixth form|yr ?12|yr ?13|year 12|year 13)/.test(t)) return "Sixth Form";
  return "General";
}

// --- Month id helpers -------------------------------------------------------
function monthId(label: string) {
  return `month-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
function shortMonthLabel(label: string) {
  const m = label.split(" ")[0];
  return m.slice(0, 3);
}

// Sticky month navigation (server-safe, no hooks)
function MonthNav({ months, currentMonth }: { months: string[]; currentMonth: string }) {
  return (
    <div className="sticky top-16 md:top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <nav className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {months.map((m) => {
            const isActive = m === currentMonth;
            return (
              <a
                key={m}
                href={`#${monthId(m)}`}
                className={[
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ring-1 transition",
                  isActive
                    ? "bg-morpeth-navy text-white ring-morpeth-navy"
                    : "bg-morpeth-offwhite text-morpeth-navy ring-morpeth-navy/20 hover:ring-morpeth-navy/40",
                ].join(" ")}
              >
                <span className="md:hidden">{shortMonthLabel(m)}</span>
                <span className="hidden md:inline">{m}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export const revalidate = 0; // always fresh

export const metadata = {
  title: "School calendar",
};

export default async function CalendarPage() {
  const res = await fetch(`${baseUrl}/api/events?limit=300`, { cache: "no-store" });
  const events: CalendarEvent[] = res.ok ? await res.json() : [];

  // sort ascending
  events.sort((a, b) => +new Date(a.start) - +new Date(b.start));

  // group by month
  const grouped = events.reduce((acc, ev) => {
    const key = formatMonthLabel(ev.start);
    (acc[key] ||= []).push(ev);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const today = new Date();
  const months = Object.keys(grouped);
  const currentMonthLabel = formatMonthLabel(new Date().toISOString());
  const currentMonth = months.includes(currentMonthLabel) ? currentMonthLabel : months[0] || "";

  return (
    <main className="bg-white">
      {/* Mini month nav */}
      {months.length > 0 && <MonthNav months={months} currentMonth={currentMonth} />}

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
              Calendar &amp; Events
            </p>
            <h1 className="mt-2 text-2xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-3xl md:tracking-[0.18em]">
              School calendar
            </h1>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:flex-wrap">
              <a
                href="webcal://www.morpethschool.org.uk/calendar/events.ics"
                className="w-full md:w-auto text-center rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] md:tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                Subscribe via iCal
              </a>
              <Link
                href="/"
                className="w-full md:w-auto text-center rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] md:tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {events.length === 0 && (
          <div className="rounded-xl bg-morpeth-offwhite p-6 text-slate-700 shadow-sm">
            No upcoming events.
          </div>
        )}

        {/* Month sections with timeline rail */}
        <div className="space-y-12">
          {Object.entries(grouped).map(([month, list]) => (
            <section
              key={month}
              id={monthId(month)}
              className="relative scroll-mt-32 md:scroll-mt-24 pl-6 md:pl-8 before:absolute before:left-2 md:before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-slate-200/70"
            >
              <div className="sticky top-28 md:top-0 z-10 -ml-6 md:-ml-8 mb-4 border-y border-slate-200/70 bg-white/80 px-6 md:px-8 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-morpeth-navy">
                  {month}
                </h2>
              </div>

              <ul className="grid gap-4">
                {list.map((ev, i) => {
                  const { weekday, month: mmm, day, date } = formatDateBadge(ev.start);
                  const startTime = formatTime(ev.start);
                  const endTime = formatTime(ev.end);
                  const isToday = sameDay(date, today);
                  const past = isPastDay(date);

                  const category = ev.category || deriveCategory(ev);
                  const style = categoryStyles[category] || categoryStyles["General"];

                  return (
                    <li
                      key={`${ev.start}-${i}`}
                      className={[
                        "group relative grid grid-cols-[80px_1fr] md:grid-cols-[92px_1fr] gap-4 md:gap-6 rounded-2xl border bg-white p-3 md:p-4 shadow-sm transition",
                        "border-slate-200/70 hover:shadow-md hover:-translate-y-0.5",
                        past ? "opacity-60 hover:opacity-100" : "",
                        `before:absolute before:-left-[7px] md:before:-left-[9px] before:top-6 before:h-2 before:w-2 before:rounded-full ${style.dot}`
                      ].join(" ")}
                    >
                      {/* Date badge */}
                      <div className="flex h-full flex-col items-center justify-center rounded-xl bg-morpeth-offwhite px-3 py-3 text-morpeth-navy ring-1 ring-morpeth-navy/10 group-hover:ring-morpeth-navy/20">
                        <span className="text-[10px] font-semibold tracking-[0.28em] opacity-70">
                          {weekday}
                        </span>
                        <span className="mt-0.5 text-3xl font-bold leading-none">{day}</span>
                        <span className="mt-0.5 text-[10px] font-semibold tracking-[0.28em] opacity-70">
                          {mmm}
                        </span>
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="w-full text-base font-medium leading-snug text-slate-900 md:w-auto md:text-lg">
                            {ev.title}
                          </div>
                          <span className={[
                            "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ring-1",
                            style.badgeBg,
                            style.badgeText,
                            style.ring ?? "ring-black/5",
                          ].join(" ")}>{category}</span>
                          {isToday && (
                            <span className="rounded-full bg-morpeth-light/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-morpeth-navy ring-1 ring-morpeth-light/60">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          {(startTime || endTime) && (
                            <span>
                              {startTime}
                              {endTime ? ` – ${endTime}` : ""}
                            </span>
                          )}
                          {(!startTime && !endTime) && <span>All day</span>}
                          {ev.location && (
                            <span className="before:mx-2 before:text-slate-300 before:content-['•']">
                              {ev.location}
                            </span>
                          )}
                          {ev.url && (
                            <a
                              href={ev.url}
                              className="underline underline-offset-4 hover:opacity-80"
                            >
                              More info
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}