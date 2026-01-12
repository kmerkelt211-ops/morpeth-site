"use client";

import { useEffect, useState, useCallback } from "react";
import { useRef } from "react";
import Link from "next/link";

/**
 * Parents & Carers — landing page
 * Client component so we can open lightweight overlays
 * without navigating away.
 */

const chip =
  "rounded-full bg-morpeth-light/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-morpeth-light/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-morpeth-mid";

const chipCompact =
  "w-full rounded-2xl bg-morpeth-light/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] leading-tight text-center text-morpeth-navy transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-morpeth-light/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-morpeth-mid";

const card =
  "rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70 p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:hover:scale-[1.01]";

const sectionTitle =
  "text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid";

// Small helper so we can intercept link clicks and show an overlay instead
type QuickLink = { label: string; href: string };

const RAW_LINKS: QuickLink[] = [
  { label: "Term dates", href: "/term-dates" },
  { label: "Uniform", href: "/uniform" },
  { label: "Letters home", href: "/letters-home" },
  { label: "Supporting your child", href: "/supporting-your-child" },
  { label: "Edulink", href: "/edulink" },
  { label: "School lunches", href: "/school-lunches" },
  { label: "Payments", href: "/payments" },
  { label: "Attendance", href: "/attendance" },
  { label: "Safeguarding", href: "/safeguarding" },
  { label: "Policies", href: "/policies" },
  { label: "Data Protection", href: "/data-protection" }, // ← new
  { label: "Contact", href: "/contact" },
];

// Quick normalisation so anything not built yet still shows something helpful
const normalise = (l: QuickLink): QuickLink => l;

