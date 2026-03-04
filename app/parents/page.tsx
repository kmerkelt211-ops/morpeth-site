"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import HeroVideo from "../components/HeroVideo";

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

type QuickLink = { label: string; href: string };
type AttendanceScaleTone = "brightGreen" | "green" | "amber" | "red";

type AttendanceScaleRow = {
  judgement: string;
  attendance: string;
  daysAbsent: string;
  tone: AttendanceScaleTone;
  summaryText?: string;
};

type ParentsAttendanceContent = {
  card: {
    eyebrow: string;
    title: string;
    description: string;
    phoneLabel: string;
    phoneDisplay: string;
    phoneHref: string;
    emailLabel: string;
    emailAddress: string;
    buttonLabel: string;
    buttonHelper: string;
  };
  modal: {
    heading: string;
    whyTitle: string;
    whyParagraphs: string[];
    scaleTitle: string;
    scaleIntroParagraphs: string[];
    scaleRows: AttendanceScaleRow[];
    summaryTitle: string;
    reportingTitle: string;
    reportingParagraphs: string[];
    reportingPhoneLabel: string;
    reportingPhoneDisplay: string;
    reportingPhoneHref: string;
    reportingEmailLabel: string;
    reportingEmailAddress: string;
    punctualityTitle: string;
    punctualityParagraphs: string[];
    concernTitle: string;
    concernParagraphs: string[];
    termTimeTitle: string;
    termTimeParagraphs: string[];
    policyTitle: string;
    policyParagraphs: string[];
    policyButtonLabel: string;
    policyButtonHref: string;
  };
};

type PartialParentsResponse = Partial<{
  attendanceCard: Partial<ParentsAttendanceContent["card"]>;
  attendanceModal: Partial<ParentsAttendanceContent["modal"]>;
}>;

const DEFAULT_ATTENDANCE_CONTENT: ParentsAttendanceContent = {
  card: {
    eyebrow: "Attendance",
    title: "Attendance & absence",
    description: "Good attendance is essential for progress. Please report any absence before 8:30am.",
    phoneLabel: "Phone",
    phoneDisplay: "020 8898 1000",
    phoneHref: "tel:02088981000",
    emailLabel: "Email",
    emailAddress: "attendance@morpethschool.org.uk",
    buttonLabel: "Open attendance & absence guidance",
    buttonHelper: "Opens a guidance window on this page.",
  },
  modal: {
    heading: "Attendance & absence",
    whyTitle: "Why it matters",
    whyParagraphs: [
      "We want every child to be in school, on time, every day they are well enough to attend. Good attendance supports learning, friendships and wellbeing.",
      "Even a few days off each term can quickly add up and mean important learning is missed or hard to catch up on.",
    ],
    scaleTitle: "How we judge attendance",
    scaleIntroParagraphs: [
      "Good attendance and punctuality underpins academic achievement and wellbeing. Students with great attendance are far more likely to succeed beyond school and be adults who live happy, healthy lives.",
      "At Morpeth, we judge attendance on the following scale:",
    ],
    scaleRows: [
      {
        judgement: "Excellent",
        attendance: "98%+",
        daysAbsent: "Absent for 4 days or less",
        tone: "brightGreen",
        summaryText: "98%+ attendance (absent for 4 days or less in a school year).",
      },
      {
        judgement: "Good",
        attendance: "95–97%",
        daysAbsent: "Absent for 9 days or less",
        tone: "green",
        summaryText: "95–97% attendance (absent for up to 9 days in a school year).",
      },
      {
        judgement: "Concern",
        attendance: "90–94%",
        daysAbsent: "Between 11 and 19 days off school",
        tone: "amber",
        summaryText: "90–94% attendance (between 11 and 19 days off school).",
      },
      {
        judgement: "Serious concern",
        attendance: "Below 90%",
        daysAbsent: "More than 19 days off school",
        tone: "red",
        summaryText: "Below 90% attendance (more than 19 days off school).",
      },
    ],
    summaryTitle: "In summary:",
    reportingTitle: "Reporting an absence",
    reportingParagraphs: [
      "If your child is unwell and cannot attend school, please contact us before 8:30am on each day of absence.",
      "Please tell us your child's full name, tutor group and the reason for their absence. Let us know how long you expect them to be off and update us if this changes.",
    ],
    reportingPhoneLabel: "Phone",
    reportingPhoneDisplay: "020 8898 1000",
    reportingPhoneHref: "tel:02088981000",
    reportingEmailLabel: "Email",
    reportingEmailAddress: "attendance@morpethschool.org.uk",
    punctualityTitle: "Punctuality",
    punctualityParagraphs: [
      "Arriving on time helps pupils start the day calmly and not miss tutor time or the beginning of lessons.",
      "Persistent lateness, even by a few minutes, can add up to hours of lost learning over a term and may be recorded as unauthorised absence after the register has closed.",
    ],
    concernTitle: "If we are worried about attendance",
    concernParagraphs: [
      "We will always try to work with families to remove barriers to good attendance. This might include phone calls, letters, meetings in school and support from our pastoral team.",
      "Where attendance does not improve and remains low, we may need to involve the local authority Education Welfare Service, and in some cases formal action or penalty notices may be considered.",
    ],
    termTimeTitle: "Term-time leave & appointments",
    termTimeParagraphs: [
      "Please try to arrange medical and dental appointments outside of the school day wherever possible. If this cannot be avoided, your child should attend school for part of the day before or after the appointment.",
      "Family holidays should not be taken during term time. Requests for leave can only be authorised in genuinely exceptional circumstances and may require evidence.",
    ],
    policyTitle: "Full attendance & punctuality policy",
    policyParagraphs: [
      "If you would like more detail about how we monitor, support and celebrate attendance, you can read our full Attendance and Punctuality Policy. It explains our approach, the legal framework and the roles of students, families and staff.",
      "The policy also sets out the staged intervention process we use to support pupils whose attendance drops, and how we work with the local authority where attendance remains a serious concern.",
    ],
    policyButtonLabel: "Download Attendance & Punctuality Policy (PDF)",
    policyButtonHref: "/Documents/Morpeth-School-Attendance-and-Punctuality-Policy-2024-25.pdf",
  },
};

