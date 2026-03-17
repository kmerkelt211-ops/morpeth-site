"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroVideo from "./components/HeroVideo";
import SchoolAssistantSection from "./components/SchoolAssistantSection";
import {
  ImmersiveTimelineSection,
  LifeAtMorpethSection,
  ParentsStripSection,
  ResultsSection as ResultsSectionBlock,
  SchoolPulseSection,
  SixthFormHighlightSection,
  SpotlightWallSection,
} from "./components/home/HomeContentSections";
import { safeTrack, trackExperimentAssignment } from "../lib/analytics";
import { getOrAssignExperimentVariant } from "../lib/experiments";
import type { HomePageInitialData } from "../lib/homePageData";

const btnBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow-lg md:px-6 md:py-3 md:text-xs md:tracking-[0.18em] md:hover:scale-[1.01] active:translate-y-0";

type AudienceKey = "prospective" | "parent" | "student" | "staff";
type HeroVariant = "community" | "achievement";
const DEFAULT_AUDIENCE: AudienceKey = "prospective";
const DEFAULT_HERO_VARIANT: HeroVariant = "community";

const audienceOptions: { key: AudienceKey; label: string }[] = [
  { key: "prospective", label: "Prospective family" },
  { key: "parent", label: "Current parent" },
  { key: "student", label: "Student" },
  { key: "staff", label: "Staff / applicant" },
];

function trackCta(name: string, properties?: Record<string, string>) {
  safeTrack(name, properties);
}

/* ===== HERO WITH DRONE VIDEO ===== */

