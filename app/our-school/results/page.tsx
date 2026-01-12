"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { createClient } from "@sanity/client"
import { PortableText } from "@portabletext/react"
import imageUrlBuilder from "@sanity/image-url"

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)

function urlForImage(source: any) {
  return builder.image(source)
}

type AnimatedBarProps = {
  value: number
  barClassName: string
  trackClassName?: string
}

function AnimatedBar({ value, barClassName, trackClassName }: AnimatedBarProps) {
  const [width, setWidth] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = trackRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate up when the bar scrolls into view
            setWidth(value)
          } else {
            // Reset when it scrolls out of view so it can animate again
            setWidth(0)
          }
        })
      },
      { threshold: 0.35 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [value])

  return (
    <div
      ref={trackRef}
      className={`mt-3 h-2 rounded-full overflow-hidden ${trackClassName ?? "bg-slate-100/80"}`}
    >
      <div
        className={`h-2 rounded-full transition-[width] duration-700 ease-out ${barClassName}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}


type ResultMetric = {
  _key: string
  label: string
  value: number
  max?: number | null
  colourClass?: string | null // Tailwind class from Sanity, e.g. "bg-sky-600"
}

type ResultGraph = {
  _id: string
  title: string
  subtitle?: string
  layout?: "bars" | "stacked" | "dual"
  category?: string
  year?: string
  note?: string
  metrics: ResultMetric[]
}

type GCSEResults = {
  title?: string
  heroHeading?: string
  heroImage?: any
  intro?: any[]
  resultsHeading?: string
  resultsBullets?: string[]
  headlineMetrics?: ResultMetric[]
  progressHeading?: string
  progressBody?: any[]
  proudHeading?: string
  proudBody?: any[]
  dfeLinkLabel?: string
  dfeLinkUrl?: string
  breakdownGraphs?: ResultGraph[]
}

type SixthFormResults = {
  title?: string
  heroHeading?: string
  heroImage?: any
  intro?: any[]
  destinationsHeading?: string
  destinationsBody?: any[]
  curriculumHeading?: string
  curriculumBody?: any[]
  aLevelHeadlineMetrics?: ResultMetric[]
  btecHeadlineMetrics?: ResultMetric[]
  btecSummary?: any[]
  dfeLinkLabel?: string
  dfeLinkUrl?: string
  breakdownGraphs?: ResultGraph[]
}

function ResultsGraphCard({ graph }: { graph: ResultGraph }) {
  if (!graph.metrics || graph.metrics.length === 0) return null

  const maxValue =
    graph.metrics.reduce((max, m) => {
      const candidate = typeof m.max === "number" && m.max > 0 ? m.max : m.value
      return Math.max(max, candidate)
    }, 0) || 100

  return (
    <article className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <header className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {graph.category || "Additional measure"}
          {graph.year ? ` • ${graph.year}` : ""}
        </p>
        <h3 className="mt-1 text-sm font-semibold tracking-[0.14em] uppercase text-morpeth-navy">
          {graph.title}
        </h3>
        {graph.subtitle && (
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{graph.subtitle}</p>
        )}
      </header>

      <div className="space-y-3">
        {graph.metrics.map((metric) => {
          const widthPercent = maxValue ? Math.min(100, (metric.value / maxValue) * 100) : 0
          const barClass = metric.colourClass && metric.colourClass.trim().length > 0
            ? metric.colourClass
            : "bg-sky-600"

          return (
            <div key={metric._key}>
              <div className="flex items-baseline justify-between text-xs font-medium text-slate-700">
                <p>{metric.label}</p>
                <p className="text-sm font-semibold text-morpeth-navy">
                  {metric.value}
                  {maxValue <= 100 ? "%" : ""}
                </p>
              </div>
              <AnimatedBar value={widthPercent} barClassName={barClass} />
            </div>
          )
        })}
      </div>

      {graph.note && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{graph.note}</p>
      )}
    </article>
  )
}

export default function ResultsPage() {
  const [gcse, setGcse] = useState<GCSEResults | null>(null)
  const [sixthForm, setSixthForm] = useState<SixthFormResults | null>(null)
  const [gcseGraphs, setGcseGraphs] = useState<ResultGraph[]>([])
  const [sixthFormGraphs, setSixthFormGraphs] = useState<ResultGraph[]>([])

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await sanityClient.fetch<{
          gcse: GCSEResults | null
          sixth: SixthFormResults | null
        }>(
          `{
            "gcse": *[_type == "gcseResults"][0]{
              title,
              heroHeading,
              heroImage,
              intro,
              resultsHeading,
              resultsBullets,
              headlineMetrics[]{
                _key,
                label,
                value,
                max,
                colourClass
              },
              progressHeading,
              progressBody,
              proudHeading,
              proudBody,
              dfeLinkLabel,
              dfeLinkUrl,
              "breakdownGraphs": breakdownGraphs[]->{
                _id,
                title,
                subtitle,
                category,
                year,
                note,
                "metrics": metrics[]{
                  _key,
                  label,
                  value,
                  max,
                  colourClass
                }
              }
            },
            "sixth": *[_type == "sixthFormResults"][0]{
              title,
              heroHeading,
              heroImage,
              intro,
              destinationsHeading,
              destinationsBody,
              curriculumHeading,
              curriculumBody,
              aLevelHeadlineMetrics[]{
                _key,
                label,
                value,
                max,
                colourClass
              },
              btecHeadlineMetrics[]{
                _key,
                label,
                value,
                max,
                colourClass
              },
              btecSummary,
              dfeLinkLabel,
              dfeLinkUrl,
              "breakdownGraphs": breakdownGraphs[]->{
                _id,
                title,
                subtitle,
                category,
                year,
                note,
                "metrics": metrics[]{
                  _key,
                  label,
                  value,
                  max,
                  colourClass
                }
              }
            }
          }`
        )

        if (data?.gcse) {
          setGcse(data.gcse)
          setGcseGraphs(data.gcse.breakdownGraphs || [])
        }
        if (data?.sixth) {
          setSixthForm(data.sixth)
          setSixthFormGraphs(data.sixth.breakdownGraphs || [])
        }
      } catch (error) {
        console.error("Failed to load results content from Sanity", error)
      }
    }

    fetchResults()
  }, [])

  const gcseHeroSrc =
    gcse?.heroImage
      ? urlForImage(gcse.heroImage).width(1200).height(400).url()
      : "/images/ks4-celebrating-achievement.jpg"

  const sixthFormHeroSrc =
    sixthForm?.heroImage
      ? urlForImage(sixthForm.heroImage).width(1200).height(400).url()
      : "/images/ks5-sixth-form-celebrating-achievement.jpg"

  return (
    <main className="min-h-screen bg-morpeth-offwhite">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-slate-500">
          <Link href="/our-school" className="hover:underline">
            Our school
          </Link>
          <span className="mx-1">/</span>
          <span className="font-semibold text-slate-700">Results &amp; destinations</span>
        </nav>

        {/* Page header */}
        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
            Results &amp; destinations
          </p>
          <h1 className="mt-2 font-heading text-3xl text-morpeth-navy uppercase tracking-[0.14em] md:text-4xl">
            Ambition, support and outstanding outcomes
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
            Our students go on to sixth forms, apprenticeships and top universities across the
            country. This page showcases our latest GCSE and Sixth Form results alongside
            government performance measures and student destinations.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">
            Once the confirmed figures for each year are available, we publish headline
            percentages here and highlight destinations such as Russell Group universities,
            arts schools and high-quality apprenticeships.
          </p>
        </header>

        {/* Key Stage 4 overview */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:mt-10">
          <div className="overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={gcseHeroSrc}
              alt="Morpeth students celebrating their GCSE achievements"
              width={1200}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Left column: narrative and progress */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                {gcse?.title || "Key Stage 4"}
              </p>
              <h2 className="mt-1 font-heading text-lg uppercase tracking-[0.12em] text-morpeth-navy md:text-xl">
                {gcse?.heroHeading || "Celebrating achievement"}
              </h2>

              {gcse?.intro ? (
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                  <PortableText value={gcse.intro} />
                </div>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  At Morpeth, we are incredibly proud of our students and all that they have achieved. The smiling faces above
                  share just some of our success stories, showcasing young people who have consistently risen to challenges,
                  embraced opportunities and achieved outcomes that help prepare them for their futures.
                </p>
              )}

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {gcse?.progressHeading || "Progress"}
              </h3>
              {gcse?.progressBody ? (
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  <PortableText value={gcse.progressBody} />
                </div>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  For three consecutive years (2022, 2023 and 2024) students at Morpeth have made above average progress, with our
                  English GCSE and non-EBacc (Options) subjects progress scores ranking well above average. Progress data is not
                  yet available for 2025.
                </p>
              )}

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {gcse?.proudHeading || "Proud of every student"}
              </h3>
              {gcse?.proudBody ? (
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  <PortableText value={gcse.proudBody} />
                </div>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  We are proud of every student. These achievements reflect the talent, commitment and spirit of our students,
                  supported by a dedicated team of staff and families who share our belief that every young person can thrive.
                </p>
              )}
            </div>

            {/* Right column: stats, graph and link */}
            <div>
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {gcse?.resultsHeading || "Results across the board"}
              </h3>
              {gcse?.resultsBullets && gcse.resultsBullets.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
                  {gcse.resultsBullets.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
                  <li>• 69% of students achieved grade 4 or above in English and Maths</li>
                  <li>• 43% of students achieved grade 5 or above in English and Maths</li>
                  <li>• 58% of students were entered for the EBacc, achieving an average point score of 4.38</li>
                  <li>• 30% of students achieved three or more grade 7–9s in their GCSEs</li>
                </ul>
              )}

              {/* GCSE headline graph */}
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  GCSE headline results
                </p>
                <div className="mt-4 space-y-4">
                  {gcse?.headlineMetrics && gcse.headlineMetrics.length > 0 ? (
                    gcse.headlineMetrics.map((metric) => {
                      const width = Math.max(0, Math.min(100, metric.value))
                      const barClass =
                        metric.colourClass && metric.colourClass.trim().length > 0
                          ? metric.colourClass
                          : "bg-sky-600"

                      return (
                        <div key={metric._key || metric.label}>
                          <div className="flex items-baseline justify-between text-xs font-medium text-slate-700">
                            <p>{metric.label}</p>
                            <p className="text-sm font-semibold text-morpeth-navy">
                              {metric.value}
                              {metric.max && metric.max !== 100 ? "" : "%"}
                            </p>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-slate-200">
                            <div className={`h-2 rounded-full ${barClass}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <>
                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-slate-700">
                          <p>Grade 4+ in English &amp; Maths</p>
                          <p className="text-sm font-semibold text-morpeth-navy">69%</p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-200">
                          <div className="h-2 w-[69%] rounded-full bg-sky-600" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-slate-700">
                          <p>Grade 5+ in English &amp; Maths</p>
                          <p className="text-sm font-semibold text-morpeth-navy">43%</p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-200">
                          <div className="h-2 w-[43%] rounded-full bg-sky-400" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Find out more
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Follow the link below to view our Key Stage 4 performance on the Department for Education (DfE) School and
                College Performance Measures website.
              </p>
              {gcse?.dfeLinkUrl && (
                <a
                  href={gcse.dfeLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  {gcse.dfeLinkLabel || "View Key Stage 4 performance"}
                </a>
              )}
            </div>
          </div>
          {/* Additional detailed GCSE graphs */}
          {gcseGraphs.length > 0 && (
            <div className="mt-8 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 md:p-6">
              <header className="mb-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                    More detail
                  </p>
                  <h2 className="mt-1 font-heading text-base uppercase tracking-[0.12em] text-morpeth-navy md:text-lg">
                    GCSE results breakdown
                  </h2>
                </div>
              </header>

              <div className="grid gap-6 md:grid-cols-2">
                {gcseGraphs.map((graph) => (
                  <ResultsGraphCard key={graph._id} graph={graph} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Sixth Form / Key Stage 5 */}
        <section className="mt-8 rounded-3xl bg-morpeth-navy p-6 text-white shadow-sm ring-1 ring-morpeth-navy/40 md:mt-10">
          {/* KS5 hero image */}
          <div className="overflow-hidden rounded-2xl bg-slate-900/40">
            <Image
              src={sixthFormHeroSrc}
              alt="Morpeth Sixth Form students celebrating their results"
              width={1200}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Left column: narrative and destinations */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-morpeth-light">
                {sixthForm?.title || "Key Stage 5"}
              </p>
              <h2 className="mt-1 font-heading text-lg uppercase tracking-[0.12em] text-white md:text-xl">
                {sixthForm?.heroHeading || "Morpeth Sixth Form"}
              </h2>

              {sixthForm?.intro ? (
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-morpeth-light">
                  <PortableText value={sixthForm.intro} />
                </div>
              ) : (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-morpeth-light">
                    At Morpeth Sixth Form, we take great pride in the achievements of our students and the
                    determination they have shown throughout their studies. The joy and celebration captured
                    on results day reflect just a few of their inspiring success stories.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-morpeth-light">
                    Our students have consistently met challenges with resilience, made the most of every
                    opportunity and achieved excellent results that set them up for bright futures. This year
                    we are very proud of the 143 students who have progressed on to a wide range of exciting
                    destinations.
                  </p>
                </>
              )}

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light/90">
                {sixthForm?.destinationsHeading || "Destinations"}
              </h3>
              {sixthForm?.destinationsBody ? (
                <div className="mt-2 text-sm leading-relaxed text-morpeth-light">
                  <PortableText value={sixthForm.destinationsBody} />
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-morpeth-light">
                    Recent destinations include universities such as Newcastle, Exeter, York and Glasgow, as
                    well as top London institutions including UCL and Queen Mary University of London. Many
                    students also progress to specialist institutions, vocational routes and high-quality
                    apprenticeships.
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-morpeth-light/90">
                    A full list of Key Stage 5 destinations can be shared here once finalised.
                  </p>
                </>
              )}
            </div>

            {/* Right column: curriculum, A level & BTEC results */}
            <div>
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light/90">
                {sixthForm?.curriculumHeading || "A broad and inclusive curriculum"}
              </h3>
              {sixthForm?.curriculumBody ? (
                <div className="mt-2 text-sm leading-relaxed text-morpeth-light">
                  <PortableText value={sixthForm.curriculumBody} />
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-morpeth-light">
                    We offer a rich, broad and balanced Level 3 curriculum. In 2025, 159 students were
                    entered for 21 different A level courses and three BTECs. Our Sixth Form is highly
                    inclusive: around 48% of students have been entitled to free school meals at some point
                    and 19 students had additional SEN needs.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-morpeth-light">
                    Retention is a real strength: over 95% of students complete their courses with us, well
                    above local and national averages.
                  </p>
                </>
              )}

              {/* A level headline results graph */}
              <div className="mt-4 rounded-2xl bg-morpeth-light/10 p-4 ring-1 ring-morpeth-light/20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-morpeth-light">
                  A level results (headline)
                </p>
                <div className="mt-4 space-y-4">
                  {sixthForm?.aLevelHeadlineMetrics && sixthForm.aLevelHeadlineMetrics.length > 0 ? (
                    sixthForm.aLevelHeadlineMetrics.map((metric) => {
                      const width = Math.max(0, Math.min(100, metric.value))
                      const barClass =
                        metric.colourClass && metric.colourClass.trim().length > 0
                          ? metric.colourClass
                          : "bg-sky-300"

                      return (
                        <div key={metric._key || metric.label}>
                          <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                            <p>{metric.label}</p>
                            <p className="text-sm font-semibold text-white">
                              {metric.value}
                              {metric.max && metric.max !== 100 ? "" : "%"}
                            </p>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-morpeth-light/30">
                            <div className={`h-2 rounded-full ${barClass}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <>
                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>Students with all A*–A grades</p>
                          <p className="text-sm font-semibold text-white">12%</p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-[12%] rounded-full bg-emerald-300" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>Students achieving A*–B overall</p>
                          <p className="text-sm font-semibold text-white">32%</p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-[32%] rounded-full bg-sky-300" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>Students achieving A*–C overall</p>
                          <p className="text-sm font-semibold text-white">63%</p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-[63%] rounded-full bg-indigo-300" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>Overall pass rate</p>
                          <p className="text-sm font-semibold text-white">100%</p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-full rounded-full bg-white/85" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* BTEC headline results graph */}
              <div className="mt-4 rounded-2xl bg-morpeth-light/10 p-4 ring-1 ring-morpeth-light/20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-morpeth-light">
                  BTEC Level 3 results
                </p>
                <p className="mt-2 text-xs leading-relaxed text-morpeth-light/90">
                  Across Business Studies and Health &amp; Social Care, 2025 results were again
                  outstanding:
                </p>
                <div className="mt-3 space-y-3">
                  {sixthForm?.btecHeadlineMetrics && sixthForm.btecHeadlineMetrics.length > 0 ? (
                    sixthForm.btecHeadlineMetrics.map((metric) => {
                      const width = Math.max(0, Math.min(100, metric.value))
                      const barClass =
                        metric.colourClass && metric.colourClass.trim().length > 0
                          ? metric.colourClass
                          : "bg-amber-400"

                      return (
                        <div key={metric._key || metric.label}>
                          <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                            <p>{metric.label}</p>
                            <p className="text-sm font-semibold text-white">
                              {metric.value}
                              {metric.max && metric.max !== 100 ? "" : "%"}
                            </p>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-morpeth-light/30">
                            <div className={`h-2 rounded-full ${barClass}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <>
                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>D* grades</p>
                          <p className="text-sm font-semibold text-white">13%</p>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-[13%] rounded-full bg-amber-300" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>D*–D</p>
                          <p className="text-sm font-semibold text-white">72.4%</p>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-[72.4%] rounded-full bg-amber-400" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>D*–M</p>
                          <p className="text-sm font-semibold text-white">89.4%</p>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-[89.4%] rounded-full bg-emerald-400" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-xs font-medium text-morpeth-light">
                          <p>D*–P</p>
                          <p className="text-sm font-semibold text-white">95.1%</p>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-morpeth-light/30">
                          <div className="h-2 w-[95.1%] rounded-full bg-sky-400" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {sixthForm?.btecSummary ? (
                  <div className="mt-3 text-xs leading-relaxed text-morpeth-light/90">
                    <PortableText value={sixthForm.btecSummary} />
                  </div>
                ) : (
                  <p className="mt-3 text-xs leading-relaxed text-morpeth-light/90">
                    Average Point Score: 32.40 (overall grade: Distinction).
                  </p>
                )}
              </div>

              {/* KS5 DfE link */}
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light/90">
                Key Stage 5 DfE performance tables
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-morpeth-light/90">
                Use the link below to view our Key Stage 5 performance on the DfE School and College
                Performance Measures website, or to search for performance information on other schools
                and colleges.
              </p>
              {sixthForm?.dfeLinkUrl && (
                <a
                  href={sixthForm.dfeLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-full border border-morpeth-light/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light hover:bg-morpeth-light/10"
                >
                  {sixthForm.dfeLinkLabel || "View KS5 performance on DfE"}
                </a>
              )}
            </div>
          </div>

          {/* Additional detailed Sixth Form graphs */}
          {sixthFormGraphs.length > 0 && (
            <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-slate-900 ring-1 ring-slate-100 md:p-6">
              <header className="mb-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                    More detail
                  </p>
                  <h2 className="mt-1 font-heading text-base uppercase tracking-[0.12em] text-morpeth-navy md:text-lg">
                    Sixth Form results breakdown
                  </h2>
                </div>
              </header>

              <div className="grid gap-6 md:grid-cols-2">
                {sixthFormGraphs.map((graph) => (
                  <ResultsGraphCard key={graph._id} graph={graph} />
                ))}
              </div>
            </div>
          )}
        </section>



        {/* Back link / small print */}
        <footer className="mt-10 flex items-center justify-between gap-4 text-xs text-slate-500">
          <Link href="/our-school" className="rounded-full border border-slate-300 px-4 py-2 font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100">
            ← Back to Our School
          </Link>
          <p className="text-right">
            For full performance tables, please refer to the{" "}
            <a
              href="https://www.gov.uk/school-performance-tables"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:underline"
            >
              Department for Education performance website
            </a>
            .
          </p>
        </footer>
      </section>
    </main>
  )
}