const scaleToneClasses: Record<
  AttendanceScaleTone,
  { mobile: string; desktop: string; desktopText: string }
> = {
  brightGreen: {
    mobile: "bg-[#b7f66a] text-slate-900",
    desktop: "bg-[#b7f66a]",
    desktopText: "text-slate-900",
  },
  green: {
    mobile: "bg-[#9cd062] text-slate-900",
    desktop: "bg-[#9cd062]",
    desktopText: "text-slate-900",
  },
  amber: {
    mobile: "bg-[#f4a05c] text-slate-900",
    desktop: "bg-[#f4a05c]",
    desktopText: "text-slate-900",
  },
  red: {
    mobile: "bg-[#f2574f] text-white",
    desktop: "bg-[#f2574f]",
    desktopText: "text-white",
  },
};

function mergeAttendanceContent(
  raw: PartialParentsResponse | null | undefined
): ParentsAttendanceContent {
  if (!raw) return DEFAULT_ATTENDANCE_CONTENT;

  const card = { ...DEFAULT_ATTENDANCE_CONTENT.card, ...(raw.attendanceCard ?? {}) };
  const modal = {
    ...DEFAULT_ATTENDANCE_CONTENT.modal,
    ...(raw.attendanceModal ?? {}),
    whyParagraphs:
      raw.attendanceModal?.whyParagraphs?.length
        ? raw.attendanceModal.whyParagraphs
        : DEFAULT_ATTENDANCE_CONTENT.modal.whyParagraphs,
    scaleIntroParagraphs:
      raw.attendanceModal?.scaleIntroParagraphs?.length
        ? raw.attendanceModal.scaleIntroParagraphs
        : DEFAULT_ATTENDANCE_CONTENT.modal.scaleIntroParagraphs,
    scaleRows:
      raw.attendanceModal?.scaleRows?.length
        ? raw.attendanceModal.scaleRows
            .filter(
              (row): row is AttendanceScaleRow =>
                !!row?.judgement && !!row?.attendance && !!row?.daysAbsent
            )
            .map((row) => ({
              ...row,
              tone: row.tone || "brightGreen",
            }))
        : DEFAULT_ATTENDANCE_CONTENT.modal.scaleRows,
    reportingParagraphs:
      raw.attendanceModal?.reportingParagraphs?.length
        ? raw.attendanceModal.reportingParagraphs
        : DEFAULT_ATTENDANCE_CONTENT.modal.reportingParagraphs,
    punctualityParagraphs:
      raw.attendanceModal?.punctualityParagraphs?.length
        ? raw.attendanceModal.punctualityParagraphs
        : DEFAULT_ATTENDANCE_CONTENT.modal.punctualityParagraphs,
    concernParagraphs:
      raw.attendanceModal?.concernParagraphs?.length
        ? raw.attendanceModal.concernParagraphs
        : DEFAULT_ATTENDANCE_CONTENT.modal.concernParagraphs,
    termTimeParagraphs:
      raw.attendanceModal?.termTimeParagraphs?.length
        ? raw.attendanceModal.termTimeParagraphs
        : DEFAULT_ATTENDANCE_CONTENT.modal.termTimeParagraphs,
    policyParagraphs:
      raw.attendanceModal?.policyParagraphs?.length
        ? raw.attendanceModal.policyParagraphs
        : DEFAULT_ATTENDANCE_CONTENT.modal.policyParagraphs,
  };

  return { card, modal };
}