export default function ParentsPage() {
  const subscribeHref = "webcal://www.morpethschool.org.uk/calendar/events.ics";
  const quickLinks = RAW_LINKS.map(normalise);

  // Overlay state
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<QuickLink | null>(null);

  const openOverlay = useCallback((item: QuickLink) => {
    setActive(item);
    setOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setOpen(false);
    // small timeout so iframe has time to unload visually
    setTimeout(() => setActive(null), 200);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOverlay]);

  // Hide header on scroll down
  useEffect(() => {
    let lastScroll = 0;
    const threshold = 60;
    const root = document.documentElement;

    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > threshold) {
        root.setAttribute("data-header-hidden", "true");
      } else {
        root.removeAttribute("data-header-hidden");
      }
      lastScroll = current;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reusable chip as a button that opens the overlay
  const ChipButton = ({ label, href, className }: QuickLink & { className?: string }) => (
    <button
      type="button"
      onClick={() => openOverlay({ label, href })}
      className={className ?? chip}
      aria-haspopup="dialog"
      aria-controls="parents-overlay"
    >
      {label}
    </button>
  );

  // Render overlay content by target "href"
  const renderOverlayContent = (item: QuickLink) => {
    if (item.href === "/supporting-your-child") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
          </div>
        </div>
      );
    }
    // Inline Uniform content (no new route required)
    if (item.href === "/uniform") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="font-heading text-[15px] uppercase tracking-[0.16em] text-morpeth-navy">
              School uniform
            </h3>

            {/* Autumn & Spring — for all pupils */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Autumn Term and Spring Term — for all pupils
                </h4>
              </div>
              <div className="px-5 py-4">
                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-900">
                  <li>Morpeth School blazer</li>
                  <li>
                    Morpeth School skirt with logo, or black school trousers or black tailored,
                    uniform shorts
                  </li>
                  <li>
                    Morpeth School cardigan, or Morpeth v-neck jumper, or Morpeth sleeveless v-neck
                    jumper
                  </li>
                  <li>A light blue shirt (short or long-sleeved)</li>
                  <li>Morpeth school tie</li>
                </ul>

                <div className="mt-4 rounded-xl bg-morpeth-light/40 p-4">
                  <p className="font-semibold text-morpeth-navy text-[14px]">
                    Pupils may choose to wear the following items:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-slate-900">
                    <li>Morpeth School salwar kameez</li>
                    <li>Plain black headscarf – no markings, no embroidery</li>
                  </ul>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/70 p-4">
                    <p className="font-semibold text-morpeth-navy text-[14px]">Footwear</p>
                    <p className="mt-1 text-[15px] text-slate-900">
                      All pupils should wear plain, black shoes or plain black trainers. Laces must
                      be black.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/70 p-4">
                    <p className="font-semibold text-morpeth-navy text-[14px]">Coats / jackets</p>
                    <p className="mt-1 text-[15px] text-slate-900">
                      Coats and jackets, if worn over a blazer, should be black or navy blue and
                      plain with no lettering, logos, patterns or coloured markings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* PE kit */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  PE kit
                </h4>
              </div>
              <div className="px-5 py-4">
                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-900">
                  <li>Morpeth School PE top</li>
                  <li>Black shorts</li>
                  <li>Black tracksuit bottoms</li>
                  <li>Trainers</li>
                </ul>
              </div>
            </section>

            {/* Summer term */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Summer Term
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Pupils may remove their blazers in school. However, it is still part of their
                  uniform so we are also clear that:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Pupils must bring their blazer to school with them every day.</li>
                  <li>
                    They may choose to wear a Morpeth jumper with or without their blazer or they
                    may choose just to wear a shirt and tie.
                  </li>
                  <li>
                    However, if they are wearing a jacket, hoodie or coat, they must have a blazer
                    underneath. If they are not warm enough without an additional layer, then it
                    should be their blazer.
                  </li>
                  <li>Removal of ties will be reviewed depending on the temperature.</li>
                </ul>
              </div>
            </section>

            {/* Where to buy */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Where to buy
                </h4>
              </div>
              <div className="px-5 py-4 space-y-2 text-[15px] text-slate-900">
                <p>
                  All items of school uniform can be purchased from:
                </p>
                <p>
                  <span className="font-semibold">Khalsa</span>, 388 Bethnal Green Road, E2 0AH
                </p>
                <p>
                  <a
                    href="https://www.khalsaschoolwear.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                  >
                    www.khalsaschoolwear.co.uk
                  </a>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="https://www.khalsaschoolwear.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Shop online
                  </a>
                  <a
                    href="/documents/7.-Uniform-List-2025.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Download uniform list (PDF)
                  </a>
                </div>
              </div>
            </section>

            {/* Sixth Form dress code */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Sixth Form dress code
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Sixth formers are expected to dress appropriately for school and to wear their
                  lanyard at all times so that they can be identified as a Morpeth student.
                </p>
                <p>Students are not permitted to wear the niqab in school.</p>
              </div>
            </section>
          </div>
        </div>
      );
    }

    // Special-case: Payments overlay
    if (item.href === "/payments") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="font-heading text-[15px] uppercase tracking-[0.16em] text-morpeth-navy">
              Payments &amp; biometrics
            </h3>

            {/* Online payments */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Paying for school meals &amp; trips
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  We use{" "}
                  <a
                    href="https://www.ipayimpact.co.uk/IPI/Account/LogOn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                  >
                    iPayimpact
                  </a>{" "}
                  for online payments for school meals, trips and other items.
                </p>
                <p>
                  You&apos;ll receive login details when your child joins Morpeth. Please keep your
                  account topped up so your child can use the canteen.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="https://www.ipayimpact.co.uk/IPI/Account/LogOn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Log in to iPayimpact
                  </a>
                </div>
              </div>
            </section>

            {/* Biometrics */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Biometrics
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  At Morpeth we operate a cashless meals system. We use bio-metrics for this
                  purpose and you will be asked to opt in to this when your child joins us.
                </p>
                <p>
                  The same system is also used in our library for the purpose of loaning books.
                </p>
                <p>
                  Learn more about biometrics and our service provider, CRB Cunninghams, and how we
                  keep your child&apos;s data safe.
                </p>
              </div>
            </section>

            {/* Further information */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Find out more
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://www.crbcunninghams.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Learn about biometrics (CRB Cunninghams)
                  </a>
                  <a
                    href="/data-protection"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    View Morpeth School&apos;s Biometrics Policy
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }

    // Special-case: Attendance overlay
    if (item.href === "/attendance") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="font-heading text-[15px] uppercase tracking-[0.16em] text-morpeth-navy">
              Attendance &amp; absence
            </h3>

            {/* Why attendance matters */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Why it matters
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  We want every child to be in school, on time, every day they are well enough to
                  attend. Good attendance supports learning, friendships and wellbeing.
                </p>
                <p>
                  Even a few days off each term can quickly add up and mean important learning is
                  missed or hard to catch up on.
                </p>
              </div>
            </section>

            {/* How we judge attendance */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  How we judge attendance
                </h4>
              </div>
              <div className="px-5 py-4 space-y-4 text-[15px] text-slate-900">
                <p>
                  Good attendance and punctuality underpins academic achievement and wellbeing.
                  Students with great attendance are far more likely to succeed beyond school and
                  be adults who live happy, healthy lives.
                </p>
                <p>
                  At Morpeth, we judge attendance on the following scale:
                </p>

                {/* Mobile: stacked scale cards */}
                <div className="md:hidden space-y-3">
                  <div className="rounded-2xl border border-slate-200/80 bg-[#b7f66a] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-slate-900">Excellent</p>
                      <p className="text-sm font-semibold text-slate-900">98%+</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-900">Absent for 4 days or less (per year)</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-[#9cd062] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-slate-900">Good</p>
                      <p className="text-sm font-semibold text-slate-900">95–97%</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-900">Absent for 9 days or less (per year)</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-[#f4a05c] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-slate-900">Concern</p>
                      <p className="text-sm font-semibold text-slate-900">90–94%</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-900">Between 11 and 19 days off school (per year)</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-[#f2574f] p-4 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">Serious concern</p>
                      <p className="text-sm font-semibold">Below 90%</p>
                    </div>
                    <p className="mt-2 text-sm">More than 19 days off school (per year)</p>
                  </div>
                </div>

                {/* Desktop: table */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80">
                  <table className="w-full text-[15px] text-slate-900">
                    <thead>
                      <tr className="bg-slate-50 text-left">
                        <th className="px-4 py-3 font-semibold">Judgement</th>
                        <th className="px-4 py-3 font-semibold">Attendance</th>
                        <th className="px-4 py-3 font-semibold">Days absent (per year)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#b7f66a]">
                        <td className="px-4 py-3 font-semibold">Excellent</td>
                        <td className="px-4 py-3">98%+</td>
                        <td className="px-4 py-3">Absent for 4 days or less</td>
                      </tr>
                      <tr className="bg-[#9cd062]">
                        <td className="px-4 py-3 font-semibold">Good</td>
                        <td className="px-4 py-3">95–97%</td>
                        <td className="px-4 py-3">Absent for 9 days or less</td>
                      </tr>
                      <tr className="bg-[#f4a05c]">
                        <td className="px-4 py-3 font-semibold">Concern</td>
                        <td className="px-4 py-3">90–94%</td>
                        <td className="px-4 py-3">Between 11 and 19 days off school</td>
                      </tr>
                      <tr className="bg-[#f2574f] text-white">
                        <td className="px-4 py-3 font-semibold">Serious concern</td>
                        <td className="px-4 py-3">Below 90%</td>
                        <td className="px-4 py-3">More than 19 days off school</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Text version for accessibility */}
                <div className="text-[14px] leading-relaxed text-slate-900">
                  <p className="font-semibold">In summary:</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>
                      <strong>Excellent</strong> – 98%+ attendance (absent for 4 days or less in a
                      school year).
                    </li>
                    <li>
                      <strong>Good</strong> – 95–97% attendance (absent for up to 9 days in a school
                      year).
                    </li>
                    <li>
                      <strong>Concern</strong> – 90–94% attendance (between 11 and 19 days off
                      school).
                    </li>
                    <li>
                      <strong>Serious concern</strong> – below 90% attendance (more than 19 days off
                      school).
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Reporting an absence */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Reporting an absence
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  If your child is unwell and cannot attend school, please contact us before
                  <strong> 8:30am</strong> on each day of absence.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Phone: <a href="tel:02088981000" className="underline underline-offset-2">020 8898 1000</a>
                  </li>
                  <li>
                    Email: {" "}
                    <a
                      href="mailto:attendance@morpethschool.org.uk"
                      className="underline underline-offset-2"
                    >
                      attendance@morpethschool.org.uk
                    </a>
                  </li>
                </ul>
                <p>
                  Please tell us your child&apos;s full name, tutor group and the reason for their
                  absence. Let us know how long you expect them to be off and update us if this
                  changes.
                </p>
              </div>
            </section>

            {/* Punctuality */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Punctuality
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Arriving on time helps pupils start the day calmly and not miss tutor time or the
                  beginning of lessons.
                </p>
                <p>
                  Persistent lateness, even by a few minutes, can add up to hours of lost learning
                  over a term and may be recorded as unauthorised absence after the register has
                  closed.
                </p>
              </div>
            </section>

            {/* When attendance is a concern */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  If we are worried about attendance
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  We will always try to work with families to remove barriers to good attendance.
                  This might include phone calls, letters, meetings in school and support from our
                  pastoral team.
                </p>
                <p>
                  Where attendance does not improve and remains low, we may need to involve the
                  local authority Education Welfare Service, and in some cases formal action or
                  penalty notices may be considered.
                </p>
              </div>
            </section>

            {/* Term-time leave & appointments */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Term-time leave &amp; appointments
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Please try to arrange medical and dental appointments outside of the school day
                  wherever possible. If this cannot be avoided, your child should attend school for
                  part of the day before or after the appointment.
                </p>
                <p>
                  Family holidays should not be taken during term time. Requests for leave can only
                  be authorised in genuinely exceptional circumstances and may require evidence.
                </p>
              </div>
            </section>

            {/* Attendance policy document */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Full attendance &amp; punctuality policy
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  If you would like more detail about how we monitor, support and celebrate
                  attendance, you can read our full Attendance and Punctuality Policy. It explains
                  our approach, the legal framework and the roles of students, families and staff.
                </p>
                <p>
                  The policy also sets out the staged intervention process we use to support pupils
                  whose attendance drops, and how we work with the local authority where attendance
                  remains a serious concern.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href="/documents/Morpeth-School-Attendance-and-Punctuality-Policy-2024-25.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Download Attendance &amp; Punctuality Policy (PDF)
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }

    // Special-case: Safeguarding overlay
    if (item.href === "/safeguarding") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="font-heading text-[15px] uppercase tracking-[0.16em] text-morpeth-navy">
              Safeguarding
            </h3>

            {/* Safeguarding statement */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Our approach
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Morpeth School recognises that safeguarding and promoting the welfare of children
                  is everyone&apos;s responsibility. Everyone who comes into contact with children
                  and their families has a role to play in keeping them safe.
                </p>
                <p>
                  All staff and visitors are expected to take a child-centred approach, considering
                  at all times what is in the best interests of the child.
                </p>
              </div>
            </section>

            {/* Key contacts */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Designated safeguarding staff
                </h4>
              </div>
              <div className="px-5 py-4 space-y-2 text-[15px] text-slate-900">
                <p>
                  <span className="font-semibold">Designated Safeguarding Lead (DSL):</span>{" "}
                  Craig Griffiths
                </p>
                <p>
                  <span className="font-semibold">Deputy Safeguarding Leads:</span>{" "}
                  Kate Sheldon and Jannatul Khijra
                </p>
                <p>
                  <span className="font-semibold">Safeguarding Practitioner:</span>{" "}
                  Lorna Brown
                </p>
                <p className="mt-3">
                  If you have any concerns about a child&apos;s safety or wellbeing, please contact
                  a member of the safeguarding team via the school office as soon as possible.
                </p>
              </div>
            </section>

            {/* Guidance & policies */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Guidance &amp; key documents
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Our safeguarding practice is underpinned by national statutory guidance and local
                  procedures. You can learn more using the links below.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <a
                      href="https://www.gov.uk/government/publications/keeping-children-safe-in-education--2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                    >
                      Keeping Children Safe in Education
                    </a>{" "}
                    – statutory guidance for schools and colleges (Department for Education)
                  </li>
                  <li>
                    Child Protection Advice Line, Tower Hamlets – information and contact details
                    are available via the local authority website.
                  </li>
                  <li>
                    E-safety and acceptable use – see our policies on pupil and staff use of ICT and
                    online safety.
                  </li>
                </ul>
              </div>
            </section>

            {/* CEOP & online safety */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Online safety &amp; CEOP
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  CEOP is a command of the National Crime Agency and is dedicated to tackling the
                  sexual abuse and exploitation of children and young people.
                </p>
                <p>
                  If you are worried about online sexual abuse or the way someone has been
                  communicating with a child online, you can make a report directly to CEOP.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href="https://www.ceop.police.uk/safety-centre/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Visit CEOP Safety Centre
                  </a>
                </div>
              </div>
            </section>

            {/* Data & related policies */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Related policies
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Our safeguarding work links closely to how we use CCTV and manage data in school.
                  You can read the full policies below.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <a
                      href="/Documents/Safeguarding/CCTV-Policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                    >
                      CCTV Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/Documents/Safeguarding/Data-Protection-Policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                    >
                      Data Protection Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/Documents/Safeguarding/Data-Retention-Policy-1.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                    >
                      Data Retention Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/Documents/Safeguarding/Data-Disposal-Policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                    >
                      Data Disposal Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/Documents/Safeguarding/Data-Breach-Policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-morpeth-navy hover:text-morpeth-mid"
                    >
                      Data Breach Policy
                    </a>
                  </li>
                </ul>
                <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
                  <a
                    href="/policies"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    View all school policies
                  </a>
                  <a
                    href="/data-protection"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Data protection information
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }

    // Fallback: show target page in an iframe
    return (
      <iframe
        title={item.label}
        src={item.href}
        className="h-[calc(100%-44px)] w-full border-0"
        loading="lazy"
      />
    );
  };

  const faqs = [
    {
      q: "How do I report my child absent?",
      a: "Please call the school office before 8:30am or email the attendance team with your child’s name, tutor group and reason for absence.",
    },
    {
      q: "What time does the school day start and finish?",
      a: "Registration starts at 8:40am and the day usually finishes at 3:15pm. Clubs and rehearsals often run later (see the calendar).",
    },
    {
      q: "How do I get updates about trips, clubs and closures?",
      a: "Check ‘Letters home’ and the school calendar. Urgent messages are also sent via Edulink.",
    },
  ];

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      {/* HERO — matches home page design */}
      <section className="relative bg-morpeth-navy text-morpeth-light">
        {/* Background video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/video/parents-hero.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-morpeth-navy/65 to-morpeth-navy/85" />
        </div>

        {/* Content layer */}
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
            Morpeth School · Parents &amp; Carers
          </p>

          <h1 className="mt-4 font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">
            Information you need, in one place
          </h1>

          <p className="mt-5 max-w-2xl text-sm md:text-base text-morpeth-light/90">
            Quick access to key links, forms, support and day‑to‑day essentials.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="#essentials"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Key links for parents
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-morpeth-light/70 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light hover:bg-morpeth-light/10 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Contact the school
            </Link>
          </div>
        </div>
      </section>

      {/* Essentials */}
      <section id="essentials" className="bg-morpeth-light/25">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Term dates & calendar */}
            <article className={card}>
              <p className={sectionTitle}>Dates &amp; calendar</p>
              <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                Term dates &amp; key events
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                Full term dates, INSET days and upcoming events.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {/* open overlay (calendar for now) */}
                <ChipButton label="View term dates" href="/term-dates" />
                <ChipButton label="View full calendar" href="/calendar" />
                <a href={subscribeHref} className={chip}>
                  Subscribe (webcal)
                </a>
              </div>
            </article>

            {/* Uniform & lunches */}
            <article className={card}>
              <p className={sectionTitle}>Daily essentials</p>
              <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                Uniform, lunches &amp; payments
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-slate-800">
                <li>
                  <ChipButton label="Uniform & equipment" href="/uniform" />
                </li>
                <li>
                  <ChipButton label="School lunches & menus" href="/school-lunches" />
                </li>
                <li>
                  <ChipButton label="Payments / ParentPay" href="/payments" />
                </li>
              </ul>
            </article>

            {/* Communication */}
            <article className={card}>
              <p className={sectionTitle}>Communication</p>
              <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                Letters home &amp; Edulink
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                Keep up to date with messages, trip details and reports.
              </p>
            <div className="mt-4 flex flex-wrap gap-2">
                <ChipButton label="Letters home" href="/letters-home" />
                <ChipButton label="Edulink" href="/edulink" />
                <ChipButton label="Supporting your child" href="/supporting-your-child" />
                <ChipButton label="Contact us" href="/contact" />
              </div>
            </article>

            {/* Attendance */}
            <article className={card}>
              <p className={sectionTitle}>Attendance</p>
              <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                Attendance &amp; absence
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                Good attendance is essential for progress. Please report any absence before 8:30am.
              </p>
              <div className="mt-3 text-sm text-slate-800">
                <p>
                  Phone:{" "}
                  <a href="tel:02088981000" className="underline underline-offset-2">
                    020 8898 1000
                  </a>
                </p>
                <p className="mt-1">
                  Email:{" "}
                  <a
                    href="mailto:attendance@morpethschool.org.uk"
                    className="underline underline-offset-2"
                  >
                    attendance@morpethschool.org.uk
                  </a>
                </p>
              </div>
              <div className="mt-4">
                <ChipButton label="Attendance guidance" href="/attendance" />
              </div>
            </article>

            {/* School day card */}
            <article className={card}>
              <p className={sectionTitle}>School day</p>
              <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                School hours (2025/26)
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                Typical week = <strong>32.5 hours</strong>
              </p>
              <p className="mt-1 text-sm text-slate-800">
                <span className="font-semibold">NB.</span> On Week 2 Wednesdays, school ends at <strong>2:45pm</strong>.
              </p>
              <div className="mt-4">
                <a
                  href="/Documents/Timings-of-the-school-day-2025-26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={chip}
                >
                  Download timings PDF
                </a>
              </div>
              <div className="mt-6 rounded-2xl border border-morpeth-navy/15 bg-white/90 p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-morpeth-mid">
                  Entrances &amp; exits
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-800">
                  <li>Years 7 &amp; 8 – Morpeth Street main gates</li>
                  <li>Year 9 – Morpeth Street ‘staff entrance’ (by car park entrance)</li>
                  <li>Years 10 &amp; 11 – Portman Place, West Wing playground</li>
                  <li>Years 12 &amp; 13 – Wessex Wing</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Downloads / policies */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <article className={card}>
              <p className={sectionTitle}>Policies</p>
              <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                Key policies
              </h3>
              <div className="mt-3 grid gap-2">
                <ChipButton
                  label="Behaviour & anti-bullying"
                  href="/policies"
                  className={chipCompact}
                />
                <ChipButton
                  label="Safeguarding & child protection"
                  href="/safeguarding"
                  className={chipCompact}
                />
                <ChipButton
                  label="SEN information report"
                  href="/policies"
                  className={chipCompact}
                />
              </div>
            </article>

            <article className={card}>
              <p className={sectionTitle}>Forms</p>
              <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                Useful forms
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-800">
                <li>
                  <ChipButton
                    label="Medication / medical updates"
                    href="/forms"
                  />
                </li>
                <li>
                  <ChipButton
                    label="Free School Meals application"
                    href="/forms"
                  />
                </li>
                <li>
                  <ChipButton label="Trip consent" href="/forms" />
                </li>
              </ul>
            </article>

            <article className={card}>
              <p className={sectionTitle}>FAQs</p>
              <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                Common questions
              </h3>
              <div className="mt-2">
                {[
                  {
                    q: "How do I report my child absent?",
                    a: "Please call the school office before 8:30am or email the attendance team with your child’s name, tutor group and reason for absence.",
                  },
                  {
                    q: "What time does the school day start and finish?",
                    a: "Registration starts at 8:40am and the day usually finishes at 3:15pm. Clubs and rehearsals often run later (see the calendar).",
                  },
                  {
                    q: "How do I get updates about trips, clubs and closures?",
                    a: "Check ‘Letters home’ and the school calendar. Urgent messages are also sent via Edulink.",
                  },
                ].map((f) => (
                  <details key={f.q} className="group rounded-lg p-2">
                    <summary className="cursor-pointer text-sm font-medium text-morpeth-navy">
                      {f.q}
                    </summary>
                    <p className="mt-1 text-sm text-slate-800">{f.a}</p>
                  </details>
                ))}
              </div>
            </article>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <ChipButton label="Join our staff" href="/jobs" />
            <ChipButton label="Contact the school" href="/contact" />
          </div>
        </div>
      </section>

      {/* Overlay */}
      {open && active ? (
        <div
          id="parents-overlay"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-3 md:p-6"
          onClick={(e) => {
            // close when clicking the backdrop only
            if (e.target === e.currentTarget) closeOverlay();
          }}
        >
          <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl bg-white ring-1 ring-slate-300 shadow-2xl overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <h2 className="font-heading text-[13px] uppercase tracking-[0.22em] text-morpeth-navy">
                {active.label}
              </h2>
              <div className="flex items-center gap-2">
                {/* fallback open in a new tab if needed */}
                {!["/uniform", "/payments", "/attendance", "/safeguarding"].includes(active.href) ? (
                  <Link
                    href={active.href}
                    target="_blank"
                    className="hidden md:inline rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Open page
                  </Link>
                ) : null}
                <button
                  onClick={closeOverlay}
                  className="rounded-full border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-50"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </header>

            {/* Load the target page inside an iframe so we don't navigate away */}
            {renderOverlayContent(active)}
          </div>
        </div>
      ) : null}
    </main>
  );
}