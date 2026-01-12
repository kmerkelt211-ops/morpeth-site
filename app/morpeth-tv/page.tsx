"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type VideoItem = {
  title: string
  strapline?: string
  youtubeId: string
  category: "feature" | "news"
  dateLabel?: string
}

type SanityVideoDoc = {
  _id: string
  title?: string
  strapline?: string
  youtubeId?: string
  category?: "feature" | "news"
  dateLabel?: string
  order?: number
}

function buildSanityQueryUrl() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) return null

  // Query a simple doc type. If you name it differently in Sanity, just change this _type.
  const groq = `*[_type == "morpethTvVideo" && defined(youtubeId)]|order(order asc, _createdAt desc){_id,title,strapline,youtubeId,category,dateLabel,order}`
  const encoded = encodeURIComponent(groq)

  return `https://${projectId}.api.sanity.io/v2023-08-01/data/query/${dataset}?query=${encoded}`
}

async function fetchSanityVideos(): Promise<SanityVideoDoc[]> {
  const url = buildSanityQueryUrl()
  if (!url) return []

  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return []
    const json = (await res.json()) as { result?: SanityVideoDoc[] }
    return Array.isArray(json?.result) ? json.result : []
  } catch {
    return []
  }
}

function mergeVideos(fallback: VideoItem[], sanityDocs: SanityVideoDoc[]): VideoItem[] {
  const sanityFeatures = sanityDocs
    .filter((d) => d.category === "feature" && d.youtubeId)
    .map<VideoItem>((d) => ({
      title: d.title ?? "Untitled feature",
      strapline: d.strapline,
      youtubeId: d.youtubeId!,
      category: "feature",
      dateLabel: d.dateLabel,
    }))

  const sanityNews = sanityDocs
    .filter((d) => d.category === "news" && d.youtubeId)
    .map<VideoItem>((d) => ({
      title: d.title ?? "Untitled episode",
      strapline: d.strapline,
      youtubeId: d.youtubeId!,
      category: "news",
      dateLabel: d.dateLabel,
    }))

  // Only overwrite a category if we actually got items back from Sanity.
  const useFeatures = sanityFeatures.length > 0
  const useNews = sanityNews.length > 0

  const fallbackFeatures = fallback.filter((v) => v.category === "feature")
  const fallbackNews = fallback.filter((v) => v.category === "news")

  const mergedFeatures = useFeatures ? sanityFeatures.slice(0, 3) : fallbackFeatures
  const mergedNews = useNews ? sanityNews : fallbackNews

  return [...mergedFeatures, ...mergedNews]
}