type ChipButtonProps = QuickLink & {
  className?: string;
  onOpen?: (item: QuickLink) => void;
};

function ChipButton({ label, href, className, onOpen }: ChipButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (onOpen) {
          onOpen({ label, href });
        } else {
          window.location.assign(href);
        }
      }}
      className={className ?? chip}
      aria-haspopup="dialog"
      aria-controls="parents-overlay"
    >
      {label}
    </button>
  );
}

export default function ParentsPage() {
  const subscribeHref = "webcal://www.morpethschool.org.uk/calendar/events.ics";

  // Overlay state
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<QuickLink | null>(null);
  const [attendanceContent, setAttendanceContent] = useState<ParentsAttendanceContent>(
    DEFAULT_ATTENDANCE_CONTENT
  );

  useEffect(() => {
    let mounted = true;

    async function fetchParentsContent() {
      try {
        const response = await fetch("/api/parents-page", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as PartialParentsResponse;
        if (mounted) {
          setAttendanceContent(mergeAttendanceContent(data));
        }
      } catch {
        // Keep fallback content if Sanity content is unavailable.
      }
    }

    fetchParentsContent();

    return () => {
      mounted = false;
    };
  }, []);

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

  const overlayHeading =
    active?.href === "/attendance" ? attendanceContent.modal.heading : active?.label;

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

  // Render overlay content by target "href"
  const renderOverlayContent = (item: QuickLink) => {
    if (item.href === "/supporting-your-child") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="font-heading text-[15px] uppercase tracking-[0.16em] text-morpeth-navy">
              Supporting your child
            </h3>

            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Day-to-day support at home
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Check Edulink daily for messages, homework and timetable changes.</li>
                  <li>Help your child maintain regular sleep, attendance and study routines.</li>
                  <li>Use the calendar and letters pages to stay ahead of deadlines and events.</li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/edulink"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Open Edulink guide
                  </a>
                  <a
                    href="/letters-home"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Letters home
                  </a>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Wellbeing, safeguarding and advice
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  If you are concerned about your child&apos;s wellbeing, attendance, behaviour or online safety,
                  please contact the school so we can help quickly.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/contact#message"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Contact pastoral team
                  </a>
                  <a
                    href="/policies#safeguarding"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Safeguarding policies
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }

    if (item.href === "/forms") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="font-heading text-[15px] uppercase tracking-[0.16em] text-morpeth-navy">
              Useful forms
            </h3>

            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Common parent requests
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Use the links below for common requests. If you are not sure which form you need, contact the
                  school office and we will route it correctly.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://benefitforms.towerhamlets.gov.uk/VictoriaForms/Viewer-VicForms.asp?user=anon&Form=Free%20School%20Meals%20(1.1).wdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Free School Meals application
                  </a>
                  <a
                    href="/contact#message"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Medical updates / trip queries
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }

    if (item.href === "/data-protection") {
      return (
        <div className="h-[calc(100%-44px)] w-full overflow-y-auto p-5 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h3 className="font-heading text-[15px] uppercase tracking-[0.16em] text-morpeth-navy">
              Data protection
            </h3>
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  Policy documents
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                <p>
                  Read all current data and safeguarding policy documents in the policy hub.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/policies#data"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    Open data protection policies
                  </a>
                </div>
              </div>
            </section>
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
                    href="/Documents/7.-Uniform-List-2025.pdf"
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
                    href="/policies#data"
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
              {attendanceContent.modal.heading}
            </h3>

            {/* Why attendance matters */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  {attendanceContent.modal.whyTitle}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                {attendanceContent.modal.whyParagraphs.map((paragraph) => (
                  <p key={`${attendanceContent.modal.whyTitle}-${paragraph.slice(0, 24)}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* How we judge attendance */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  {attendanceContent.modal.scaleTitle}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-4 text-[15px] text-slate-900">
                {attendanceContent.modal.scaleIntroParagraphs.map((paragraph) => (
                  <p key={`${attendanceContent.modal.scaleTitle}-${paragraph.slice(0, 24)}`}>
                    {paragraph}
                  </p>
                ))}

                {/* Mobile: stacked scale cards */}
                <div className="md:hidden space-y-3">
                  {attendanceContent.modal.scaleRows.map((row) => {
                    const tone = scaleToneClasses[row.tone] ?? scaleToneClasses.brightGreen;

                    return (
                      <div
                        key={`mobile-${row.judgement}-${row.attendance}`}
                        className={`rounded-2xl border border-slate-200/80 p-4 ${tone.mobile}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold">{row.judgement}</p>
                          <p className="text-sm font-semibold">{row.attendance}</p>
                        </div>
                        <p className="mt-2 text-sm">{row.daysAbsent} (per year)</p>
                      </div>
                    );
                  })}
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
                      {attendanceContent.modal.scaleRows.map((row) => {
                        const tone = scaleToneClasses[row.tone] ?? scaleToneClasses.brightGreen;

                        return (
                          <tr
                            key={`desktop-${row.judgement}-${row.attendance}`}
                            className={`${tone.desktop} ${tone.desktopText}`}
                          >
                            <td className="px-4 py-3 font-semibold">{row.judgement}</td>
                            <td className="px-4 py-3">{row.attendance}</td>
                            <td className="px-4 py-3">{row.daysAbsent}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Text version for accessibility */}
                <div className="text-[14px] leading-relaxed text-slate-900">
                  <p className="font-semibold">{attendanceContent.modal.summaryTitle}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {attendanceContent.modal.scaleRows.map((row) => (
                      <li key={`summary-${row.judgement}-${row.attendance}`}>
                        <strong>{row.judgement}</strong> –{" "}
                        {row.summaryText || `${row.attendance} attendance (${row.daysAbsent}).`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Reporting an absence */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  {attendanceContent.modal.reportingTitle}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                {attendanceContent.modal.reportingParagraphs.slice(0, 1).map((paragraph) => (
                  <p key={`reporting-intro-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    {attendanceContent.modal.reportingPhoneLabel}:{" "}
                    <a
                      href={attendanceContent.modal.reportingPhoneHref}
                      className="underline underline-offset-2"
                    >
                      {attendanceContent.modal.reportingPhoneDisplay}
                    </a>
                  </li>
                  <li>
                    {attendanceContent.modal.reportingEmailLabel}:{" "}
                    <a
                      href={`mailto:${attendanceContent.modal.reportingEmailAddress}`}
                      className="underline underline-offset-2"
                    >
                      {attendanceContent.modal.reportingEmailAddress}
                    </a>
                  </li>
                </ul>
                {attendanceContent.modal.reportingParagraphs.slice(1).map((paragraph) => (
                  <p key={`reporting-body-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Punctuality */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  {attendanceContent.modal.punctualityTitle}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                {attendanceContent.modal.punctualityParagraphs.map((paragraph) => (
                  <p key={`punctuality-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* When attendance is a concern */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  {attendanceContent.modal.concernTitle}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                {attendanceContent.modal.concernParagraphs.map((paragraph) => (
                  <p key={`concern-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Term-time leave & appointments */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  {attendanceContent.modal.termTimeTitle}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                {attendanceContent.modal.termTimeParagraphs.map((paragraph) => (
                  <p key={`term-time-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Attendance policy document */}
            <section className="rounded-2xl border border-morpeth-navy/15 bg-white/90 shadow-sm">
              <div className="border-b border-morpeth-navy/10 px-5 py-3">
                <h4 className="font-heading text-[13px] uppercase tracking-[0.16em] text-morpeth-navy/90">
                  {attendanceContent.modal.policyTitle}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-[15px] text-slate-900">
                {attendanceContent.modal.policyParagraphs.map((paragraph) => (
                  <p key={`policy-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href={attendanceContent.modal.policyButtonHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                  >
                    {attendanceContent.modal.policyButtonLabel}
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
                    href="/policies#data"
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

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      {/* HERO — matches home page design */}
      <section className="relative bg-morpeth-navy text-morpeth-light">
        <HeroVideo src="/video/morpeth-drone-hero.mp4" pageKey="parents" />

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
                <ChipButton label="View term dates" href="/term-dates" onOpen={openOverlay} />
                <ChipButton label="View full calendar" href="/calendar" onOpen={openOverlay} />
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
                  <ChipButton label="Uniform & equipment" href="/uniform" onOpen={openOverlay} />
                </li>
                <li>
                  <ChipButton label="School lunches & menus" href="/school-lunches" onOpen={openOverlay} />
                </li>
                <li>
                  <ChipButton label="Payments / ParentPay" href="/payments" onOpen={openOverlay} />
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
                <ChipButton label="Letters home" href="/letters-home" onOpen={openOverlay} />
                <ChipButton label="Edulink" href="/edulink" onOpen={openOverlay} />
                <ChipButton label="Supporting your child" href="/supporting-your-child" onOpen={openOverlay} />
                <ChipButton label="Contact us" href="/contact" onOpen={openOverlay} />
              </div>
            </article>

            {/* Attendance */}
            <article className={card}>
              <p className={sectionTitle}>{attendanceContent.card.eyebrow}</p>
              <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                {attendanceContent.card.title}
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                {attendanceContent.card.description}
              </p>
              <div className="mt-3 text-sm text-slate-800">
                <p>
                  {attendanceContent.card.phoneLabel}:{" "}
                  <a
                    href={attendanceContent.card.phoneHref}
                    className="underline underline-offset-2"
                  >
                    {attendanceContent.card.phoneDisplay}
                  </a>
                </p>
                <p className="mt-1">
                  {attendanceContent.card.emailLabel}:{" "}
                  <a
                    href={`mailto:${attendanceContent.card.emailAddress}`}
                    className="underline underline-offset-2"
                  >
                    {attendanceContent.card.emailAddress}
                  </a>
                </p>
              </div>
              <div className="mt-4">
                <ChipButton
                  label={attendanceContent.card.buttonLabel}
                  href="/attendance"
                  onOpen={openOverlay}
                />
                <p className="mt-2 text-xs text-slate-600">
                  {attendanceContent.card.buttonHelper}
                </p>
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
                  onOpen={openOverlay}
                />
                <ChipButton
                  label="Safeguarding & child protection"
                  href="/safeguarding"
                  className={chipCompact}
                  onOpen={openOverlay}
                />
                <ChipButton
                  label="SEN information report"
                  href="/policies"
                  className={chipCompact}
                  onOpen={openOverlay}
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
                    onOpen={openOverlay}
                  />
                </li>
                <li>
                  <ChipButton
                    label="Free School Meals application"
                    href="/forms"
                    onOpen={openOverlay}
                  />
                </li>
                <li>
                  <ChipButton label="Trip consent" href="/forms" onOpen={openOverlay} />
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
            <ChipButton label="Join our staff" href="/jobs" onOpen={openOverlay} />
            <ChipButton label="Contact the school" href="/contact" onOpen={openOverlay} />
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
              <div>
                <h2 className="font-heading text-[13px] uppercase tracking-[0.22em] text-morpeth-navy">
                  {overlayHeading}
                </h2>
                {active.href === "/attendance" ? (
                  <p className="mt-1 text-xs text-slate-600">
                    Use this window for absence reporting, attendance bands and policy details.
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {/* fallback open in a new tab if needed */}
                {!["/uniform", "/payments", "/attendance", "/safeguarding", "/supporting-your-child", "/forms", "/data-protection"].includes(active.href) ? (
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
