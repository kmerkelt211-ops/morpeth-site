"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { safeTrack } from "../../../lib/analytics";
import type { HomePageInitialData } from "../../../lib/homePageData";
import {
  DEFAULT_HOME_SIXTH_FORM_MEDIA,
  DEFAULT_PULSE_MEDIA,
} from "../../../lib/siteMediaLoaders";

const btnBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow-lg md:px-6 md:py-3 md:text-xs md:tracking-[0.18em] md:hover:scale-[1.01] active:translate-y-0";

const chipBase =
  "rounded-full bg-morpeth-light/60 px-4 py-2 text-morpeth-navy transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md hover:bg-morpeth-light/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-morpeth-mid";

type ChipProps = {
  href?: string;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ResultBarProps = {
  label: string;
  value: number;
  onDark?: boolean;
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
};

type RevealCardProps = {
  children: ReactNode;
  delay?: number;
};

type SpotlightCard = HomePageInitialData["spotlights"][number];
type TimelineEvent = HomePageInitialData["timeline"][number];

const UK_TIME_ZONE = "Europe/London";
const SHORT_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const londonDayFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: UK_TIME_ZONE,
  day: "2-digit",
});
const londonMonthNumericFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: UK_TIME_ZONE,
  month: "numeric",
});
const londonYearFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: UK_TIME_ZONE,
  year: "numeric",
});
const londonWeekdayShortFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: UK_TIME_ZONE,
  weekday: "short",
});
const londonWeekdayLongFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: UK_TIME_ZONE,
  weekday: "long",
});
const londonHourFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: UK_TIME_ZONE,
  hour: "2-digit",
  hourCycle: "h23",
});
const londonMinuteFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: UK_TIME_ZONE,
  minute: "2-digit",
});

function parseDateInput(input: string | Date | undefined): Date | null {
  if (!input) return null;
  const parsed = input instanceof Date ? input : new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getLondonMonthIndex(date: Date): number {
  const monthNumber = Number(londonMonthNumericFormatter.format(date));
  if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) return 0;
  return monthNumber - 1;
}

function formatWeekdayShort(date: Date): string {
  return londonWeekdayShortFormatter.format(date).replace(/\./g, "").trim().slice(0, 3);
}

function formatWeekdayLong(date: Date): string {
  return londonWeekdayLongFormatter.format(date).trim();
}

function formatDayMonthShort(input: string | Date | undefined): string | null {
  const date = parseDateInput(input);
  if (!date) return null;
  const day = londonDayFormatter.format(date);
  return `${day} ${SHORT_MONTH_NAMES[getLondonMonthIndex(date)]}`;
}

function formatWeekdayDayMonthLong(input: string | Date | undefined): string | null {
  const date = parseDateInput(input);
  if (!date) return null;
  const day = londonDayFormatter.format(date);
  return `${formatWeekdayLong(date)} ${day} ${LONG_MONTH_NAMES[getLondonMonthIndex(date)]}`;
}

function formatEventDateLabel(input: string | Date | undefined): string {
  const date = parseDateInput(input);
  if (!date) return "";
  const day = londonDayFormatter.format(date);
  const month = SHORT_MONTH_NAMES[getLondonMonthIndex(date)];
  const hour = londonHourFormatter.format(date);
  const minute = londonMinuteFormatter.format(date);
  const base = `${formatWeekdayShort(date)} ${day} ${month}`;
  return hour === "00" && minute === "00" ? base : `${base} ${hour}:${minute}`;
}

function formatMonthYear(input: string | Date | undefined): string {
  const date = parseDateInput(input);
  if (!date) return "Latest menu";
  return `${LONG_MONTH_NAMES[getLondonMonthIndex(date)]} ${londonYearFormatter.format(date)}`;
}

function trackCta(name: string, properties?: Record<string, string>) {
  safeTrack(name, properties);
}

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