function YouTubePlayer({
  youtubeId,
  title,
}: {
  youtubeId: string
  title: string
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {/* subtle scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)",
        }}
      />
    </div>
  )
}

function NeonRibbon({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        "relative mx-auto my-10 h-[10px] max-w-6xl overflow-hidden rounded-full",
        "ring-1 ring-white/10",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 neon-flow" />
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)",
        }}
      />
    </div>
  )
}

export default function MorpethTVPage() {
  const fallbackVideos = useMemo<VideoItem[]>(
    () => [
      // FEATURES (replace IDs)
      {
        title: "Behind the Scenes: Art & Photography",
        strapline: "A look at student work and how exhibitions come together.",
        youtubeId: "dQw4w9WgXcQ",
        category: "feature",
        dateLabel: "Latest feature",
      },
      {
        title: "Student Spotlight",
        strapline: "Big moments, big talent — celebrating student achievements.",
        youtubeId: "dQw4w9WgXcQ",
        category: "feature",
        dateLabel: "New",
      },
      {
        title: "Morpeth Voices",
        strapline: "Quick interviews: what students think, want, and care about.",
        youtubeId: "dQw4w9WgXcQ",
        category: "feature",
        dateLabel: "Trending",
      },

      // NEWS (replace IDs)
      {
        title: "Morpeth News — Episode 01",
        strapline: "School-wide news every two weeks (Newsround-style).",
        youtubeId: "dQw4w9WgXcQ",
        category: "news",
        dateLabel: "Latest episode",
      },
      {
        title: "Morpeth News — Episode 00",
        strapline: "Previous episode (placeholder).",
        youtubeId: "dQw4w9WgXcQ",
        category: "news",
        dateLabel: "Previous",
      },
    ],
    []
  )

  const [videos, setVideos] = useState<VideoItem[]>(fallbackVideos)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const sanity = await fetchSanityVideos()
      if (cancelled) return
      if (sanity.length === 0) return

      const merged = mergeVideos(fallbackVideos, sanity)
      setVideos(merged)
    })()

    return () => {
      cancelled = true
    }
  }, [fallbackVideos])

  const featureVideos = videos.filter((v) => v.category === "feature")
  const newsVideos = videos.filter((v) => v.category === "news")

  const [selectedNews, setSelectedNews] = useState<VideoItem>(
    newsVideos[0] ?? {
      title: "Morpeth News",
      youtubeId: "dQw4w9WgXcQ",
      category: "news",
      strapline: "",
      dateLabel: "",
    }
  )

  useEffect(() => {
    // When videos update from Sanity, keep selectedNews valid.
    if (newsVideos.length > 0) setSelectedNews((prev) => newsVideos.find((n) => n.title === prev.title) ?? newsVideos[0])
  }, [newsVideos])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Neon background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-60 bg-fuchsia-600" />
        <div className="absolute top-48 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-50 bg-cyan-400" />
        <div className="absolute bottom-[-220px] right-[-220px] h-[620px] w-[620px] rounded-full blur-3xl opacity-45 bg-lime-400" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, rgba(0,0,0,0) 0)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>
      <style jsx global>{`
        .neon-flow {
          background: linear-gradient(
            90deg,
            rgba(217, 70, 239, 0.95),
            rgba(34, 211, 238, 0.95),
            rgba(163, 230, 53, 0.95),
            rgba(217, 70, 239, 0.95)
          );
          background-size: 300% 100%;
          animation: morpethNeonFlow 7s linear infinite;
          filter: blur(0px);
        }

        /* MTV-style zebra/stripe texture */
        .mtv-zebra {
          /* zebra-ish stripe texture */
          background-image:
            repeating-linear-gradient(
              -25deg,
              rgba(34, 211, 238, 0.22) 0px,
              rgba(34, 211, 238, 0.22) 10px,
              rgba(0, 0, 0, 0) 10px,
              rgba(0, 0, 0, 0) 22px
            ),
            repeating-linear-gradient(
              20deg,
              rgba(217, 70, 239, 0.14) 0px,
              rgba(217, 70, 239, 0.14) 12px,
              rgba(0, 0, 0, 0) 12px,
              rgba(0, 0, 0, 0) 28px
            );
          filter: blur(0.2px);
        }

        @media (prefers-reduced-motion: no-preference) {
          .mtv-zebra {
            background-size: 140% 140%, 160% 160%;
            animation: mtvZebraDrift 18s linear infinite;
          }
        }

        @keyframes mtvZebraDrift {
          0% {
            background-position: 0% 0%, 100% 0%;
          }
          100% {
            background-position: 100% 100%, 0% 100%;
          }
        }

        @keyframes morpethNeonFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:pt-20 md:pb-14">
          <div className="relative overflow-hidden rounded-[32px] ring-1 ring-white/10 bg-white/5">
            {/* Live VHS/no-signal video background inside the hero card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{
                maskImage:
                  "radial-gradient(85% 75% at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "radial-gradient(85% 75% at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0) 100%)",
              }}
            >
              <video
                className="h-full w-full object-cover opacity-[0.55] [filter:contrast(1.25)_saturate(1.25)_brightness(1.05)]"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/MTV/no-signal.mp4" type="video/mp4" />
              </video>

              {/* a touch of scanlines on top of the video */}
              <div
                className="absolute inset-0 opacity-10 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)",
                }}
              />
            </div>

            {/* keep text super readable */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 75% at 42% 35%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.52) 72%, rgba(0,0,0,0.72) 100%)",
              }}
            />

            {/* “sticker” corner */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rotate-12 rounded-3xl bg-white/10 ring-1 ring-white/10" />
            <div className="relative z-10 p-6 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white">
                Morpeth TV
              </p>
              <h1 className="mt-2 font-heading text-4xl md:text-6xl uppercase tracking-[0.12em]">
                Student-made.
                <br />
                School-wide.
                <br />
                Fresh every fortnight.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white">
                Morpeth TV is our student platform for creating video content —
                features, behind-the-scenes, interviews and a fortnightly school
                news broadcast inspired by the clear, friendly style of BBC
                Newsround.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#latest"
                  className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  Watch latest features
                </a>
                <a
                  href="#news"
                  className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/10 transition"
                >
                  Watch the news show
                </a>
                <a
                  href="#get-involved"
                  className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/10 transition"
                >
                  Get involved
                </a>

                <Link
                  href="/"
                  className="ml-auto rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 hover:bg-white/10 transition"
                >
                  Back to home
                </Link>
              </div>
            </div>

            {/* subtle tape label */}
            <div className="border-t border-white/10 px-6 py-3 md:px-10">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                New drops • Student voice • Every two weeks: Morpeth News
              </p>
            </div>
          </div>
        </div>
      </section>
      <NeonRibbon className="mt-2" />

      {/* WHAT IS MTV */}
      <section className="mx-auto max-w-6xl px-4 pb-8 md:pb-10">
        <div className="grid gap-6 md:grid-cols-5">
          <article className="md:col-span-3 rounded-[28px] bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
            <h2 className="font-heading text-2xl uppercase tracking-[0.12em]">
              What is Morpeth TV?
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-6 text-white/80">
              <p>
                Morpeth TV is a student-led video space: a place to tell stories,
                celebrate achievements, share ideas, and build confidence on
                camera and behind it.
              </p>
              <p>
                Every two weeks, we publish a school-wide news broadcast —
                designed to be clear, friendly and informative, just like a
                Newsround-style show for our community.
              </p>
            </div>
          </article>

          <aside className="md:col-span-2 rounded-[28px] bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">
              Skills you’ll build
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>• Filming & editing</li>
              <li>• Presenting & interviewing</li>
              <li>• Writing scripts & storyboards</li>
              <li>• Teamwork, deadlines, broadcast workflow</li>
            </ul>
          </aside>
        </div>
      </section>
      <NeonRibbon />

      {/* LATEST FEATURES */}
      <section id="latest" className="mx-auto max-w-6xl px-4 pb-10 md:pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">
              Latest features
            </p>
            <h2 className="mt-2 font-heading text-2xl md:text-3xl uppercase tracking-[0.12em]">
              Fresh cuts & highlights
            </h2>
          </div>
          <div className="hidden md:block text-[11px] uppercase tracking-[0.3em] text-white/60">
            big stories • small moments • real voices
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {featureVideos.map((v) => (
            <article
              key={v.title}
              className="group rounded-[28px] bg-white/5 ring-1 ring-white/10 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/80 ring-1 ring-white/10">
                  {v.dateLabel ?? "Feature"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/60">
                  Morpeth TV
                </span>
              </div>

              <div className="mt-3">
                <YouTubePlayer youtubeId={v.youtubeId} title={v.title} />
              </div>

              <h3 className="mt-4 text-sm font-semibold tracking-tight">
                {v.title}
              </h3>
              {v.strapline ? (
                <p className="mt-2 text-xs leading-5 text-white/75">
                  {v.strapline}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      <NeonRibbon />

      {/* NEWS SHOW */}
      <section id="news" className="mx-auto max-w-6xl px-4 pb-10 md:pb-14">
        <div className="rounded-[32px] bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">
                Morpeth News
              </p>
              <h2 className="mt-2 font-heading text-2xl md:text-3xl uppercase tracking-[0.12em]">
                The fortnightly school broadcast
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Announcements, achievements, dates, interviews and what’s coming
                up — presented in a clear, friendly style for the whole school.
              </p>

              <div className="mt-5">
                <YouTubePlayer
                  youtubeId={selectedNews.youtubeId}
                  title={selectedNews.title}
                />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{selectedNews.title}</h3>
              {selectedNews.strapline ? (
                <p className="mt-2 text-xs text-white/75">{selectedNews.strapline}</p>
              ) : null}
            </div>

            <aside className="md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">
                Episodes
              </p>
              <div className="mt-3 space-y-2">
                {newsVideos.map((v) => {
                  const active = v.title === selectedNews.title
                  return (
                    <button
                      key={v.title}
                      type="button"
                      onClick={() => setSelectedNews(v)}
                      className={[
                        "w-full text-left rounded-2xl px-4 py-3 ring-1 transition",
                        active
                          ? "bg-white text-black ring-white"
                          : "bg-white/5 text-white ring-white/10 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold">{v.title}</span>
                        <span className="text-[10px] uppercase tracking-[0.24em] opacity-70">
                          {v.dateLabel ?? "Episode"}
                        </span>
                      </div>
                      {v.strapline ? (
                        <p className="mt-1 text-[11px] leading-4 opacity-80">
                          {v.strapline}
                        </p>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>
      <NeonRibbon />

      {/* STUDENT VOICE + COUNCIL */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[28px] bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
            <h2 className="font-heading text-2xl uppercase tracking-[0.12em]">
              Student voice matters
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-6 text-white/80">
              <p>
                Morpeth TV is more than videos — it’s a platform for ideas,
                opinions and stories that deserve to be heard. When students help
                shape the conversation, school becomes stronger, fairer and more
                connected.
              </p>
              <p className="text-white/70">
                (We can add real student quotes here once you’ve got them —
                these will look AMAZING in this design.)
              </p>
            </div>
          </article>

          <article className="rounded-[28px] bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
            <h2 className="font-heading text-2xl uppercase tracking-[0.12em]">
              Student Council
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-6 text-white/80">
              <p>
                The Student Council represents student views and helps improve
                school life. Morpeth TV can spotlight campaigns, share updates,
                and report on “you said / we did”.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>• Interviews with representatives</li>
                <li>• Coverage of projects & events</li>
                <li>• Quick polls + feedback features</li>
              </ul>
            </div>
          </article>
        </div>
      </section>
      <NeonRibbon />

      {/* GET INVOLVED */}
      <section id="get-involved" className="mx-auto max-w-6xl px-4 pb-16">
        <NeonRibbon className="my-8" />
        <div className="rounded-[32px] bg-white/5 ring-1 ring-white/10 p-6 md:p-10">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-[0.12em]">
            Get involved
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">
            Want to present, film, edit, write scripts, design graphics or make
            music for intros? Morpeth TV is a production team — there’s a role
            for every skill.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:enquiries@morpeth.towerhamlets.sch.uk?subject=Morpeth%20TV%20-%20Get%20involved"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black hover:-translate-y-0.5 hover:shadow-lg transition"
            >
              Email to join Morpeth TV
            </a>
            <Link
              href="/gallery"
              className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-white/10 transition"
            >
              Visit the Gallery
            </Link>
          </div>
        </div>
        <NeonRibbon className="my-8" />
      </section>
    </main>
  )
}