"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const RESULTS_TABS = ["Results", "Exams", "Prospectus", "Pupil Premium", "Ofsted", "Policies"]

export default function ResultsDeck() {
  const [resultsDeckIndex, setResultsDeckIndex] = useState(0)
  const resultsDeckRef = useRef<HTMLDivElement | null>(null)
  const resultsTabsRef = useRef<HTMLDivElement | null>(null)
  const hasInitialResultsTabSync = useRef(false)

  useEffect(() => {
    const el = resultsTabsRef.current
    if (!el) return
    if (!hasInitialResultsTabSync.current) {
      hasInitialResultsTabSync.current = true
      return
    }

    const btn = el.querySelector<HTMLElement>(`[data-results-tab="${resultsDeckIndex}"]`)
    if (!btn) return

    try {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    } catch {
      // no-op
    }
  }, [resultsDeckIndex])

  return (
    <div className="md:hidden">
      <div ref={resultsTabsRef} className="-mx-4 overflow-x-auto px-4 no-scrollbar">
        <div className="flex gap-2">
          {RESULTS_TABS.map((label, i) => (
            <button
              key={label}
              type="button"
              data-results-tab={i}
              onClick={() => {
                setResultsDeckIndex(i)
                const el = resultsDeckRef.current
                if (!el) return
                const cards = el.querySelectorAll<HTMLElement>("[data-results-card]")
                const card = cards[i]
                if (card && typeof card.scrollIntoView === "function") {
                  try {
                    card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
                  } catch {
                    // no-op
                  }
                }
              }}
              className={
                "whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition " +
                (resultsDeckIndex === i
                  ? "border-morpeth-navy bg-morpeth-navy text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={resultsDeckRef}
        className="relative mt-4 -mx-4 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory scroll-px-4"
        onScroll={(e) => {
          const el = e.currentTarget
          const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-results-card]"))
          if (!cards.length) return
          let bestIdx = 0
          let bestDist = Number.POSITIVE_INFINITY
          for (let j = 0; j < cards.length; j += 1) {
            const dist = Math.abs(cards[j].offsetLeft - el.scrollLeft)
            if (dist < bestDist) {
              bestDist = dist
              bestIdx = j
            }
          }
          if (bestIdx !== resultsDeckIndex) setResultsDeckIndex(bestIdx)
        }}
        aria-label="Results and exams cards"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-morpeth-offwhite to-transparent" />
        <div className="flex gap-4">
          <article
            data-results-card
            className="relative w-[calc(100vw-2rem)] max-w-[28rem] flex-shrink-0 snap-start rounded-3xl bg-morpeth-navy p-6 text-white shadow-sm ring-1 ring-morpeth-navy/20"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-sky-500/25 blur-3xl" />
            <h3 className="relative text-sm font-semibold tracking-[0.18em] uppercase">Results &amp; destinations</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-morpeth-light">
              Headline GCSE and Sixth Form outcomes, progress measures and recent destinations including university,
              apprenticeships and employment.
            </p>
            <div className="relative mt-4 space-y-2 text-xs uppercase tracking-[0.16em] text-morpeth-light/80">
              <p>GCSE &bull; Sixth Form &bull; Progress 8 &bull; Destinations</p>
            </div>
            <Link
              href="/our-school/results"
              className="relative mt-6 inline-flex rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy"
            >
              View results &amp; destinations
            </Link>
          </article>

          <article
            data-results-card
            className="w-[calc(100vw-2rem)] max-w-[28rem] flex-shrink-0 snap-start rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm"
          >
            <h3 className="text-base font-semibold tracking-tight text-slate-900">Exams &amp; assessment</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Key information for students and families about exam timetables, revision support and how we manage
              assessments at Morpeth.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/our-school/exams"
                className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Exam information
              </Link>
              <a
                href="/our-school/exams"
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Assessment guidance
              </a>
            </div>
          </article>

          <article
            data-results-card
            className="w-[calc(100vw-2rem)] max-w-[28rem] flex-shrink-0 snap-start rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm"
          >
            <h3 className="text-base font-semibold tracking-tight text-slate-900">Prospectus</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Find out more about our wide curriculum and opportunities at Morpeth.
            </p>
            <a
              href="/Documents/prospectus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
            >
              Download prospectus
            </a>
          </article>

          <article
            data-results-card
            className="w-[calc(100vw-2rem)] max-w-[28rem] flex-shrink-0 snap-start rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm"
          >
            <h3 className="text-base font-semibold tracking-tight text-slate-900">Pupil Premium</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Pupil Premium funding supports improved outcomes for disadvantaged pupils. Read our current strategy.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/policies"
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Policy hub
              </a>
              <a
                href="/policies"
                className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Pupil Premium information
              </a>
            </div>
          </article>

          <article
            data-results-card
            className="w-[calc(100vw-2rem)] max-w-[28rem] flex-shrink-0 snap-start rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm"
          >
            <h3 className="text-base font-semibold tracking-tight text-slate-900">Ofsted</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Morpeth School has been judged to be <strong>Good</strong> in its last Ofsted inspection.
            </p>
            <a
              href="https://reports.ofsted.gov.uk/provider/23/100967"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
            >
              View full report
            </a>
          </article>

          <article
            data-results-card
            className="w-[calc(100vw-2rem)] max-w-[28rem] flex-shrink-0 snap-start rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm"
          >
            <h3 className="text-base font-semibold tracking-tight text-slate-900">Policies</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Read our statutory policies and documents, including safeguarding, behaviour and curriculum information.
            </p>
            <a
              href="/policies"
              className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
            >
              View policies
            </a>
          </article>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between px-1 text-xs text-slate-500">
        <span className="font-semibold text-slate-600">{resultsDeckIndex + 1} / 6</span>
        <span>Swipe or tap a tab</span>
      </div>
    </div>
  )
}