function Hero({ variant }: { variant: HeroVariant }) {
  return (
    <section className="relative overflow-hidden bg-morpeth-navy text-morpeth-light" data-kpi-section="hero">
      <HeroVideo
        src="/video/morpeth-drone-hero.mp4"
        pageKey="home"
        preload="auto"
      />

      <div
        className="pointer-events-none absolute -left-20 top-14 h-56 w-56 rounded-full bg-morpeth-light/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-60 w-60 rounded-full bg-morpeth-mid/35 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-30 mx-auto flex min-h-[60vh] md:min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
          Morpeth School · Bethnal Green
        </p>
        <h1 className="mt-4 font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">
          Where everyone belongs,
          <br className="hidden md:block" />
          everyone achieves.
        </h1>
        <p className="mt-5 max-w-xl text-sm md:text-base text-morpeth-light/90">
          We are a community committed to learning and achievement, based on
          friendship and respect, where everyone is valued and known.
        </p>
        <p className="mt-3 max-w-xl text-xs md:text-sm text-morpeth-light/85" suppressHydrationWarning>
          {variant === "community"
            ? "Behind every grade is a story of hard work, resilience and pride. Here, people believe in you, and that changes everything."
            : "Students are challenged, coached and celebrated so they leave Morpeth ready for ambitious next steps in study, work and life."}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/95">
            High expectations
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/95">
            Strong sixth form pathways
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/95">
            East London community
          </span>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact#message"
            className={`${btnBase} bg-morpeth-light text-morpeth-navy`}
            onClick={() => trackCta("homepage_cta_click", { section: "hero", cta: "book_visit" })}
          >
            Book a visit
          </Link>
          <Link
            href="/sixth-form"
            className={`${btnBase} border border-morpeth-light/70 text-morpeth-light bg-transparent`}
            onClick={() => trackCta("homepage_cta_click", { section: "hero", cta: "explore_sixth_form" })}
          >
            Explore sixth form
          </Link>
          <a
            href="/Documents/prospectus.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} border border-morpeth-light/40 text-morpeth-light/80 bg-transparent`}
            onClick={() => trackCta("homepage_cta_click", { section: "hero", cta: "prospectus_download" })}
          >
            Download prospectus (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== GENERIC SCROLL REVEAL COMPONENT =====
type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
};

function Reveal({ children, delay = 0, className = "", direction = "up" }: RevealProps) {
  return (
    <div
      className={className}
      data-reveal={direction}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

function AudienceJourneys({
  audience,
  onAudienceChange,
}: {
  audience: AudienceKey;
  onAudienceChange: (next: AudienceKey) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const journeyByAudience: Record<
    AudienceKey,
    {
      title: string;
      description: string;
      href: string;
      cta: string;
      tag: string;
    }[]
  > = {
    prospective: [
      {
        title: "Prospective families",
        description: "See our culture, curriculum and outcomes before your visit.",
        href: "/our-school",
        cta: "Explore our school",
        tag: "Admissions",
      },
      {
        title: "Book a visit",
        description: "Arrange a tour and speak directly with our admissions team.",
        href: "/contact#message",
        cta: "Arrange visit",
        tag: "Open day",
      },
      {
        title: "Admissions pathway",
        description: "Check key dates, guidance and application steps.",
        href: "/#admissions-pathway",
        cta: "Open admissions pathway",
        tag: "Application",
      },
      {
        title: "Parent hub preview",
        description: "See day-to-day systems families use once they join.",
        href: "/parents",
        cta: "Open parent hub",
        tag: "Next step",
      },
    ],
    parent: [
      {
        title: "Parents & carers",
        description: "Term dates, letters, Edulink and practical day-to-day guidance.",
        href: "/parents",
        cta: "Open parent hub",
        tag: "Current families",
      },
      {
        title: "Letters home",
        description: "Latest notices and school communications in one place.",
        href: "/letters-home",
        cta: "Open letters",
        tag: "Communication",
      },
      {
        title: "School lunches",
        description: "Current monthly menu and allergen information.",
        href: "/school-lunches",
        cta: "View menus",
        tag: "Daily essentials",
      },
      {
        title: "Term dates",
        description: "Plan holidays and important school periods quickly.",
        href: "/term-dates",
        cta: "View term dates",
        tag: "Planning",
      },
    ],
    student: [
      {
        title: "Students",
        description: "Discover subjects, support and opportunities beyond the classroom.",
        href: "/teaching-learning",
        cta: "View teaching & learning",
        tag: "Learning journey",
      },
      {
        title: "Extracurricular",
        description: "Find clubs, sport, arts and leadership activities.",
        href: "/extracurricular",
        cta: "Browse activities",
        tag: "Beyond lessons",
      },
      {
        title: "Latest achievements",
        description: "See student stories, highlights and celebration updates.",
        href: "/student-spotlights",
        cta: "Open spotlights",
        tag: "Spotlights",
      },
      {
        title: "Sixth form routes",
        description: "Explore post-16 options, support and progression.",
        href: "/sixth-form",
        cta: "Explore sixth form",
        tag: "Next stage",
      },
    ],
    staff: [
      {
        title: "Join our staff",
        description: "Work with a team that believes in ambition, care and community.",
        href: "/jobs",
        cta: "See vacancies",
        tag: "Careers",
      },
      {
        title: "Staff area",
        description: "Access staff resources, systems and directory links.",
        href: "/staff",
        cta: "Open staff area",
        tag: "Current staff",
      },
      {
        title: "Our culture",
        description: "Learn about values, standards and school community.",
        href: "/our-school",
        cta: "Read more",
        tag: "Working here",
      },
      {
        title: "Recruitment contact",
        description: "Ask questions about opportunities and hiring timelines.",
        href: "/contact#message",
        cta: "Send enquiry",
        tag: "Enquiries",
      },
    ],
  };

  const routes: {
    title: string;
    description: string;
    href: string;
    cta: string;
    tag: string;
  }[] = journeyByAudience[audience];
  const activeAudienceLabel = audienceOptions.find((option) => option.key === audience)?.label ?? "Selected role";

  const hideJourneys = () => {
    setIsExpanded(false);
    trackCta("homepage_audience_cards_hidden", { audience });
  };

  const handleAudienceSelect = (next: AudienceKey) => {
    if (isExpanded && audience === next) {
      hideJourneys();
      return;
    }

    onAudienceChange(next);
    setAnimationCycle((prev) => prev + 1);
    setIsExpanded(true);
    trackCta("homepage_audience_selected", { audience: next });
  };

  return (
    <section className="bg-white" data-kpi-section="journey-selector">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">Start here</p>
          <h2 className="mt-2 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.65rem] md:tracking-[0.18em]">
            Pick your journey
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-700">
            Choose a role and the shortcut cards appear only when you need them.
          </p>
        </Reveal>

        <div className="-mx-1 mt-5 overflow-x-auto px-1 pb-1 no-scrollbar touch-pan-x">
          <div className="flex w-max min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
            {audienceOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] transition ${
                  audience === option.key && isExpanded
                    ? "bg-morpeth-navy text-white shadow-md shadow-morpeth-navy/20"
                    : "border border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-50"
                }`}
                aria-pressed={audience === option.key && isExpanded}
                onClick={() => handleAudienceSelect(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {isExpanded ? `Showing shortcuts for ${activeAudienceLabel}` : "Select a role to reveal tailored cards"}
          </p>
          {isExpanded ? (
            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:text-morpeth-mid"
              onClick={hideJourneys}
            >
              Hide cards
              <span aria-hidden="true">↑</span>
            </button>
          ) : null}
        </div>

        {isExpanded ? (
          <div key={`${audience}-${animationCycle}`} className="journey-panel-enter mt-6 grid gap-4 sm:grid-cols-2">
            {routes.map((route, idx) => (
              <Reveal
                key={`${audience}-${route.title}`}
                delay={idx * 85}
                direction={idx % 2 === 0 ? "left" : "right"}
              >
                <article
                  className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-white via-morpeth-offwhite/75 to-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg md:p-6 ${
                    idx === 0 ? "border-morpeth-mid/65 ring-2 ring-morpeth-mid/20" : "border-slate-200"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(210,226,252,0.8),transparent_58%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-morpeth-mid/35 to-transparent opacity-70" />
                  <div className="relative">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-morpeth-mid">
                      {route.tag}
                    </p>
                    <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">
                      {route.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{route.description}</p>
                    <Link
                      href={route.href}
                      className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy underline underline-offset-4"
                      onClick={() =>
                        trackCta("homepage_cta_click", {
                          section: "audience_journey",
                          cta: route.cta.toLowerCase().replace(/\s+/g, "_"),
                        })
                      }
                    >
                      {route.cta}
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function AdmissionsFunnel({
  audience,
  heroVariant,
}: {
  audience: AudienceKey;
  heroVariant: HeroVariant;
}) {
  const currentYear = new Date().getFullYear();
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    childYearGroup: "year5",
    admissionYear: currentYear + 1,
    enquiryType: "book_visit",
    message: "",
    website: "",
  });
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [enquiryId, setEnquiryId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const isSubmitting = submitState === "submitting";

  const updateField = (field: keyof typeof formState, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setSubmitError("");
    setEnquiryId("");
    trackCta("admissions_form_submit_attempt", {
      section: "admissions_funnel",
      enquiry_type: String(formState.enquiryType),
    });

    try {
      const response = await fetch("/api/admissions-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          sourcePage: "/",
          audienceSegment: audience,
          heroVariant,
        }),
      });

      const body = (await response.json()) as { ok?: boolean; error?: string; enquiryId?: string };
      if (!response.ok || !body.ok) {
        throw new Error(body.error || "Unable to submit your enquiry right now.");
      }

      setSubmitState("success");
      setEnquiryId(body.enquiryId || "");
      setFormState({
        fullName: "",
        email: "",
        phone: "",
        childYearGroup: "year5",
        admissionYear: currentYear + 1,
        enquiryType: "book_visit",
        message: "",
        website: "",
      });
      setShowAdvancedFields(false);
      setIsFormOpen(false);
      trackCta("admissions_form_submit_success", {
        section: "admissions_funnel",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit your enquiry.";
      setSubmitState("error");
      setSubmitError(message);
      trackCta("admissions_form_submit_error", {
        section: "admissions_funnel",
        reason: message.slice(0, 80),
      });
    }
  };

  return (
    <section id="admissions-pathway" className="scroll-mt-24 bg-morpeth-light/20" data-kpi-section="admissions-funnel">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
            Admissions pathway
          </p>
          <h2 className="mt-2 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.65rem] md:tracking-[0.18em]">
            Three steps to start your application
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-700">
            Designed to make admissions simple: visit, ask questions, then apply through the local authority.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr,0.75fr] lg:items-start">
          <Reveal>
            <article className="rounded-3xl bg-white p-5 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-morpeth-mid">Step 1</p>
              <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.12em] text-morpeth-navy">
                Send an enquiry
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                Submit this form and our admissions team can pick up your enquiry in the CMS inbox.
              </p>

              {submitState === "success" ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Thanks, your enquiry has been received.
                  {enquiryId ? ` Reference: ${enquiryId}.` : ""}
                  <button
                    type="button"
                    className="ml-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-900 underline underline-offset-4"
                    onClick={() => setSubmitState("idle")}
                  >
                    Dismiss
                  </button>
                </div>
              ) : null}

              {!isFormOpen ? (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex rounded-full bg-morpeth-navy px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={() => {
                      setSubmitState("idle");
                      setSubmitError("");
                      setIsFormOpen(true);
                      trackCta("homepage_cta_click", { section: "admissions_funnel", cta: "open_enquiry_form" });
                    }}
                  >
                    Start enquiry form
                  </button>
                  <p className="text-xs text-slate-600">Takes about 30 seconds.</p>
                </div>
              ) : (
                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    value={formState.website}
                    onChange={(event) => updateField("website", event.target.value)}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        Full name
                      </span>
                      <input
                        required
                        autoComplete="name"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                        value={formState.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        Email
                      </span>
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                        value={formState.email}
                        onChange={(event) => updateField("email", event.target.value)}
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      Message
                    </span>
                    <textarea
                      required
                      minLength={15}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                      placeholder="Tell us what you would like help with."
                      value={formState.message}
                      onChange={(event) => updateField("message", event.target.value)}
                    />
                  </label>

                  <button
                    type="button"
                    className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600 underline underline-offset-4"
                    onClick={() => setShowAdvancedFields((prev) => !prev)}
                  >
                    {showAdvancedFields ? "Hide optional details" : "Add optional details"}
                  </button>

                  {showAdvancedFields ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <label className="block">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                          Phone
                        </span>
                        <input
                          autoComplete="tel"
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                          value={formState.phone}
                          onChange={(event) => updateField("phone", event.target.value)}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                          Child year
                        </span>
                        <select
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                          value={formState.childYearGroup}
                          onChange={(event) => updateField("childYearGroup", event.target.value)}
                        >
                          <option value="year5">Year 5</option>
                          <option value="year6">Year 6</option>
                          <option value="other">Other</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                          Admission year
                        </span>
                        <input
                          type="number"
                          min={currentYear}
                          max={currentYear + 3}
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                          value={formState.admissionYear}
                          onChange={(event) => updateField("admissionYear", Number(event.target.value))}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                          Type
                        </span>
                        <select
                          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
                          value={formState.enquiryType}
                          onChange={(event) => updateField("enquiryType", event.target.value)}
                        >
                          <option value="book_visit">Book a visit</option>
                          <option value="general">General question</option>
                          <option value="callback">Request callback</option>
                        </select>
                      </label>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex rounded-full bg-morpeth-navy px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Submitting..." : "Submit enquiry"}
                    </button>
                    <button
                      type="button"
                      className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600 underline underline-offset-4"
                      onClick={() => {
                        setIsFormOpen(false);
                        setShowAdvancedFields(false);
                        setSubmitError("");
                      }}
                    >
                      Close form
                    </button>
                    <Link
                      href="/contact#details"
                      className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600 underline underline-offset-4"
                    >
                      Prefer phone or email?
                    </Link>
                  </div>

                  {submitState === "error" ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {submitError}
                    </p>
                  ) : null}
                </form>
              )}
            </article>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80}>
              <article className="rounded-3xl bg-white p-5 shadow-card">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-morpeth-mid">Step 2</p>
                <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.12em] text-morpeth-navy">
                  Get guidance
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Download our prospectus and get clarity on curriculum, support and school life.
                </p>
                <a
                  href="/Documents/prospectus.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full border border-morpeth-navy/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
                  onClick={() => trackCta("homepage_cta_click", { section: "admissions_funnel", cta: "prospectus" })}
                >
                  Open prospectus
                </a>
              </article>
            </Reveal>

            <Reveal delay={160} direction="right">
              <article className="rounded-3xl bg-morpeth-navy p-5 text-morpeth-light shadow-card">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-morpeth-light/70">Step 3</p>
                <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.12em] text-morpeth-light">
                  Submit application
                </h3>
                <p className="mt-2 text-sm text-morpeth-light/90">
                  Complete your local authority application for secondary school admissions.
                </p>
                <a
                  href="https://www.towerhamlets.gov.uk/lgnl/education_and_learning/schools/school_admissions/secondary_school_admissions.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full border border-morpeth-light/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-morpeth-light transition hover:-translate-y-0.5 hover:bg-white/10"
                  onClick={() => trackCta("homepage_cta_click", { section: "admissions_funnel", cta: "tower_hamlets_admissions" })}
                >
                  Apply via Tower Hamlets
                </a>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== RESULTS & DESTINATIONS ===== */

type HomePageClientProps = {
  initialData?: HomePageInitialData;
};

export default function HomePageClient({ initialData }: HomePageClientProps) {
  const [audience, setAudience] = useState<AudienceKey>(DEFAULT_AUDIENCE);
  const [heroVariant, setHeroVariant] = useState<HeroVariant>(DEFAULT_HERO_VARIANT);
  const [hasHydratedPreferences, setHasHydratedPreferences] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedAudience = window.localStorage.getItem("morpeth_home_audience");
    const nextAudience: AudienceKey =
      storedAudience === "prospective" ||
      storedAudience === "parent" ||
      storedAudience === "student" ||
      storedAudience === "staff"
        ? storedAudience
        : DEFAULT_AUDIENCE;

    const nextHeroVariant = getOrAssignExperimentVariant<HeroVariant>(
      "hero_message_v1",
      [
        { key: "community", weight: 1 },
        { key: "achievement", weight: 1 },
      ],
      { storagePrefix: "morpeth_home_" }
    );

    const frameId = window.requestAnimationFrame(() => {
      setAudience(nextAudience);
      setHeroVariant(nextHeroVariant);
      setHasHydratedPreferences(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedPreferences) return;
    window.localStorage.setItem("morpeth_home_hero_variant_v1", heroVariant);
    trackExperimentAssignment("hero_message_v1", heroVariant, {
      location: "homepage",
    });
    trackCta("homepage_ab_variant_assigned", {
      experiment: "hero_message_v1",
      variant: heroVariant,
    });
  }, [hasHydratedPreferences, heroVariant]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedPreferences) return;
    window.localStorage.setItem("morpeth_home_audience", audience);
  }, [audience, hasHydratedPreferences]);

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      <Hero variant={heroVariant} />
      <AudienceJourneys audience={audience} onAudienceChange={setAudience} />
      <SchoolPulseSection initialData={initialData?.schoolPulse} />
      <SpotlightWallSection initialPosts={initialData?.spotlights} />
      <ImmersiveTimelineSection initialEvents={initialData?.timeline} />
      <AdmissionsFunnel audience={audience} heroVariant={heroVariant} />
      <ResultsSectionBlock initialData={initialData?.results} />
      <LifeAtMorpethSection />
      <SixthFormHighlightSection initialMedia={initialData?.sixthFormHighlight} />
      <ParentsStripSection />
      <SchoolAssistantSection />
    </main>
  );
}
