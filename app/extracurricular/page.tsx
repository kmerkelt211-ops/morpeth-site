"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeroVideo from "../components/HeroVideo";

type LinkItem = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

type VideoCard = {
  title: string;
  description: string;
  videoUrl?: string;
  videoFileUrl?: string;
  videoPosterUrl?: string;
};

type ExtracurricularContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    links: LinkItem[];
  };
  whyEnrichment: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    sidebarTitle: string;
    sidebarBullets: string[];
    sidebarNote: string;
  };
  enrichmentVideo: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    videoUrl?: string;
    videoFileUrl?: string;
    videoPosterUrl?: string;
  };
  clubVideos: {
    eyebrow: string;
    title: string;
    description: string;
    cards: VideoCard[];
    footerText: string;
  };
  flexibleTimetable: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    sidebarTitle: string;
    sidebarBullets: string[];
    sidebarBody: string;
    links: LinkItem[];
  };
  lifeBeyondLessons: {
    eyebrow: string;
    title: string;
    description: string;
    cards: Array<{ title: string; description: string }>;
    footerText: string;
  };
};

const DEFAULT_CONTENT: ExtracurricularContent = {
  hero: {
    eyebrow: "Morpeth School · Enrichment",
    title: "Extracurricular & Flexible Learning Timetable",
    description:
      "Our enrichment programme and Flexible Learning Timetable give every student the chance to try new things, discover talents and build confidence beyond the classroom.",
    links: [
      { label: "Why enrichment matters", href: "#why-enrichment" },
      { label: "Flexible Learning Timetable", href: "#flexible-timetable" },
      { label: "Life beyond lessons", href: "#life-beyond-lessons" },
    ],
  },
  whyEnrichment: {
    eyebrow: "Why enrichment matters",
    title: "Learning doesn't stop when lessons finish",
    paragraphs: [
      "At Morpeth, we believe that what happens before school, at lunchtime and after the bell is just as important as what happens in the classroom. Our enrichment programme helps students develop confidence, independence and a sense of belonging.",
      "Taking part in extracurricular activities gives students the chance to discover new interests, deepen existing passions and work with staff and peers in different ways. It's often where friendships are made, leadership skills are practised and future pathways begin to take shape.",
      "We encourage every student to take part in at least one regular activity. Our aim is that participation in enrichment becomes a normal, expected part of Morpeth life – not an optional extra for a small group.",
    ],
    sidebarTitle: "Enrichment helps students to:",
    sidebarBullets: [
      "Build confidence and resilience",
      "Work with others and lead projects",
      "Develop talents in sport, arts and academic areas",
      "Strengthen applications for Sixth Form, college and university",
      "Contribute to the wider life and culture of the school",
    ],
    sidebarNote:
      "We will publish a full overview of enrichment opportunities later in the year, so families can see what's on offer across each term.",
  },
  enrichmentVideo: {
    eyebrow: "Enrichment in action",
    title: "What enrichment looks like at Morpeth",
    paragraphs: [
      "This short film gives a flavour of Morpeth's enrichment programme: clubs, rehearsals, fixtures and projects taking place before school, at lunchtime and after lessons finish.",
      "Students talk about why they chose particular activities, what they've learned and how taking part has helped them feel more confident and connected to the school.",
      "We regularly refresh the Flexible Learning Timetable so that there is a mix of long-running opportunities and new experiences for students to try across the year.",
    ],
  },
  clubVideos: {
    eyebrow: "Club videos",
    title: "A closer look at some of our clubs",
    description:
      "We are building a library of short club videos so you can see what different activities look and feel like at Morpeth. These clips can be shared with students and families when they are choosing how to use the Flexible Learning Timetable.",
    cards: [
      {
        title: "Music & bands",
        description:
          "Rehearsals, performances and practice sessions in our music spaces. Students talk about why they enjoy making music together.",
      },
      {
        title: "Sport & teams",
        description:
          "Training sessions, matches and fixtures that show how students represent Morpeth and support one another on and off the pitch.",
      },
      {
        title: "Creative & academic clubs",
        description:
          "From art and drama to STEM, debate and languages, these clips will highlight the range of clubs on offer across the year.",
      },
      {
        title: "Drama & performance",
        description:
          "Work in progress from drama clubs and performance projects, including rehearsals and short showcases.",
      },
      {
        title: "STEM & robotics",
        description:
          "Clips from science, computing and robotics clubs, highlighting problem-solving and teamwork in action.",
      },
      {
        title: "Reading & study support",
        description:
          "A look inside reading groups, homework clubs and quiet study spaces that support learning beyond lessons.",
      },
    ],
    footerText:
      "We will continue to add club videos over time so that this section reflects the full range of opportunities available through the Flexible Learning Timetable.",
  },
  flexibleTimetable: {
    eyebrow: "Flexible Learning Timetable",
    title: "Morpeth's programme for extracurricular learning",
    paragraphs: [
      "Our Flexible Learning Timetable is the name we give to Morpeth's extracurricular programme. It brings together after-school clubs, lunchtime activities, rehearsals, fixtures and extended learning sessions into one coherent offer for students.",
      "The timetable is designed so that students can balance homework, family commitments and enrichment. On different days of the week, departments and year teams run activities ranging from sports teams and music groups to subject clinics, homework clubs and creative projects.",
      "Students are encouraged to plan a personalised \"flexible timetable\" that works for them – mixing physical activity, creative opportunities and additional academic support where needed.",
    ],
    sidebarTitle: "How it works",
    sidebarBullets: [
      "A published timetable shows what's on each day of the week",
      "Activities are open to different year groups, with clear guidance on who can attend",
      "Many activities are free; some trips or specialist opportunities may have a small cost",
      "Staff encourage students to build a routine that they can sustain",
    ],
    sidebarBody:
      "We will share the latest Flexible Learning Timetable with families via letters home and the school website. Students also see it in form time and around the school site.",
    links: [
      { label: "Download example timetable (PDF)", href: "/Documents/flexible-learning-timetable.pdf" },
      {
        label: "Peripatetic instrumental lessons timetable",
        href: "https://app.involveeducation.com/involve/display/641ae27ce56da4240591b65b/internal?fullscreen=true&view=week&token=11d9293f15d6d396216369bddacf9b12:d1b9f1fafe5d3d56c857e7fb26351eb5cd0f4e464dd30d4d90d536a5bca66847b2402f2243f6a01ef815e4d92239f364",
        openInNewTab: true,
      },
    ],
  },
  lifeBeyondLessons: {
    eyebrow: "Life beyond lessons",
    title: "Belonging, participation and pride",
    description:
      "The Flexible Learning Timetable is about more than fitting in clubs. It is part of how we build a strong school community, where every student can find something they enjoy and feel proud of.",
    cards: [
      {
        title: "Character & confidence",
        description:
          "Activities help students step outside their comfort zone in a safe, supportive environment – whether that's performing on stage, speaking in public, representing the school in a match or leading a project.",
      },
      {
        title: "Community & culture",
        description:
          "Enrichment brings together students from different year groups and backgrounds. Shared experiences – rehearsals, performances, competitions, trips – help to build the sense that Morpeth is a community, not just a building.",
      },
      {
        title: "Ready for next steps",
        description:
          "When students apply for Sixth Form, college, apprenticeships or university, their experiences through the Flexible Learning Timetable give them real examples to talk about – not just grades on a page.",
      },
    ],
    footerText:
      "We are currently working on a new way to showcase our full enrichment offer on this page. In the meantime, families will continue to receive details of activities through letters, newsletters and in-school displays.",
  },
};

