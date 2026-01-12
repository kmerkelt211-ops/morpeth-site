"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "../sanity/client";
// Reusable button with shared hover/transition
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };
const btnBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow-lg md:px-6 md:py-3 md:text-xs md:tracking-[0.18em] md:hover:scale-[1.01] active:translate-y-0";
function Btn({ className = "", ...props }: BtnProps) {
  return <button className={`${btnBase} ${className}`} {...props} />;
}
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

function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  return (
    <section className="relative bg-morpeth-navy text-morpeth-light">
      {/* Background media (poster + video crossfade) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Poster image as a stable background */}
        <Image
          src="/images/morpeth-drone-hero-poster.jpg"
          alt="Morpeth School aerial view"
          fill
          priority
          className="object-cover z-0"
          sizes="100vw"
        />

        {/* Video fades in only after it's ready, to avoid a harsh flash */}
        <video
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-300 ${videoReady ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
        >
          <source src="/video/morpeth-drone-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient overlay over both poster and video */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/55 via-morpeth-navy/65 to-morpeth-navy/85" />
      </div>
      {/* Content on top of video */}
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
          Behind every grade is a story of hard work, resilience and pride.
          Here, people believe in you, and that changes everything.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Btn className="bg-morpeth-light text-morpeth-navy">Visit our school</Btn>
          <Link
            href="/sixth-form"
            className={`${btnBase} border border-morpeth-light/70 text-morpeth-light bg-transparent`}
          >
            Sixth Form
          </Link>
          <a
            href="/Documents/prospectus.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} border border-morpeth-light/40 text-morpeth-light/80 bg-transparent`}
          >
            Download prospectus
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===== KEY STATS STRIP ===== */

function KeyStatsStrip() {
  // TEMP values – we’ll plug real data in later
  const stats = [
    { label: "GCSE grades 9–4", value: "xx%" },
    { label: "GCSE grades 9–7", value: "xx%" },
    { label: "A level A*–B", value: "xx%" },
    { label: "Students staying in education or training", value: "xx%" },
  ];

  return (
    <section className="bg-morpeth-offwhite">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-7">
        <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-4 text-sm md:flex md:flex-wrap md:items-center md:justify-between md:gap-4 md:text-[15px]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 border-slate-200/70 text-sm md:min-w-[10rem] md:flex-1 md:text-[15px]"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-1 text-xl font-heading text-morpeth-navy">
                {stat.value}
              </p>
            </div>
          ))}
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

// Simplified: no scroll-based animation, just a pass-through wrapper
function Reveal({ children, className = "" }: RevealProps) {
  return <div className={className}>{children}</div>;
}

/* ===== UPCOMING EVENTS (from ICS via API) ===== */

type CalendarEvent = {
  title: string;
  start: string; // ISO
  end?: string;  // ISO
  location?: string;
  url?: string;
};

function UpcomingEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch("/api/events?limit=6", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load events");
        const data = (await res.json()) as CalendarEvent[];
        setEvents(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError("Calendar unavailable right now.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || events.length === 0) return;

    // Only auto-scroll on devices that can hover and have a fine pointer (i.e., desktop).
    // This avoids “fighting” the user on iPhone where hover doesn’t exist.
    const canAutoScroll =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!canAutoScroll) return;

    let raf = 0;
    const step = () => {
      if (!paused) {
        el.scrollLeft += 0.6; // adjust speed if needed
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
          el.scrollLeft = 0; // loop back to start
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, events.length]);

  const subscribeHref = "webcal://www.morpethschool.org.uk/calendar/events.ics";
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(new Date(iso));

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                Upcoming events
              </p>
              <h2 className="mt-2 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
                What’s on at Morpeth
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <a
                href="/calendar"
                className="rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                View full calendar
              </a>
              <a
                href={subscribeHref}
                className="rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                Subscribe
              </a>
            </div>
          </div>
        </Reveal>

        {/* Cards row */}
        <div
          className="mt-6 -mx-4 overflow-x-auto px-4 no-scrollbar snap-x snap-mandatory scroll-px-4"
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-label="Upcoming events carousel"
        >
          <div className="flex gap-3 md:grid md:grid-cols-3 md:gap-4">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[240px] flex-shrink-0 snap-start rounded-xl bg-morpeth-offwhite p-4 shadow-card"
                >
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 w-24 rounded bg-slate-300/60" />
                    <div className="h-5 w-3/4 rounded bg-slate-300/60" />
                    <div className="h-4 w-2/3 rounded bg-slate-300/60" />
                  </div>
                </div>
              ))}

            {!loading && error && (
              <div className="min-w-[240px] flex-shrink-0 snap-start rounded-xl bg-morpeth-offwhite p-4 text-sm text-slate-700 shadow-card">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              events.map((ev, i) => (
                <Reveal key={`${ev.start}-${i}`} delay={i * 80}>
                  <article
                    className="min-w-[240px] flex-shrink-0 snap-start rounded-xl bg-morpeth-offwhite p-4 shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:w-auto"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      {formatDate(ev.start)}
                    </p>
                    <h3 className="mt-1 text-[15px] font-heading uppercase tracking-[0.14em] text-morpeth-navy">
                      {ev.title}
                    </h3>
                    {ev.location && (
                      <p className="mt-1 text-xs text-slate-600">{ev.location}</p>
                    )}
                  </article>
                </Reveal>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== LATEST NEWS (carousel) ===== */
function LatestNews() {
  type NewsCard = {
    title: string;
    href: string;
    date: string;
    excerpt?: string;
    imageUrl?: string;
    imageAlt?: string;
  };

  const NEWS_QUERY = `
  *[_type == "post" && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc)[0...3]{
    title,
    "href": "/news/" + slug.current,
    "date": coalesce(publishedAt, _createdAt),
    excerpt,
    // Try a few common image field names; whichever exists will be used
    "imageUrl": coalesce(mainImage.asset->url, coverImage.asset->url, image.asset->url),
    "imageAlt": coalesce(mainImage.alt, coverImage.alt, title)
  }
  `;

  const [posts, setPosts] = useState<NewsCard[]>([]);
  const [idx, setIdx] = useState(0);
  const len = posts.length;

  useEffect(() => {
    let mounted = true;
    sanityFetch<NewsCard[]>(NEWS_QUERY)
      .then((res) => {
        if (mounted) setPosts(res || []);
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!len) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % len), 6000);
    return () => clearInterval(id);
  }, [len]);

  const go = (n: number) => len && setIdx((n + len) % len);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-9 pb-9 md:py-12">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                Latest news
              </p>
              <h2 className="mt-2 text-xl font-heading uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
                What’s happening at Morpeth
              </h2>
            </div>
            <Link
              href="/news"
              className="self-start md:self-auto text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy underline underline-offset-4 hover:opacity-80"
            >
              View all news
            </Link>
          </div>
        </Reveal>

        {/* Carousel */}
        <div className="relative mt-5 md:mt-6">
          <Reveal>
            {posts.length === 0 ? (
              <div className="animate-pulse space-y-3 rounded-2xl bg-morpeth-offwhite p-6 shadow-card md:p-7">
                <div className="h-3 w-24 rounded bg-slate-300/60" />
                <div className="h-5 w-3/4 rounded bg-slate-300/60" />
                <div className="h-4 w-2/3 rounded bg-slate-300/60" />
              </div>
            ) : (
              <article
                key={posts[idx].href}
                className="overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card"
              >
                {/* If the post has an image, show text OVER the image */}
                {posts[idx].imageUrl ? (
                  <div className="relative h-56 w-full overflow-hidden md:h-64 lg:h-72">
                    <Image
                      src={posts[idx].imageUrl!}
                      alt={posts[idx].imageAlt || posts[idx].title}
                      fill
                      unoptimized
                      priority
                      className="object-cover object-center"
                      sizes="(min-width: 1024px) 960px, (min-width: 768px) 720px, 100vw"
                    />
                    {/* Stronger gradient for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                    {/* Overlayed text */}
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-morpeth-light/90">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(posts[idx].date))}
                      </p>
                      <h3 className="mt-1 md:mt-2 text-lg md:text-xl font-heading uppercase tracking-[0.14em] text-white drop-shadow">
                        <Link href={posts[idx].href} className="hover:underline">
                          {posts[idx].title}
                        </Link>
                      </h3>
                      {posts[idx].excerpt && (
                        <p className="mt-2 hidden max-w-3xl text-sm text-morpeth-light/95 md:block">
                          {posts[idx].excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback layout if there is no image */
                  <div className="p-6 md:p-7">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(posts[idx].date))}
                    </p>
                    <h3 className="mt-2 text-lg font-heading uppercase tracking-[0.14em] text-morpeth-navy">
                      <Link href={posts[idx].href} className="hover:underline">
                        {posts[idx].title}
                      </Link>
                    </h3>
                    {posts[idx].excerpt && (
                      <p className="mt-3 max-w-2xl text-sm text-slate-800">{posts[idx].excerpt}</p>
                    )}
                  </div>
                )}
              </article>
            )}
          </Reveal>

          {posts.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {posts.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => go(i)}
                  className={`h-1.5 w-6 rounded-full transition ${
                    i === idx ? "bg-morpeth-navy" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
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
    <section className="bg-white">
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
          {/* Text + destinations */}
          <Reveal delay={60}>
            <div className="space-y-4 text-sm md:text-[15px] text-slate-800">
              <p>
                Our students go on to sixth forms, apprenticeships and top
                universities across the country. This section will showcase our
                latest GCSE and Sixth Form results alongside government
                performance measures.
              </p>
              <p>
                We will pull in the confirmed figures for 2024/25 here and
                highlight destinations such as Russell Group universities, arts
                schools and competitive apprenticeships.
              </p>
              <p className="text-xs text-slate-500">
                The graphs on the right are layout examples – once you&apos;re
                happy with the design, we&apos;ll drop in the real percentages.
              </p>
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
                <p className="mt-4 text-[11px] text-morpeth-light">
                  We can also add a small list of recent university destinations
                  or apprenticeship providers here.
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

// Simplified: static card wrapper, no scroll or wipe animation
function RevealCard({ children }: RevealCardProps) {
  return (
    <div className="relative">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
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
    <section className="bg-morpeth-light/25">
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
    <section className="bg-gradient-to-r from-morpeth-navy via-morpeth-navy to-morpeth-mid">
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
              This strip will link through to detailed course information,
              pathways and success stories.
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
    <section className="bg-white">
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
                The Parents area will bring together day-to-day information, forms
                and key links so it&apos;s quick and simple to stay up to date.
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
                  Full details will sit on the Uniform page – here we give a quick
                  snapshot and a clear link through.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/uniform"
                    className="inline-flex items-center justify-center rounded-full border border-morpeth-navy/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    View full uniform guide
                  </Link>
                  <Link
                    href="/uniform"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    Equipment checklist
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
                    listed on the Uniform page.
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
  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      <Hero />
      <UpcomingEvents />
      <LatestNews />
      <ResultsSection />
      <LifeAtMorpeth />
      <SixthFormHighlight />
      <ParentsStrip />
    </main>
  );
}