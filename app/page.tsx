"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "../sanity/client";
import HeroVideo from "./components/HeroVideo";
import SchoolAssistantSection from "./components/SchoolAssistantSection";
import { safeTrack, trackExperimentAssignment } from "../lib/analytics";
import { getOrAssignExperimentVariant } from "../lib/experiments";

const btnBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow-lg md:px-6 md:py-3 md:text-xs md:tracking-[0.18em] md:hover:scale-[1.01] active:translate-y-0";

// Reusable pill "chip" with shared hover/transition
type ChipProps = {
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const chipBase =
  "rounded-full bg-morpeth-light/60 px-4 py-2 text-morpeth-navy transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md hover:bg-morpeth-light/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-morpeth-mid";

function Chip({ href, className = "", children, ...rest }: ChipProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={`${chipBase} ${className}`}
        aria-label={typeof children === "string" ? children : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={`${chipBase} ${className}`} {...rest}>
      {children}
    </button>
  );
}
// app/page.tsx

type ResultBarProps = {
  label: string;
  value: number; // percentage
  onDark?: boolean;
};

type AudienceKey = "prospective" | "parent" | "student" | "staff";
type HeroVariant = "community" | "achievement";

type CalendarEvent = {
  title: string;
  start: string;
  end?: string;
  location?: string;
  url?: string;
};

const NEWS_QUERY = `
*[_type in ["post", "newsPost"] && defined(slug.current) && !(_id in path("drafts.**"))]
| order(coalesce(publishedAt, _createdAt) desc)[0...3]{
  title,
  "href": "/news/" + slug.current,
  "date": coalesce(publishedAt, _createdAt),
  excerpt,
  "imageUrl": coalesce(mainImage.asset->url, coverImage.asset->url, image.asset->url),
  "imageAlt": coalesce(mainImage.alt, coverImage.alt, title)
}
`;

const SPOTLIGHT_QUERY = `
*[_type in ["post", "newsPost"] && defined(slug.current) && !(_id in path("drafts.**"))]
| order(coalesce(publishedAt, _createdAt) desc)[0...8]{
  title,
  "href": "/news/" + slug.current,
  "date": coalesce(publishedAt, _createdAt),
  excerpt,
  "imageUrl": coalesce(
    mainImage.asset->url,
    heroImage.asset->url,
    coverImage.asset->url,
    featuredImage.asset->url,
    leadImage.asset->url,
    image.asset->url,
    images[0].asset->url,
    gallery[0].asset->url
  ),
  "imageAlt": coalesce(mainImage.alt, coverImage.alt, title)
}
`;

const STUDENT_SPOTLIGHT_QUERY = `
*[_type == "studentSpotlight" && coalesce(featured, true) == true && coalesce(publishedAt, _createdAt) <= now() && !(_id in path("drafts.**"))]
| order(coalesce(publishedAt, _createdAt) desc)[0...8]{
  title,
  studentName,
  yearGroup,
  highlight,
  "href": select(
    defined(linkedPost->slug.current) => "/news/" + linkedPost->slug.current,
    defined(ctaHref) => ctaHref,
    "/news"
  ),
  "date": coalesce(publishedAt, _createdAt),
  "imageUrl": coalesce(photo.asset->url, backgroundImage.asset->url),
  "imageAlt": coalesce(photo.alt, backgroundImage.alt, title),
  achievementTag
}
`;

const TIMELINE_EVENTS_QUERY = `
*[_type == "event" && defined(slug.current) && dateTime(start) >= dateTime(now()) && !(_id in path("drafts.**"))]
| order(start asc)[0...6]{
  title,
  start,
  location,
  audience,
  "href": "/events/" + slug.current
}
`;

const RESULTS_QUERY = `
{
  "gcse": *[_type == "gcseResults"][0]{
    "headline": headlineMetrics[]{
      label,
      value
    }
  },
  "sixth": *[_type == "sixthFormResults"][0]{
    "headline": aLevelHeadlineMetrics[]{
      label,
      value
    }
  }
}
`;

const PULSE_NOTICE_QUERY = `
*[_type == "letter"]
| order(coalesce(publishedAt, _createdAt) desc)[0]{
  title,
  "date": coalesce(publishedAt, _createdAt)
}
`;

const PULSE_LUNCH_QUERY = `
*[_type == "schoolMenu"]
| order(month desc, _createdAt desc)[0]{
  title,
  month
}
`;

const PULSE_ATTENDANCE_QUERY = `
*[_type == "parentsPage"][0]{
  "title": coalesce(attendanceCard.title, attendanceModal.reportingTitle),
  "description": coalesce(attendanceCard.description, attendanceModal.reportingParagraphs[0]),
  "phoneHref": coalesce(attendanceCard.phoneHref, attendanceModal.reportingPhoneHref),
  "phoneDisplay": coalesce(attendanceCard.phoneDisplay, attendanceModal.reportingPhoneDisplay),
  "emailAddress": coalesce(attendanceCard.emailAddress, attendanceModal.reportingEmailAddress)
}
`;

type NewsCard = {
  title: string;
  href: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type SpotlightCard = NewsCard & {
  studentName?: string;
  yearGroup?: string;
  highlight?: string;
  achievementTag?: string;
};

type NoticePulse = {
  title?: string;
  date?: string;
};

type LunchPulse = {
  title?: string;
  month?: string;
};

type AttendancePulse = {
  title?: string;
  description?: string;
  phoneHref?: string;
  phoneDisplay?: string;
  emailAddress?: string;
};

type RecruitmentMedia = {
  videoSrc: string | null;
  loopSrc: string | null;
  posterSrc: string | null;
};

type TimelineEvent = {
  title: string;
  start: string;
  location?: string;
  audience?: string;
  href: string;
};

const DEFAULT_RECRUITMENT_MEDIA: RecruitmentMedia = {
  videoSrc: null,
  loopSrc: null,
  posterSrc: null,
};

const audienceOptions: { key: AudienceKey; label: string }[] = [
  { key: "prospective", label: "Prospective family" },
  { key: "parent", label: "Current parent" },
  { key: "student", label: "Student" },
  { key: "staff", label: "Staff / applicant" },
];

function trackCta(name: string, properties?: Record<string, string>) {
  safeTrack(name, properties);
}

function ResultBar({ label, value, onDark = false }: ResultBarProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle visibility based on whether the bar is in view.
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.35,              // consider it "in view" when ~1/3 is visible
        rootMargin: "0px 0px -10% 0px" // avoids rapid toggling near the bottom
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const labelClass = onDark
    ? "text-[11px] md:text-[13px] text-morpeth-light/90"
    : "text-[11px] md:text-[13px] text-slate-700";

  const valueClass = onDark
    ? "font-semibold text-morpeth-light"
    : "font-semibold text-morpeth-navy";

  const trackClass = onDark
    ? "h-2 rounded-full bg-morpeth-light/25"
    : "h-2 rounded-full bg-slate-200";

  const fillClass =
    (onDark
      ? "h-2 rounded-full bg-morpeth-light"
      : "h-2 rounded-full bg-morpeth-mid") +
    " transition-[width] duration-700 ease-in-out";

  return (
    <div className="space-y-1" ref={ref}>
      <div className="flex items-baseline justify-between">
        <span className={labelClass}>{label}</span>
        <span className={valueClass}>{value}%</span>
      </div>
      <div className={trackClass}>
        <div
          className={fillClass}
          style={{ width: visible ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}

/* ===== HERO WITH DRONE VIDEO ===== */

function Hero({ variant }: { variant: HeroVariant }) {
  return (
    <section className="relative overflow-hidden bg-morpeth-navy text-morpeth-light" data-kpi-section="hero">
      <HeroVideo
        src="/video/morpeth-drone-hero.mp4"
        pageKey="home"
        posterSrc="/images/welcome.webp"
        posterAlt="Morpeth School campus"
        priorityPoster
        preload="metadata"
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
        <p className="mt-3 max-w-xl text-xs md:text-sm text-morpeth-light/85">
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

function SchoolPulse() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [posts, setPosts] = useState<NewsCard[]>([]);
  const [notice, setNotice] = useState<NoticePulse | null>(null);
  const [lunchMenu, setLunchMenu] = useState<LunchPulse | null>(null);
  const [attendance, setAttendance] = useState<AttendancePulse | null>(null);
  const [recruitmentMedia, setRecruitmentMedia] = useState<RecruitmentMedia>(DEFAULT_RECRUITMENT_MEDIA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPulse = async () => {
      try {
        const [eventsResponse, newsResponse, noticeResponse, lunchResponse, attendanceResponse, recruitmentResponse] = await Promise.all([
          fetch("/api/events?limit=4"),
          sanityFetch<NewsCard[]>(NEWS_QUERY),
          sanityFetch<NoticePulse | null>(PULSE_NOTICE_QUERY),
          sanityFetch<LunchPulse | null>(PULSE_LUNCH_QUERY),
          sanityFetch<AttendancePulse | null>(PULSE_ATTENDANCE_QUERY),
          fetch("/api/recruitment-video", { cache: "force-cache" }),
        ]);

        if (!mounted) return;

        if (eventsResponse.ok) {
          const parsedEvents = (await eventsResponse.json()) as CalendarEvent[];
          setEvents(Array.isArray(parsedEvents) ? parsedEvents : []);
        } else {
          setEvents([]);
        }

        setPosts(Array.isArray(newsResponse) ? newsResponse : []);
        setNotice(noticeResponse || null);
        setLunchMenu(lunchResponse || null);
        setAttendance(attendanceResponse || null);

        if (recruitmentResponse.ok) {
          const recruitmentBody = (await recruitmentResponse.json()) as RecruitmentMedia;
          setRecruitmentMedia({
            videoSrc: recruitmentBody?.videoSrc ?? null,
            loopSrc: recruitmentBody?.loopSrc ?? null,
            posterSrc: recruitmentBody?.posterSrc ?? null,
          });
        } else {
          setRecruitmentMedia(DEFAULT_RECRUITMENT_MEDIA);
        }
      } catch {
        if (!mounted) return;
        setEvents([]);
        setPosts([]);
        setNotice(null);
        setLunchMenu(null);
        setAttendance(null);
        setRecruitmentMedia(DEFAULT_RECRUITMENT_MEDIA);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPulse();
    return () => {
      mounted = false;
    };
  }, []);

  const currentDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  const firstEvent = events[0];
  const latestStory = posts[0];
  const recruitmentPreviewSrc = recruitmentMedia.loopSrc || recruitmentMedia.videoSrc;
  const latestStoryDate = latestStory?.date
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(latestStory.date))
    : null;

  const formatEventDate = (iso: string) => {
    const date = new Date(iso);
    const isMidnightEvent = date.getHours() === 0 && date.getMinutes() === 0;
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      ...(isMidnightEvent ? {} : { hour: "2-digit", minute: "2-digit" }),
    }).format(date);
  };

  const formatMonth = (isoLike?: string) => {
    if (!isoLike) return "Latest menu";
    const parsed = new Date(isoLike);
    if (Number.isNaN(parsed.getTime())) return "Latest menu";
    return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(parsed);
  };

  const tickerItems = [
    firstEvent ? `${formatEventDate(firstEvent.start)} · ${firstEvent.title}` : null,
    notice?.title ? `Notice · ${notice.title}` : null,
    lunchMenu?.title ? `Lunch · ${lunchMenu.title}` : null,
    latestStory?.title ? `Achievement · ${latestStory.title}` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <section className="bg-white" data-kpi-section="school-pulse">
      <div className="mx-auto max-w-6xl border-y border-slate-200/80 px-4 py-8 md:py-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                School pulse
              </p>
              <h2 className="mt-1 text-lg font-heading uppercase tracking-[0.15em] text-morpeth-navy md:text-[1.45rem]">
                Today at Morpeth
              </h2>
              <p className="mt-1 text-sm text-slate-600">{currentDate}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/calendar"
                className="rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
                onClick={() => trackCta("homepage_cta_click", { section: "school_pulse", cta: "full_calendar" })}
              >
                Calendar
              </Link>
              <Link
                href="/letters-home"
                className="rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
                onClick={() => trackCta("homepage_cta_click", { section: "school_pulse", cta: "letters_home" })}
              >
                Notices
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={40}>
          <div className="mt-4 overflow-hidden rounded-full border border-slate-200 bg-morpeth-offwhite/70">
            <div
              className="flex min-w-max items-center gap-8 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-slate-600"
              style={{
                animation:
                  tickerItems.length > 1 ? "morpethPulseTicker 30s linear infinite" : "none",
              }}
            >
              {(tickerItems.length > 0 ? [...tickerItems, ...tickerItems] : ["Live updates from Morpeth"]).map(
                (item, idx) => (
                  <span key={`${item}-${idx}`} className="whitespace-nowrap">
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-2 w-20 rounded bg-slate-300/70" />
                  <div className="h-4 w-4/5 rounded bg-slate-300/70" />
                  <div className="h-3 w-1/2 rounded bg-slate-300/60" />
                </div>
              </div>
            ))
          ) : (
            <>
              <Reveal delay={20}>
                <article className="rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Next event</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy">
                    {firstEvent ? firstEvent.title : "No upcoming events"}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {firstEvent ? formatEventDate(firstEvent.start) : "Check full calendar"}
                  </p>
                </article>
              </Reveal>

              <Reveal delay={40}>
                <article className="rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Notices</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                    {notice?.title || "Latest letters and updates"}
                  </p>
                  <Link
                    href="/letters-home"
                    className="mt-1 inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                    onClick={() => trackCta("homepage_cta_click", { section: "school_pulse", cta: "open_notices" })}
                  >
                    Open letters
                  </Link>
                </article>
              </Reveal>

              <Reveal delay={60}>
                <article className="rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Lunch</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                    {lunchMenu?.title || "Latest school menu"}
                  </p>
                  <Link
                    href="/school-lunches"
                    className="mt-1 inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                    onClick={() => trackCta("homepage_cta_click", { section: "school_pulse", cta: "open_lunches" })}
                  >
                    {formatMonth(lunchMenu?.month)}
                  </Link>
                </article>
              </Reveal>

              <Reveal delay={80}>
                <article className="rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4 lg:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Achievement</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                    {latestStory?.title || "Latest student stories"}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {latestStoryDate ? (
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{latestStoryDate}</p>
                    ) : null}
                    <Link
                      href={latestStory?.href || "/news"}
                      className="inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                      onClick={() =>
                        trackCta("homepage_cta_click", { section: "school_pulse", cta: "open_achievement_story" })
                      }
                    >
                      View story
                    </Link>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={100}>
                <article className="rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Attendance</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                    {attendance?.title || "Report absence before 8:30am"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                    {attendance?.description || "Call or email the school office before registration."}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {attendance?.phoneHref && attendance?.phoneDisplay ? (
                      <a
                        href={attendance.phoneHref}
                        className="inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                        onClick={() =>
                          trackCta("homepage_cta_click", { section: "school_pulse", cta: "attendance_call" })
                        }
                      >
                        {attendance.phoneDisplay}
                      </a>
                    ) : null}
                    <Link
                      href="/parents"
                      className="inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                      onClick={() =>
                        trackCta("homepage_cta_click", { section: "school_pulse", cta: "attendance_guidance" })
                      }
                    >
                      Guidance
                    </Link>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={120}>
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-morpeth-offwhite p-0 lg:col-span-2">
                  <div className="relative h-28 w-full bg-slate-200">
                    {recruitmentPreviewSrc ? (
                      <video
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={recruitmentMedia.posterSrc || undefined}
                      >
                        <source src={recruitmentPreviewSrc} type="video/mp4" />
                      </video>
                    ) : recruitmentMedia.posterSrc ? (
                      <Image
                        src={recruitmentMedia.posterSrc}
                        alt="Year 5 film preview"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 22vw, 100vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-r from-morpeth-navy to-[#1d4f89]" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <p className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      Film spotlight
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy">
                      Year 5 recruitment film
                    </p>
                    <Link
                      href="/our-school#welcome"
                      className="mt-1 inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                      onClick={() =>
                        trackCta("homepage_cta_click", { section: "school_pulse", cta: "open_recruitment_film" })
                      }
                    >
                      Watch full preview
                    </Link>
                  </div>
                </article>
              </Reveal>
            </>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes morpethPulseTicker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

function SpotlightWall() {
  const [posts, setPosts] = useState<SpotlightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStories = async () => {
      try {
        const [spotlightsData, fallbackNewsData] = await Promise.all([
          sanityFetch<SpotlightCard[]>(STUDENT_SPOTLIGHT_QUERY),
          sanityFetch<SpotlightCard[]>(SPOTLIGHT_QUERY),
        ]);
        if (!mounted) return;
        const hasSpotlights = Array.isArray(spotlightsData) && spotlightsData.length > 0;
        const sourceData = hasSpotlights ? spotlightsData : Array.isArray(fallbackNewsData) ? fallbackNewsData : [];
        setPosts(sourceData);
      } catch {
        if (!mounted) return;
        setPosts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStories();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || posts.length <= 3) return;

    const canAutoScroll =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!canAutoScroll) return;

    let raf = 0;
    const step = () => {
      if (!paused) {
        track.scrollLeft += 0.35;
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
          track.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, posts.length]);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="bg-white" data-kpi-section="achievement-wall">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <Reveal>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                Student spotlights
              </p>
              <h2 className="mt-1 text-lg font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.45rem]">
                Live achievement wall
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Student wins, standout work and key moments updated from the CMS.
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy underline underline-offset-4"
              onClick={() => trackCta("homepage_cta_click", { section: "spotlight_wall", cta: "open_news" })}
            >
              View all stories
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-44 rounded-2xl bg-morpeth-offwhite animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar touch-pan-x"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {posts.map((post, idx) => {
              const isExternal = /^https?:\/\//.test(post.href);
              const cardBody = (
                <>
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(min-width: 1024px) 280px, 85vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-r from-morpeth-navy to-[#234f86]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    {post.achievementTag ? (
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/75">
                        {post.achievementTag}
                      </p>
                    ) : null}
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/80">
                      {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(post.date))}
                    </p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-white line-clamp-2">
                      {post.title}
                    </p>
                    {post.studentName || post.yearGroup ? (
                      <p className="mt-1 text-[11px] text-white/85 line-clamp-1">
                        {[post.studentName, post.yearGroup].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </>
              );

              if (isExternal) {
                return (
                  <a
                    key={`${post.href}-${idx}`}
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block h-44 w-[min(85vw,320px)] shrink-0 snap-center overflow-hidden rounded-2xl border border-slate-200 bg-morpeth-offwhite"
                    onClick={() => trackCta("homepage_cta_click", { section: "spotlight_wall", cta: "open_story" })}
                  >
                    {cardBody}
                  </a>
                );
              }

              return (
                <Link
                  key={`${post.href}-${idx}`}
                  href={post.href}
                  className="group relative block h-44 w-[min(85vw,320px)] shrink-0 snap-center overflow-hidden rounded-2xl border border-slate-200 bg-morpeth-offwhite"
                  onClick={() => trackCta("homepage_cta_click", { section: "spotlight_wall", cta: "open_story" })}
                >
                  {cardBody}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ImmersiveTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadTimeline = async () => {
      try {
        const data = await sanityFetch<TimelineEvent[]>(TIMELINE_EVENTS_QUERY);
        if (!mounted) return;
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTimeline();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || events.length < 4) return;

    const canAutoScroll =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canAutoScroll) return;

    let raf = 0;
    const tick = () => {
      if (!paused) {
        rail.scrollLeft += 0.28;
        if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1) {
          rail.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [events.length, paused]);

  const fallbackMilestones: TimelineEvent[] = [
    {
      title: "Open evening tours",
      start: new Date(new Date().getFullYear(), 8, 18).toISOString(),
      audience: "Prospective families",
      location: "Morpeth School",
      href: "/our-school#welcome",
    },
    {
      title: "Year 5 film and admissions guidance",
      start: new Date(new Date().getFullYear(), 9, 6).toISOString(),
      audience: "Prospective families",
      location: "Online preview",
      href: "/our-school#welcome",
    },
    {
      title: "Application support clinics",
      start: new Date(new Date().getFullYear(), 9, 21).toISOString(),
      audience: "Parents",
      location: "School hall",
      href: "/contact#message",
    },
    {
      title: "Local authority application deadline",
      start: new Date(new Date().getFullYear(), 9, 31).toISOString(),
      audience: "Year 6 families",
      location: "Tower Hamlets",
      href: "https://www.towerhamlets.gov.uk/lgnl/education_and_learning/schools/school_admissions/secondary_school_admissions.aspx",
    },
  ];

  const timeline = events.length > 0 ? events : fallbackMilestones;

  return (
    <section className="relative overflow-hidden bg-morpeth-navy text-morpeth-light" data-kpi-section="admissions-timeline">
      <div
        className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-morpeth-mid/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-28 top-10 h-80 w-80 rounded-full bg-morpeth-light/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <Reveal>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-light/70">
                Journey timeline
              </p>
              <h2 className="mt-2 text-lg font-heading uppercase tracking-[0.14em] text-morpeth-light md:text-[1.45rem]">
                Admissions & key milestones
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-morpeth-light/85">
                A living timeline of important dates, visits and deadlines so families know exactly what comes next.
              </p>
            </div>
            <Link
              href="/calendar"
              className="inline-flex rounded-full border border-morpeth-light/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light transition hover:-translate-y-0.5 hover:bg-white/10"
              onClick={() => trackCta("homepage_cta_click", { section: "milestone_timeline", cta: "open_calendar" })}
            >
              Open full calendar
            </Link>
          </div>
        </Reveal>

        <div className="mt-5">
          <div className="relative h-1 rounded-full bg-white/20">
            <div className="absolute left-0 top-0 h-1 w-1/2 rounded-full bg-morpeth-light/80" />
          </div>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-32 rounded-2xl bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={railRef}
            className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar touch-pan-x"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {timeline.map((event, idx) => {
              const formatted = new Intl.DateTimeFormat("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              }).format(new Date(event.start));
              const isExternal = /^https?:\/\//.test(event.href);

              return (
                <Reveal key={`${event.title}-${idx}`} delay={idx * 60}>
                  <article className="group relative w-[min(90vw,320px)] shrink-0 snap-center rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-morpeth-light/75">
                      {formatted}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-morpeth-light line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-xs text-morpeth-light/80 line-clamp-1">
                      {[event.audience, event.location].filter(Boolean).join(" · ")}
                    </p>
                    {isExternal ? (
                      <a
                        href={event.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-morpeth-light underline underline-offset-4"
                        onClick={() =>
                          trackCta("homepage_cta_click", { section: "milestone_timeline", cta: "open_milestone" })
                        }
                      >
                        View details
                      </a>
                    ) : (
                      <Link
                        href={event.href}
                        className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-morpeth-light underline underline-offset-4"
                        onClick={() =>
                          trackCta("homepage_cta_click", { section: "milestone_timeline", cta: "open_milestone" })
                        }
                      >
                        View details
                      </Link>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function AudienceJourneys({
  audience,
  onAudienceChange,
}: {
  audience: AudienceKey;
  onAudienceChange: (next: AudienceKey) => void;
}) {
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
        href: "/news",
        cta: "Open news",
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

  return (
    <section className="bg-white" data-kpi-section="journey-selector">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">Start here</p>
          <h2 className="mt-2 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.65rem] md:tracking-[0.18em]">
            Pick your journey
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-700">
            Choose your role once and the highlighted cards adapt so you can jump to the right area in one click.
          </p>
        </Reveal>

        <div className="-mx-1 mt-5 overflow-x-auto px-1 pb-1 no-scrollbar touch-pan-x">
          <div className="flex w-max min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
            {audienceOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] transition ${
                  audience === option.key
                    ? "bg-morpeth-navy text-white shadow-md"
                    : "border border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-50"
                }`}
                onClick={() => {
                  onAudienceChange(option.key);
                  trackCta("homepage_audience_selected", { audience: option.key });
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {routes.map((route, idx) => (
            <Reveal key={route.title} delay={idx * 70}>
              <article
                className={`group rounded-3xl border bg-gradient-to-br from-white via-morpeth-offwhite to-morpeth-light/35 p-5 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg md:p-6 ${
                  idx === 0 ? "border-morpeth-mid/65 ring-2 ring-morpeth-mid/20" : "border-slate-200"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-morpeth-mid">
                  {route.tag}
                </p>
                <h3 className="mt-2 font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">
                  {route.title}
                </h3>
                <p className="mt-3 text-sm text-slate-700">{route.description}</p>
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
              </article>
            </Reveal>
          ))}
        </div>
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

function ResultsSection() {
  type Metric = {
    label: string;
    value: number;
  };

  const defaultGcseBars: Metric[] = [
    { label: "Grade 5+ in English & Maths", value: 65 },
    { label: "Grades 9–7 (all subjects)", value: 30 },
  ];

  const defaultSixthFormBars: Metric[] = [
    { label: "A level A*–B", value: 55 },
    { label: "Students to university / HE", value: 80 },
  ];

  const [gcseBars, setGcseBars] = useState<Metric[]>(defaultGcseBars);
  const [sixthFormBars, setSixthFormBars] = useState<Metric[]>(defaultSixthFormBars);

  useEffect(() => {
    let mounted = true;

    sanityFetch<{
      gcse?: { headline?: Metric[] | null };
      sixth?: { headline?: Metric[] | null };
    }>(RESULTS_QUERY)
      .then((res) => {
        if (!mounted || !res) return;

        const gcseHeadline = res.gcse?.headline || [];
        const sixthHeadline = res.sixth?.headline || [];

        if (gcseHeadline.length > 0) {
          setGcseBars(gcseHeadline.slice(0, 2));
        }

        if (sixthHeadline.length > 0) {
          setSixthFormBars(sixthHeadline.slice(0, 2));
        }
      })
      .catch((err) => {
        console.error("Failed to load results headline metrics from Sanity", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-white" data-kpi-section="results">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
              Results &amp; destinations
            </p>
            <h2 className="mt-3 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
              Ambition, support and outstanding outcomes
            </h2>
          </>
        </Reveal>

        <div className="mt-6 grid gap-10 md:grid-cols-[1.1fr,1fr] md:items-start">
          <Reveal delay={60}>
            <div className="space-y-4 text-sm md:text-[15px] text-slate-800">
              <p>
                Our students progress to leading sixth forms, apprenticeships and
                university pathways with confidence. High expectations, strong
                pastoral care and excellent teaching all contribute to that
                success.
              </p>
              <p>
                We publish headline outcomes and destination information so
                families can see the impact of a Morpeth education over time.
              </p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li>• GCSE outcomes that reflect strong progress across subjects.</li>
                <li>• Sixth Form progression to university, employment and apprenticeships.</li>
                <li>• Clear reporting through our results pages and school updates.</li>
              </ul>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/our-school/results"
                  className="inline-flex items-center justify-center rounded-full border border-morpeth-navy/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  GCSE results
                </Link>
                <Link
                  href="/sixth-form#destinations"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Sixth Form destinations
                </Link>
              </div>
            </div>
          </Reveal>

          {/* GCSE & Sixth Form panels with simple graphs */}
          <div className="space-y-6">
            <Reveal delay={40}>
              <div className="rounded-2xl bg-morpeth-offwhite p-5 shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:hover:scale-[1.01] will-change-transform">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  GCSE
                </p>
                <p className="mt-1 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                  Headline results
                </p>
                <div className="mt-4 space-y-3">
                  {gcseBars.map((bar) => (
                    <ResultBar
                      key={bar.label}
                      label={bar.label}
                      value={bar.value}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} direction="right">
              <div className="rounded-2xl bg-morpeth-navy p-5 text-morpeth-light shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:hover:scale-[1.01] will-change-transform">
                <p className="text-xs uppercase tracking-[0.18em] text-morpeth-light">
                  Sixth Form
                </p>
                <p className="mt-1 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-light">
                  Progress &amp; destinations
                </p>
                <div className="mt-4 space-y-3">
                  {sixthFormBars.map((bar) => (
                    <ResultBar
                      key={bar.label}
                      label={bar.label}
                      value={bar.value}
                      onDark
                    />
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-morpeth-light/85">
                  Destinations include university, higher apprenticeships and
                  specialist training routes.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

type RevealCardProps = {
  children: React.ReactNode;
  delay?: number;
};

function RevealCard({ children, delay = 0 }: RevealCardProps) {
  return <Reveal delay={delay}>{children}</Reveal>;
}

/* ===== LIFE AT MORPETH ===== */

function LifeAtMorpeth() {
  const pillars = [
    {
      title: "Excellent teaching & learning",
      body: "Specialist teachers, a well-sequenced curriculum and high expectations for every learner from Year 7 to Sixth Form.",
    },
    {
      title: "Care, inclusion & wellbeing",
      body: "A diverse, welcoming community where relationships matter, behaviour is calm and students feel known and supported.",
    },
    {
      title: "Beyond the classroom",
      body: "Drama, music, sport, art, trips and leadership opportunities that help young people find their voice and passions.",
    },
  ];

  return (
    <section className="bg-morpeth-light/25" data-kpi-section="life-at-morpeth">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
          Life at Morpeth
        </p>
        <h2 className="mt-3 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
          A vibrant, creative East London school
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, idx) => (
            <RevealCard key={pillar.title} delay={idx * 80}>
              <article
                className="flex flex-col justify-between rounded-2xl bg-white/90 p-5 shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:hover:scale-[1.01] will-change-transform"
                aria-label={pillar.title}
              >
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-slate-800">{pillar.body}</p>
              </article>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== SIXTH FORM STRIP ===== */

function SixthFormHighlight() {
  return (
    <section className="bg-gradient-to-r from-morpeth-navy via-morpeth-navy to-morpeth-mid" data-kpi-section="sixth-form-highlight">
      <div className="mx-auto max-w-6xl px-4 py-14 md:flex md:items-center md:gap-10">
        <Reveal>
          <div className="flex-1 text-morpeth-light">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-light/75">
              Morpeth Sixth Form
            </p>
            <h2 className="mt-3 text-xl font-heading uppercase tracking-[0.14em] md:text-[1.55rem] md:tracking-[0.18em]">
              Aspirational, welcoming and future-focused
            </h2>
            <p className="mt-4 text-sm md:text-[15px] text-morpeth-light/90">
              Our Sixth Form offers a broad range of A Levels and vocational
              courses, expert support with university, apprenticeships and
              careers, and a strong culture of independence and student
              leadership.
            </p>
            <p className="mt-3 text-sm text-morpeth-light/85">
              Students benefit from dedicated tutoring, personal statement and
              interview coaching, enrichment opportunities and clear progression
              planning from day one.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/sixth-form#apply"
                className={`${btnBase} bg-morpeth-light text-morpeth-navy`}
              >
                Join our Sixth Form
              </Link>
              <Link
                href="/sixth-form#courses"
                className={`${btnBase} border border-morpeth-light/70 text-morpeth-light bg-transparent`}
              >
                Subjects &amp; pathways
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} direction="right">
          <div className="mt-8 flex-1 md:mt-0">
            <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-morpeth-light/10 shadow-card md:h-72 lg:h-80">
              <Image
                src="/images/sixthform-hero.jpg"
                alt="Morpeth Sixth Form students"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-morpeth-navy/40 via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===== PARENTS STRIP ===== */

function ParentsStrip() {
  return (
    <section className="bg-white" data-kpi-section="parents-strip">
      <div className="mx-auto max-w-6xl border-t border-slate-200 px-4 pt-12 pb-16">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                For parents &amp; carers
              </p>
              <h2 className="mt-3 text-lg font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-xl md:tracking-[0.18em]">
                Information you need, in one place
              </h2>
              <p className="mt-3 text-sm text-slate-800">
                Everything families use most often is grouped into the parent hub:
                attendance guidance, letters, meal information and term planning.
              </p>
            </div>

            <div
              className="flex flex-wrap items-start gap-2 text-xs font-semibold uppercase tracking-[0.18em]"
              role="navigation"
              aria-label="Quick links for parents"
            >
              {[
                { label: "Term dates", href: "/term-dates" },
                { label: "Letters home", href: "/letters-home" },
                { label: "Edulink", href: "/edulink" },
                { label: "School lunches", href: "/school-lunches" },
              ].map((item) => (
                <Chip key={item.label} href={item.href}>
                  {item.label}
                </Chip>
              ))}

              <Link href="/jobs" className={chipBase} aria-label="Join our staff – vacancies">
                Join our staff
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Uniform & equipment teaser, moved underneath the Parents content */}
        <div className="mt-12 border-t border-slate-200/80 pt-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Intro text */}
            <Reveal>
              <div className="max-w-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                  Uniform &amp; equipment
                </p>
                <h2 className="mt-3 text-xl md:text-2xl font-heading uppercase tracking-[0.18em] text-morpeth-navy">
                  Ready to learn, every day
                </h2>
                <p className="mt-3 text-sm md:text-[15px] text-slate-800">
                  Our uniform helps students feel part of the Morpeth community and
                  arrive ready for learning. This section gives families a clear,
                  simple overview of what students need to wear and bring.
                </p>
                <p className="mt-3 text-xs text-slate-600">
                  Full policy detail, downloadable documents and support guidance
                  are available in the Parents area.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/parents"
                    className="inline-flex items-center justify-center rounded-full border border-morpeth-navy/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    Parent hub: uniform guide
                  </Link>
                  <Link
                    href="/parents"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    Parent hub: equipment checklist
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Two mirrored cards, like the Uniform & Equipment layout */}
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <RevealCard>
                <article className="h-full rounded-2xl bg-morpeth-offwhite p-5 shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:hover:scale-[1.01] will-change-transform">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-morpeth-navy">
                    Uniform
                  </h3>
                  <p className="mt-3 text-sm text-slate-800">
                    Smart, simple and affordable items that reflect our values:
                    school blazer, tie, white shirt, black trousers or skirt and
                    smart black shoes.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <li>• Morpeth blazer and tie (Year colour where applicable)</li>
                    <li>• Plain white shirt, tucked in</li>
                    <li>• Black trousers or knee-length skirt</li>
                    <li>• Plain black, low-heeled shoes (no trainers)</li>
                  </ul>
                  <p className="mt-3 text-[11px] text-slate-500">
                    Full details of permitted items, PE kit and jewellery will be
                    listed in the Parents hub.
                  </p>
                </article>
              </RevealCard>

              <RevealCard delay={80}>
                <article className="h-full rounded-2xl bg-morpeth-navy p-5 text-morpeth-light shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:hover:scale-[1.01] will-change-transform">
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-morpeth-light">
                    Equipment for learning
                  </h3>
                  <p className="mt-3 text-sm text-morpeth-light/90">
                    Being properly equipped helps lessons run smoothly and builds
                    good learning habits.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-morpeth-light/90">
                    <li>• School bag large enough for books and an A4 folder</li>
                    <li>• Planner, two pens, pencil, ruler and highlighter</li>
                    <li>• Maths set and scientific calculator (KS3 &amp; KS4)</li>
                    <li>• Refillable water bottle</li>
                  </ul>
                  <p className="mt-3 text-[11px] text-morpeth-light/80">
                    We&apos;ll signpost any support available for families who
                    need help with uniform or equipment costs.
                  </p>
                </article>
              </RevealCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ===== HOME PAGE ===== */

export default function Home() {
  const [audience, setAudience] = useState<AudienceKey>(() => {
    if (typeof window === "undefined") return "prospective";
    const storedAudience = window.localStorage.getItem("morpeth_home_audience");
    if (
      storedAudience === "prospective" ||
      storedAudience === "parent" ||
      storedAudience === "student" ||
      storedAudience === "staff"
    ) {
      return storedAudience;
    }
    return "prospective";
  });
  const [heroVariant] = useState<HeroVariant>(() => {
    return getOrAssignExperimentVariant<HeroVariant>(
      "hero_message_v1",
      [
        { key: "community", weight: 1 },
        { key: "achievement", weight: 1 },
      ],
      { storagePrefix: "morpeth_home_" }
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("morpeth_home_hero_variant_v1", heroVariant);
    trackExperimentAssignment("hero_message_v1", heroVariant, {
      location: "homepage",
    });
    trackCta("homepage_ab_variant_assigned", {
      experiment: "hero_message_v1",
      variant: heroVariant,
    });
  }, [heroVariant]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("morpeth_home_audience", audience);
  }, [audience]);

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      <Hero variant={heroVariant} />
      <AudienceJourneys audience={audience} onAudienceChange={setAudience} />
      <SchoolPulse />
      <SpotlightWall />
      <ImmersiveTimeline />
      <AdmissionsFunnel audience={audience} heroVariant={heroVariant} />
      <ResultsSection />
      <LifeAtMorpeth />
      <SixthFormHighlight />
      <ParentsStrip />
      <SchoolAssistantSection />
    </main>
  );
}
