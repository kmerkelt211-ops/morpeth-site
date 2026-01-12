// app/term-dates/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Term Dates 2025/26 • Morpeth School",
  description:
    "Official term dates for the 2025/26 academic year including half-term breaks and staff training days.",
};

type Row = { label: string; dates: string };

function TermBlock({
  title,
  rows,
}: {
  title: string;
  rows: Row[];
}) {
  return (
    <section className="mt-10 rounded-2xl border border-morpeth-navy/20 bg-white/90 shadow-sm">
      <div className="border-b border-morpeth-navy/10 px-6 py-4">
        <h2 className="font-heading text-[14px] uppercase tracking-[0.18em] text-morpeth-navy md:text-[15px]">
          {title}
        </h2>
      </div>

      <div className="divide-y divide-morpeth-navy/10">
        {rows.map((r) => (
          <div key={r.label} className="px-6 py-4 md:flex md:items-baseline md:justify-between">
            <p className="font-heading text-[12px] uppercase tracking-[0.18em] text-morpeth-navy/80 md:text-[13px]">
              {r.label}
            </p>
            <p className="mt-1 text-[16px] leading-snug text-slate-900 md:mt-0">
              {r.dates}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TermDatesPage() {
  const autumn: Row[] = [
    { label: "Term 1", dates: "Monday 1st September 2025 - Friday 24th October 2025" },
    { label: "Half term", dates: "Monday 27th October 2025 - Friday 31st October 2025" },
    { label: "Term 1 (cont.)", dates: "Monday 3rd November 2025 - Friday 19th December 2025" },
    { label: "Christmas break", dates: "Monday 22nd December 2025 - Friday 2nd January 2026" },
  ];

  const spring: Row[] = [
    { label: "Term 2", dates: "Monday 5th January 2026 - Friday 13th February 2026" },
    { label: "Half term", dates: "Monday 16th February 2026 - Friday 20th February 2026" },
    { label: "Term 2 (cont.)", dates: "Monday 23rd February 2026 - Friday 27th March 2026" },
    { label: "Easter break", dates: "Monday 30th March 2026 - Friday 10th April 2026" },
  ];

  const summer: Row[] = [
    { label: "Term 3", dates: "Monday 13th April 2026 - Friday 22nd May 2026" },
    { label: "Half term", dates: "Monday 25th May 2026 - Friday 29th May 2026" },
    { label: "Term 3 (cont.)", dates: "Monday 1st June 2026 – Friday 17th July 2026" },
  ];

  const training: Row[] = [
    { label: "Training day", dates: "Monday 1st September 2025" },
    { label: "Training day", dates: "Tuesday 2nd September 2025" },
    { label: "Training day", dates: "Friday 28th November 2025" },
    { label: "Training day", dates: "Friday 19th June 2026" },
  ];

  return (
    <main className="bg-gradient-to-b from-morpeth-light/30 to-white">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-heading text-[18px] uppercase tracking-[0.18em] text-morpeth-navy md:text-[20px]">
            School Term Dates <span className="opacity-60">2025/2026</span>
          </h1>

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/files/Term-Dates-2025-26.pdf"
              target="_blank"
              className="rounded-full border border-morpeth-navy/30 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:bg-morpeth-light/50"
            >
              Download PDF
            </Link>

            <a
              href="webcal://www.morpethschool.org.uk/calendar/events.ics"
              className="rounded-full border border-morpeth-navy/30 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:bg-morpeth-light/50"
            >
              Subscribe (ICS)
            </a>

            <Link
              href="/calendar"
              className="rounded-full bg-morpeth-light px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:bg-morpeth-light/80"
            >
              View full calendar
            </Link>
          </div>
        </header>

        {/* Blocks */}
        <TermBlock title="Autumn Term" rows={autumn} />
        <TermBlock title="Spring Term" rows={spring} />
        <TermBlock title="Summer Term" rows={summer} />

        <section className="mt-10 rounded-2xl border border-amber-900/15 bg-amber-50/80 shadow-sm">
          <div className="border-b border-amber-900/10 px-6 py-4">
            <h2 className="font-heading text-[14px] uppercase tracking-[0.18em] text-amber-900 md:text-[15px]">
              Staff Training Days
            </h2>
          </div>
          <div className="divide-y divide-amber-900/10">
            {training.map((r, i) => (
              <div key={i} className="px-6 py-4 md:flex md:items-baseline md:justify-between">
                <p className="font-heading text-[12px] uppercase tracking-[0.18em] text-amber-900/90 md:text-[13px]">
                  {r.label}
                </p>
                <p className="mt-1 text-[16px] leading-snug text-slate-900 md:mt-0">{r.dates}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-morpeth-navy/20 bg-white/90 shadow-sm px-6 py-6">
          <h2 className="font-heading text-[14px] uppercase tracking-[0.18em] text-morpeth-navy md:text-[15px] mb-2">
            PDF Copy
          </h2>
          <p className="mb-4 text-sm text-morpeth-navy/80">
            Please click the link below to download a PDF copy:
          </p>
          <Link
            href="/files/Term-Dates-2025-26.pdf"
            className="inline-block rounded-full border border-morpeth-navy/30 bg-white/70 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:bg-morpeth-light/50"
            target="_blank"
          >
            2025-26 TERM DATES
          </Link>
        </section>

        {/* Back link (works in overlay and standalone) */}
        <div className="mt-10">
          <Link
            href="/parents"
            className="inline-flex items-center rounded-full border border-morpeth-navy/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:bg-morpeth-light/50"
          >
            ← Back to Parents
          </Link>
        </div>
      </div>
    </main>
  );
}