function ResultBar({ label, value, onDark = false }: ResultBarProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -10% 0px",
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
        <div className={fillClass} style={{ width: visible ? `${value}%` : "0%" }} />
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "", direction = "up" }: RevealProps) {
  return (
    <div
      className={className}
      data-reveal={direction}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function RevealCard({ children, delay = 0 }: RevealCardProps) {
  return <Reveal delay={delay}>{children}</Reveal>;
}

export function SchoolPulseSection({
  initialData,
}: {
  initialData?: HomePageInitialData["schoolPulse"];
}) {
  const events = initialData?.events ?? [];
  const posts = initialData?.posts ?? [];
  const notice = initialData?.notice ?? null;
  const lunchMenu = initialData?.lunchMenu ?? null;
  const attendance = initialData?.attendance ?? null;
  const pulseMedia = initialData?.pulseMedia ?? DEFAULT_PULSE_MEDIA;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [pulseVideoMuted, setPulseVideoMuted] = useState(true);
  const loading = false;
  const pulseVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (pulseMedia.loopSrc || pulseMedia.slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % pulseMedia.slides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [pulseMedia.loopSrc, pulseMedia.slides.length]);

  const currentDate = formatWeekdayDayMonthLong(new Date()) || "";

  const firstEvent = events[0];
  const latestStory = posts[0];
  const latestStoryIsExternal = latestStory ? /^https?:\/\//.test(latestStory.href) : false;
  const hasPulseVideo = Boolean(pulseMedia.loopSrc);
  const hasPulsePoster = Boolean(pulseMedia.posterSrc);
  const hasPulseSlides = pulseMedia.slides.length > 0;
  const safeSlideIndex = pulseMedia.slides.length > 0 ? activeSlideIndex % pulseMedia.slides.length : 0;
  const activeSlide = hasPulseSlides ? pulseMedia.slides[safeSlideIndex] : null;
  const hasPulseBackdropMedia = hasPulseVideo || hasPulsePoster || Boolean(activeSlide);
  const pulseVideoSrc = pulseMedia.loopSrc || undefined;
  const pulsePosterSrc = pulseMedia.posterSrc || undefined;
  const latestStoryDate = formatDayMonthShort(latestStory?.date);

  const openPulseVideoFullscreen = () => {
    const video = pulseVideoRef.current;
    if (!video) return;

    const videoWithWebkit = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    const containerWithWebkit = video.parentElement as
      | (HTMLElement & { webkitRequestFullscreen?: () => void })
      | null;

    if (typeof video.requestFullscreen === "function") {
      void video.requestFullscreen().catch(() => undefined);
      return;
    }

    if (containerWithWebkit && typeof containerWithWebkit.requestFullscreen === "function") {
      void containerWithWebkit.requestFullscreen().catch(() => undefined);
      return;
    }

    if (typeof videoWithWebkit.webkitEnterFullscreen === "function") {
      videoWithWebkit.webkitEnterFullscreen();
    }
  };

  const tickerItems = [
    firstEvent ? `${formatEventDateLabel(firstEvent.start)} · ${firstEvent.title}` : null,
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
              <Link
                href="/news"
                className="rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
                onClick={() => trackCta("homepage_cta_click", { section: "school_pulse", cta: "full_news" })}
              >
                News
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

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr,0.95fr] lg:items-stretch">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
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
                <Reveal delay={20} className="xl:col-span-1">
                  <article className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Next event</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy">
                      {firstEvent ? firstEvent.title : "No upcoming events"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {firstEvent ? formatEventDateLabel(firstEvent.start) : "Check full calendar"}
                    </p>
                  </article>
                </Reveal>

                <Reveal delay={40} className="xl:col-span-2">
                  <article className="h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-[#f6f9ff] to-[#eef4ff] p-4 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Achievement</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                      {latestStory?.title || "Latest student stories"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {latestStoryDate ? (
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{latestStoryDate}</p>
                      ) : null}
                      {latestStoryIsExternal ? (
                        <a
                          href={latestStory.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                          onClick={() =>
                            trackCta("homepage_cta_click", { section: "school_pulse", cta: "open_achievement_story" })
                          }
                        >
                          Open on Instagram
                        </a>
                      ) : (
                        <Link
                          href={latestStory?.href || "/news"}
                          className="inline-flex text-xs font-semibold text-slate-700 underline underline-offset-4"
                          onClick={() =>
                            trackCta("homepage_cta_click", { section: "school_pulse", cta: "open_achievement_story" })
                          }
                        >
                          Open on Instagram
                        </Link>
                      )}
                    </div>
                  </article>
                </Reveal>

                <Reveal delay={60} className="xl:col-span-1">
                  <article className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Notices</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                      {notice?.title || "Latest letters and updates"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {formatDayMonthShort(notice?.date) || "Letters home hub"}
                    </p>
                  </article>
                </Reveal>

                <Reveal delay={80} className="xl:col-span-1">
                  <article className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Lunch menu</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                      {lunchMenu?.title || "School meals"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{formatMonthYear(lunchMenu?.month)}</p>
                  </article>
                </Reveal>

                <Reveal delay={100} className="xl:col-span-1">
                  <article className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Attendance</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-morpeth-navy line-clamp-2">
                      {attendance?.title || "Attendance and reporting absence"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                      {attendance?.description || "Guidance for reporting an absence and staying on track."}
                    </p>
                  </article>
                </Reveal>
              </>
            )}
          </div>

          <Reveal delay={120}>
            <aside className="rounded-[1.75rem] bg-morpeth-navy p-4 text-morpeth-light shadow-card">
              <div className="relative overflow-hidden rounded-[1.35rem] bg-black/25">
                {loading ? (
                  <div className="aspect-[16/11] animate-pulse bg-morpeth-light/10" />
                ) : hasPulseVideo ? (
                  <div className="relative aspect-[16/11]">
                    <video
                      ref={pulseVideoRef}
                      autoPlay
                      muted={pulseVideoMuted}
                      loop
                      playsInline
                      preload="none"
                      poster={pulsePosterSrc}
                      className="h-full w-full object-cover"
                      onClick={() => {
                        setPulseVideoMuted((prev) => !prev);
                        trackCta("homepage_cta_click", { section: "school_pulse", cta: "pulse_video_toggle_audio" });
                      }}
                    >
                      <source src={pulseVideoSrc} type="video/mp4" />
                    </video>
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        className="rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur"
                        onClick={() => {
                          setPulseVideoMuted((prev) => !prev);
                          trackCta("homepage_cta_click", { section: "school_pulse", cta: "pulse_video_audio_button" });
                        }}
                      >
                        {pulseVideoMuted ? "Unmute" : "Mute"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur"
                        onClick={() => {
                          openPulseVideoFullscreen();
                          trackCta("homepage_cta_click", { section: "school_pulse", cta: "pulse_video_fullscreen" });
                        }}
                      >
                        Full screen
                      </button>
                    </div>
                  </div>
                ) : hasPulsePoster ? (
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={pulsePosterSrc!}
                      alt={pulseMedia.title}
                      fill
                      sizes="(min-width: 1024px) 32vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : activeSlide ? (
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={activeSlide.imageSrc}
                      alt={activeSlide.alt || pulseMedia.title}
                      fill
                      sizes="(min-width: 1024px) 32vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative min-h-[15rem] bg-[radial-gradient(circle_at_top_left,rgba(210,226,252,0.16),transparent_45%),linear-gradient(160deg,#0d1f61_0%,#163574_50%,#1d4f89_100%)] p-5 md:min-h-[18rem]">
                    <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-morpeth-light/15 blur-3xl" />
                    <div className="absolute left-6 top-6 h-px w-24 bg-gradient-to-r from-morpeth-light/60 to-transparent" />
                    <div className="relative max-w-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/90">Featured update</p>
                      <p className="mt-2 text-lg font-heading uppercase tracking-[0.1em] text-white">
                        {pulseMedia.title}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-200">
                        {pulseMedia.description}
                      </p>
                      {pulseMedia.ctaHref && pulseMedia.ctaLabel ? (
                        <Link
                          href={pulseMedia.ctaHref}
                          className="mt-4 inline-flex text-xs font-semibold text-white underline underline-offset-4"
                          onClick={() =>
                            trackCta("homepage_cta_click", { section: "school_pulse", cta: "pulse_media_cta" })
                          }
                        >
                          {pulseMedia.ctaLabel}
                        </Link>
                      ) : pulseMedia.ctaLabel ? (
                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/85">
                          {pulseMedia.ctaLabel}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                {hasPulseBackdropMedia ? (
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,20,0.15)_0%,rgba(5,10,20,0.9)_100%)]" />
                ) : null}

                {pulseMedia.slides.length > 1 && !hasPulseVideo && !hasPulsePoster ? (
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    {pulseMedia.slides.map((_, index) => (
                      <button
                        key={`slide-dot-${index}`}
                        type="button"
                        aria-label={`Show image ${index + 1}`}
                        onClick={() => {
                          setActiveSlideIndex(index);
                          trackCta("homepage_cta_click", { section: "school_pulse", cta: "pulse_media_slide" });
                        }}
                        className={[
                          "h-2.5 w-2.5 rounded-full border transition",
                          index === safeSlideIndex
                            ? "border-white bg-white"
                            : "border-white/70 bg-white/35 hover:bg-white/70",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                ) : null}

                {hasPulseBackdropMedia ? (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/90">Media</p>
                    <p className="mt-1 text-lg font-heading uppercase tracking-[0.1em] text-white">{pulseMedia.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-200">
                      {activeSlide?.caption || pulseMedia.description}
                    </p>
                    {pulseMedia.ctaHref && pulseMedia.ctaLabel ? (
                      <Link
                        href={pulseMedia.ctaHref}
                        className="pointer-events-auto mt-3 inline-flex text-xs font-semibold text-white underline underline-offset-4"
                        onClick={() =>
                          trackCta("homepage_cta_click", { section: "school_pulse", cta: "pulse_media_cta" })
                        }
                      >
                        {pulseMedia.ctaLabel}
                      </Link>
                    ) : pulseMedia.ctaLabel ? (
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/85">
                        {pulseMedia.ctaLabel}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </aside>
          </Reveal>
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

export function SpotlightWallSection({
  initialPosts,
}: {
  initialPosts?: SpotlightCard[];
}) {
  const posts = initialPosts ?? [];
  const loading = false;
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

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
              href="/student-spotlights"
              className="inline-flex text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy underline underline-offset-4"
              onClick={() => trackCta("homepage_cta_click", { section: "spotlight_wall", cta: "open_spotlights" })}
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
                      {formatDayMonthShort(post.date)}
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

export function ImmersiveTimelineSection({
  initialEvents,
}: {
  initialEvents?: TimelineEvent[];
}) {
  const events = initialEvents ?? [];
  const loading = false;
  const railRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

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

  const currentLondonYear = Number(londonYearFormatter.format(new Date()));
  const fallbackMilestones: TimelineEvent[] = [
    {
      title: "Open evening tours",
      start: `${currentLondonYear}-09-18T00:00:00.000Z`,
      audience: "Prospective families",
      location: "Morpeth School",
      href: "/our-school#welcome",
    },
    {
      title: "Year 5 film and admissions guidance",
      start: `${currentLondonYear}-10-06T00:00:00.000Z`,
      audience: "Prospective families",
      location: "Online preview",
      href: "/our-school#welcome",
    },
    {
      title: "Application support clinics",
      start: `${currentLondonYear}-10-21T00:00:00.000Z`,
      audience: "Parents",
      location: "School hall",
      href: "/contact#message",
    },
    {
      title: "Local authority application deadline",
      start: `${currentLondonYear}-10-31T00:00:00.000Z`,
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
              const formatted = formatEventDateLabel(event.start);
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

export function ResultsSection({
  initialData,
}: {
  initialData?: HomePageInitialData["results"];
}) {
  type Metric = {
    label: string;
    value: number;
  };

  const defaultGcseBars: Metric[] = [
    { label: "Grade 5+ in English & Maths", value: 65 },
    { label: "Grades 9-7 (all subjects)", value: 30 },
  ];

  const defaultSixthFormBars: Metric[] = [
    { label: "A level A*-B", value: 55 },
    { label: "Students to university / HE", value: 80 },
  ];

  const gcseBars = initialData?.gcseBars ?? defaultGcseBars;
  const sixthFormBars = initialData?.sixthFormBars ?? defaultSixthFormBars;

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

export function LifeAtMorpethSection() {
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

export function SixthFormHighlightSection({
  initialMedia,
}: {
  initialMedia?: HomePageInitialData["sixthFormHighlight"];
}) {
  const media = initialMedia ?? DEFAULT_HOME_SIXTH_FORM_MEDIA;

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
              {media.videoSrc ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={media.posterSrc || media.imageSrc || undefined}
                  className="h-full w-full object-cover"
                >
                  <source src={media.videoSrc} />
                </video>
              ) : (
                <Image src={media.imageSrc} alt={media.imageAlt} fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-morpeth-navy/40 via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ParentsStripSection() {
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

              <Link href="/jobs" className={chipBase} aria-label="Join our staff - vacancies">
                Join our staff
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 border-t border-slate-200/80 pt-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
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