type PartialExtracurricularContent = Partial<{
  hero: Partial<ExtracurricularContent["hero"]>;
  whyEnrichment: Partial<ExtracurricularContent["whyEnrichment"]>;
  enrichmentVideo: Partial<ExtracurricularContent["enrichmentVideo"]>;
  clubVideos: Partial<ExtracurricularContent["clubVideos"]>;
  flexibleTimetable: Partial<ExtracurricularContent["flexibleTimetable"]>;
  lifeBeyondLessons: Partial<ExtracurricularContent["lifeBeyondLessons"]>;
}>;

function normalizeNonEmptyArray<T>(candidate: T[] | undefined, fallback: T[]): T[] {
  if (Array.isArray(candidate) && candidate.length > 0) {
    return candidate;
  }
  return fallback;
}

function mergeContent(raw: PartialExtracurricularContent | null | undefined): ExtracurricularContent {
  if (!raw) return DEFAULT_CONTENT;

  return {
    hero: {
      ...DEFAULT_CONTENT.hero,
      ...(raw.hero ?? {}),
      links: normalizeNonEmptyArray(raw.hero?.links, DEFAULT_CONTENT.hero.links),
    },
    whyEnrichment: {
      ...DEFAULT_CONTENT.whyEnrichment,
      ...(raw.whyEnrichment ?? {}),
      paragraphs: normalizeNonEmptyArray(raw.whyEnrichment?.paragraphs, DEFAULT_CONTENT.whyEnrichment.paragraphs),
      sidebarBullets: normalizeNonEmptyArray(raw.whyEnrichment?.sidebarBullets, DEFAULT_CONTENT.whyEnrichment.sidebarBullets),
    },
    enrichmentVideo: {
      ...DEFAULT_CONTENT.enrichmentVideo,
      ...(raw.enrichmentVideo ?? {}),
      paragraphs: normalizeNonEmptyArray(raw.enrichmentVideo?.paragraphs, DEFAULT_CONTENT.enrichmentVideo.paragraphs),
    },
    clubVideos: {
      ...DEFAULT_CONTENT.clubVideos,
      ...(raw.clubVideos ?? {}),
      cards: normalizeNonEmptyArray(raw.clubVideos?.cards, DEFAULT_CONTENT.clubVideos.cards),
    },
    flexibleTimetable: {
      ...DEFAULT_CONTENT.flexibleTimetable,
      ...(raw.flexibleTimetable ?? {}),
      paragraphs: normalizeNonEmptyArray(raw.flexibleTimetable?.paragraphs, DEFAULT_CONTENT.flexibleTimetable.paragraphs),
      sidebarBullets: normalizeNonEmptyArray(raw.flexibleTimetable?.sidebarBullets, DEFAULT_CONTENT.flexibleTimetable.sidebarBullets),
      links: normalizeNonEmptyArray(raw.flexibleTimetable?.links, DEFAULT_CONTENT.flexibleTimetable.links),
    },
    lifeBeyondLessons: {
      ...DEFAULT_CONTENT.lifeBeyondLessons,
      ...(raw.lifeBeyondLessons ?? {}),
      cards: normalizeNonEmptyArray(raw.lifeBeyondLessons?.cards, DEFAULT_CONTENT.lifeBeyondLessons.cards),
    },
  };
}

function isYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function toYoutubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "");
      return `https://www.youtube.com/embed/${id}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;

      const split = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = split.findIndex((part) => part === "embed");
      if (embedIndex >= 0 && split[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${split[embedIndex + 1]}`;
      }
    }
  } catch {
    return url;
  }

  return url;
}

function resolveVideoSource(card: { videoFileUrl?: string; videoUrl?: string }): string {
  return card.videoFileUrl || card.videoUrl || "";
}

export default function ExtracurricularPage() {
  const [content, setContent] = useState<ExtracurricularContent>(DEFAULT_CONTENT);
  const [activeVideo, setActiveVideo] = useState<{ src: string; title: string; poster?: string } | null>(null);
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [enrichmentExpanded, setEnrichmentExpanded] = useState(false);
  const [timetableExpanded, setTimetableExpanded] = useState(false);
  const [lifeIntroExpanded, setLifeIntroExpanded] = useState(false);
  const [lifeCardExpanded, setLifeCardExpanded] = useState<Record<string, boolean>>({});
  const [enrichmentVideoErrorSrc, setEnrichmentVideoErrorSrc] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchContent() {
      try {
        const response = await fetch("/api/extracurricular");
        if (!response.ok) return;
        const data = (await response.json()) as PartialExtracurricularContent;
        if (mounted) {
          setContent(mergeContent(data));
        }
      } catch {
        // Keep fallback content if Sanity content is unavailable.
      }
    }

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []);

  const enrichmentVideoSrc = resolveVideoSource(content.enrichmentVideo);
  const enrichmentIsYoutube = enrichmentVideoSrc ? isYoutubeUrl(enrichmentVideoSrc) : false;
  const activeIsYoutube = activeVideo ? isYoutubeUrl(activeVideo.src) : false;
  const enrichmentVideoLoadError = Boolean(enrichmentVideoSrc && enrichmentVideoErrorSrc === enrichmentVideoSrc);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative bg-morpeth-navy text-morpeth-light">
        <HeroVideo src="/video/morpeth-drone-hero.mp4" pageKey="extracurricular" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">{content.hero.eyebrow}</p>
          <h1 className="mt-4 font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">{content.hero.title}</h1>
          <p className="mt-5 max-w-2xl text-sm text-morpeth-light/90 md:text-base">{content.hero.description}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {content.hero.links.map((link, index) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                className={
                  index === 0
                    ? "inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                    : "inline-flex items-center justify-center rounded-full border border-morpeth-light/60 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light hover:-translate-y-0.5 hover:bg-morpeth-light/10 hover:shadow-lg"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="why-enrichment" className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <article className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">{content.whyEnrichment.eyebrow}</p>
                <h2 className="mt-1 font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy md:text-2xl">{content.whyEnrichment.title}</h2>
                <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                  {content.whyEnrichment.paragraphs.map((paragraph, index) => (
                    <p key={paragraph.slice(0, 30)} className={index === 0 || whyExpanded ? "" : "hidden sm:block"}>
                      {paragraph}
                    </p>
                  ))}
                  {!whyExpanded && content.whyEnrichment.paragraphs.length > 1 ? (
                    <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-white sm:hidden" />
                  ) : null}
                  {content.whyEnrichment.paragraphs.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setWhyExpanded((value) => !value)}
                      className="mt-2 inline-flex items-center rounded-full bg-morpeth-light/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                    >
                      {whyExpanded ? "Show less" : "Read more"}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">{content.whyEnrichment.sidebarTitle}</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {content.whyEnrichment.sidebarBullets.map((bullet) => (
                    <li key={bullet.slice(0, 30)}>• {bullet}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-500">{content.whyEnrichment.sidebarNote}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-sm ring-1 ring-slate-900/10">
              {!enrichmentVideoSrc || enrichmentVideoLoadError ? (
                <div className="flex h-full w-full flex-col items-center justify-center px-5 text-center">
                  <p className="text-sm text-slate-300">Enrichment video coming soon</p>
                  {enrichmentVideoLoadError ? (
                    <p className="mt-2 text-xs text-slate-400">
                      The configured video source could not be loaded.
                    </p>
                  ) : null}
                </div>
              ) : enrichmentIsYoutube ? (
                <iframe
                  src={toYoutubeEmbedUrl(enrichmentVideoSrc)}
                  title="Enrichment video"
                  className="h-full w-full rounded-3xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setEnrichmentVideoErrorSrc(enrichmentVideoSrc)}
                />
              ) : (
                <video
                  className="h-full w-full rounded-3xl object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  controlsList="nodownload"
                  poster={content.enrichmentVideo.videoPosterUrl}
                  onError={() => setEnrichmentVideoErrorSrc(enrichmentVideoSrc)}
                >
                  <source src={enrichmentVideoSrc} type="video/mp4" />
                </video>
              )}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">{content.enrichmentVideo.eyebrow}</p>
              <h2 className="mt-2 font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy md:text-2xl">{content.enrichmentVideo.title}</h2>
              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                {content.enrichmentVideo.paragraphs.map((paragraph, index) => (
                  <p key={paragraph.slice(0, 30)} className={index === 0 || enrichmentExpanded ? "" : "hidden sm:block"}>
                    {paragraph}
                  </p>
                ))}
                {!enrichmentExpanded && content.enrichmentVideo.paragraphs.length > 1 ? (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-slate-50 sm:hidden" />
                ) : null}
                {content.enrichmentVideo.paragraphs.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setEnrichmentExpanded((value) => !value)}
                    className="mt-2 inline-flex items-center rounded-full bg-morpeth-light/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                  >
                    {enrichmentExpanded ? "Show less" : "Read more"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="club-videos" className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:py-14">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">{content.clubVideos.eyebrow}</p>
            <h2 className="mt-1 font-heading text-2xl uppercase tracking-[0.12em] text-morpeth-navy md:text-3xl">{content.clubVideos.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-700">{content.clubVideos.description}</p>
          </header>

          <div className="-mx-4 overflow-x-auto pb-2">
            <div className="flex snap-x snap-mandatory gap-4 px-4">
              {content.clubVideos.cards.map((card) => {
                const videoSrc = resolveVideoSource(card);
                const cardIsYoutube = videoSrc ? isYoutubeUrl(videoSrc) : false;

                if (videoSrc) {
                  return (
                    <button
                      key={`${card.title}-${card.description.slice(0, 12)}`}
                      type="button"
                      onClick={() => {
                        setActiveVideo({ src: videoSrc, title: card.title, poster: card.videoPosterUrl });
                      }}
                      className="group flex min-w-[320px] max-w-sm snap-center flex-col rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                        {cardIsYoutube ? (
                          <>
                            {card.videoPosterUrl ? (
                              <Image
                                src={card.videoPosterUrl}
                                alt={card.title}
                                fill
                                className="object-cover opacity-90 transition group-hover:opacity-100"
                              />
                            ) : (
                              <div className="h-full w-full bg-slate-800" />
                            )}
                            <div className="pointer-events-none absolute inset-0 bg-black/35" />
                          </>
                        ) : (
                          <video
                            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                            playsInline
                            muted
                            preload="metadata"
                            poster={card.videoPosterUrl}
                          >
                            <source src={videoSrc} type="video/mp4" />
                          </video>
                        )}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                            Play
                          </span>
                        </div>
                      </div>
                      <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{card.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{card.description}</p>
                    </button>
                  );
                }

                return (
                  <article
                    key={`${card.title}-${card.description.slice(0, 12)}`}
                    className="flex min-w-[320px] max-w-sm snap-center flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">Video coming soon</div>
                    </div>
                    <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-500">{content.clubVideos.footerText}</p>
        </div>
      </section>

      <section id="flexible-timetable" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">{content.flexibleTimetable.eyebrow}</p>
              <h2 className="mt-1 font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy md:text-2xl">{content.flexibleTimetable.title}</h2>
              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                {content.flexibleTimetable.paragraphs.map((paragraph, index) => (
                  <p key={paragraph.slice(0, 30)} className={index === 0 || timetableExpanded ? "" : "hidden sm:block"}>
                    {paragraph}
                  </p>
                ))}
                {!timetableExpanded && content.flexibleTimetable.paragraphs.length > 1 ? (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-slate-50 sm:hidden" />
                ) : null}
                {content.flexibleTimetable.paragraphs.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setTimetableExpanded((value) => !value)}
                    className="mt-2 inline-flex items-center rounded-full bg-morpeth-light/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                  >
                    {timetableExpanded ? "Show less" : "Read more"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-700 md:col-span-2">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900">{content.flexibleTimetable.sidebarTitle}</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                {content.flexibleTimetable.sidebarBullets.map((bullet) => (
                  <li key={bullet.slice(0, 30)}>• {bullet}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-slate-700">{content.flexibleTimetable.sidebarBody}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                {content.flexibleTimetable.links.map((link) => {
                  const isExternal = link.openInNewTab || link.href.startsWith("http://") || link.href.startsWith("https://");
                  if (isExternal) {
                    return (
                      <a
                        key={`${link.label}-${link.href}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                      >
                        {link.label}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="life-beyond-lessons" className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:py-14">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">{content.lifeBeyondLessons.eyebrow}</p>
            <h2 className="mt-1 font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy md:text-2xl">{content.lifeBeyondLessons.title}</h2>
            <div className="relative mt-3">
              <p
                className={`text-sm leading-relaxed text-slate-700 ${
                  lifeIntroExpanded ? "" : "max-h-[7.25rem] overflow-hidden sm:max-h-none"
                }`}
              >
                {content.lifeBeyondLessons.description}
              </p>
              {!lifeIntroExpanded ? (
                <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-morpeth-offwhite sm:hidden" />
              ) : null}
              <button
                type="button"
                onClick={() => setLifeIntroExpanded((value) => !value)}
                className="mt-2 inline-flex items-center rounded-full bg-morpeth-light/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
              >
                {lifeIntroExpanded ? "Show less" : "Read more"}
              </button>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            {content.lifeBeyondLessons.cards.map((card, index) => {
              const cardKey = `${card.title}-${index}`;
              const isExpanded = Boolean(lifeCardExpanded[cardKey]);

              return (
                <article key={card.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-base font-semibold tracking-tight text-slate-900">{card.title}</h3>
                <div className="relative mt-2">
                  <p
                    className={`text-sm leading-relaxed text-slate-700 ${
                      isExpanded ? "" : "max-h-[9rem] overflow-hidden sm:max-h-none"
                    }`}
                  >
                    {card.description}
                  </p>
                  {!isExpanded ? (
                    <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-white sm:hidden" />
                  ) : null}
                  <button
                    type="button"
                    onClick={() =>
                      setLifeCardExpanded((prev) => ({
                        ...prev,
                        [cardKey]: !prev[cardKey],
                      }))
                    }
                    className="mt-2 inline-flex items-center rounded-full bg-morpeth-light/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                </div>
              </article>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-slate-500">{content.lifeBeyondLessons.footerText}</p>
        </div>
      </section>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-4xl">
            <div className="aspect-video overflow-hidden rounded-2xl bg-black">
              {activeIsYoutube ? (
                <iframe
                  src={toYoutubeEmbedUrl(activeVideo.src)}
                  title={activeVideo.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  key={activeVideo.src}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  poster={activeVideo.poster}
                >
                  <source src={activeVideo.src} type="video/mp4" />
                </video>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute -right-2 -top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow-md"
              aria-label="Close video"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
