"use client"

import { useEffect, useRef } from "react"

const VALUES = [
  {
    title: "Committed to learning & achievement",
    desc: "High expectations for every pupil, great teaching and an ambitious curriculum that opens doors.",
  },
  {
    title: "Based on friendship & respect",
    desc: "Positive relationships between pupils and staff are the foundations for great learning.",
  },
  {
    title: "Everyone is valued",
    desc: "An inclusive community that celebrates diversity and supports every child to thrive.",
  },
]

const LOOPING_VALUES = [...VALUES, ...VALUES, ...VALUES]

export function ValuesCarousel() {
  const valuesTrackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = valuesTrackRef.current
    if (!el) return

    const syncToMiddle = () => {
      const third = el.scrollWidth / 3
      if (third > 0) el.scrollLeft = third
    }

    syncToMiddle()

    const onScroll = () => {
      const third = el.scrollWidth / 3
      if (!third) return

      if (el.scrollLeft < third * 0.5) {
        el.scrollLeft += third
      } else if (el.scrollLeft > third * 1.5) {
        el.scrollLeft -= third
      }
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", syncToMiddle)

    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", syncToMiddle)
    }
  }, [])

  return (
    <div className="sm:hidden">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Our values</p>
        <p className="text-[11px] font-medium text-slate-500">Swipe -&gt;</p>
      </div>

      <div
        ref={valuesTrackRef}
        className="relative -mx-4 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory scroll-px-4"
        aria-label="Morpeth values carousel"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-morpeth-offwhite to-transparent" />

        <div className="flex gap-4">
          {LOOPING_VALUES.map(({ title, desc }, idx) => (
            <div
              key={`${title}-${idx}`}
              className="group relative min-w-[82vw] max-w-[22rem] flex-shrink-0 snap-start overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm transition"
            >
              <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-sky-50 blur-2xl" />
              <div className="relative p-5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600/10 text-sky-700 ring-1 ring-sky-200">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3l2.7 5.5L21 10l-4.5 3.2L17.4 19 12 16.2 6.6 19l.9-5.8L3 10l6.3-1.5L12 3Z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ValuesGrid() {
  return (
    <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {VALUES.map(({ title, desc }) => (
        <div
          key={title}
          className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-sky-50 blur-2xl" />
          <div className="relative p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600/10 text-sky-700 ring-1 ring-sky-200">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l2.7 5.5L21 10l-4.5 3.2L17.4 19 12 16.2 6.6 19l.9-5.8L3 10l6.3-1.5L12 3Z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
