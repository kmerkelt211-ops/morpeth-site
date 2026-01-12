'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import client from '../../sanity/lib/client'

// NOTE: Apply the "EXHIBITIONS" font in globals.css as:
// .font-exhibitions { font-family: var(--font-exhibitions), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
// Then any element with className="font-exhibitions" will use that display font.

export default function GalleryPage() {
  type GalleryExhibition = {
    _id: string
    title: string
    subtitle?: string
    description?: string
    slug?: { current: string }
    locationType?: 'portman' | 'aroundSchool' | 'external' | 'digital'
    exhibitorType?: 'student' | 'staffVisiting' | 'other'
    isCurrent?: boolean
    startDate?: string
    endDate?: string
    bgColor?: string
    heroImageUrl?: string | null
    galleryImageUrls?: string[] | null
    guidePdfUrl?: string | null
  }

  const [exhibitions, setExhibitions] = useState<GalleryExhibition[]>([])
  const [activeExhibitionIndex, setActiveExhibitionIndex] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const autoAdvanceRef = useRef<number | null>(null)

  useEffect(() => {
    const query = `
      *[_type == "galleryExhibition"] | order(orderRank asc, startDate desc) {
        _id,
        title,
        subtitle,
        description,
        slug,
        locationType,
        exhibitorType,
        isCurrent,
        startDate,
        endDate,
        bgColor,
        "heroImageUrl": heroImages[0].asset->url,
        "galleryImageUrls": galleryImages[].asset->url,
        "guidePdfUrl": guidePdf.asset->url
      }
    `
    client
      .fetch<GalleryExhibition[]>(query)
      .then((data) => {
        const rows = data || []
        setExhibitions(rows)
        setActiveExhibitionIndex(0)

        const addSizeParams = (url: string) =>
          url.includes('?') ? `${url}&w=1200&auto=format` : `${url}?w=1200&auto=format`

        // Prefer any galleryImages across all exhibitions for the hero photo.
        const allGalleryImages = rows
          .flatMap((ex) => ex.galleryImageUrls || [])
          .filter((url): url is string => !!url)
          .map(addSizeParams)

        const allHeroImages = rows
          .map((ex) => ex.heroImageUrl)
          .filter((url): url is string => !!url)
          .map(addSizeParams)

        const pool = allGalleryImages.length > 0 ? allGalleryImages : allHeroImages

        if (pool.length > 0) {
          const randomIndex = Math.floor(Math.random() * pool.length)
          setHeroImageUrl(pool[randomIndex])
        } else {
          setHeroImageUrl(null)
        }
      })
      .catch((err) => {
        console.error('Error fetching gallery exhibitions', err)
      })
  }, [])

  // Prefer *digital-only* current exhibitions in the blue strip.
  // If there are none, fall back to any exhibition marked as current.
  const currentDigitalExhibitions = exhibitions.filter(
    (ex) => ex.isCurrent && ex.locationType === 'digital'
  )

  const currentFallbackExhibitions = exhibitions.filter((ex) => ex.isCurrent)

  const currentExhibitions = (currentDigitalExhibitions.length
    ? currentDigitalExhibitions
    : currentFallbackExhibitions
  ).slice(0, 3)

  // True when the strip is currently showing *digital-only* exhibitions
  const isDigitalStrip = currentDigitalExhibitions.length > 0

  const activeExhibition =
    currentExhibitions.length > 0
      ? currentExhibitions[Math.min(activeExhibitionIndex, currentExhibitions.length - 1)]
      : undefined

  useEffect(() => {
    // Auto-advance the "current exhibitions" strip
    if (isCarouselPaused) return
    if (currentExhibitions.length <= 1) return

    // Clear any existing timer
    if (autoAdvanceRef.current) {
      window.clearInterval(autoAdvanceRef.current)
      autoAdvanceRef.current = null
    }

    autoAdvanceRef.current = window.setInterval(() => {
      setActiveExhibitionIndex((prev) =>
        prev === currentExhibitions.length - 1 ? 0 : prev + 1
      )
    }, 7000)

    return () => {
      if (autoAdvanceRef.current) {
        window.clearInterval(autoAdvanceRef.current)
        autoAdvanceRef.current = null
      }
    }
  }, [isCarouselPaused, currentExhibitions.length])

  // WHAT'S ON: only *real-world* exhibitions (no digital-only),
  // newest first
  const whatsOnExhibitions = exhibitions
    .filter((ex) => ex.locationType !== 'digital')
    .sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
      const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
      return bDate - aDate
    })

  const goToPrevious = () => {
    setActiveExhibitionIndex((prev) =>
      prev === 0 ? currentExhibitions.length - 1 : prev - 1
    )
    setIsCarouselPaused(true)
    window.setTimeout(() => setIsCarouselPaused(false), 9000)
  }

  const goToNext = () => {
    setActiveExhibitionIndex((prev) =>
      prev === currentExhibitions.length - 1 ? 0 : prev + 1
    )
    setIsCarouselPaused(true)
    window.setTimeout(() => setIsCarouselPaused(false), 9000)
  }
  return (
    <main className="bg-white text-neutral-900">
      {/* HERO (Tate-style split) */}
      <section className="px-6 pt-10 md:px-12 lg:px-20">
        <div className="grid overflow-hidden border border-neutral-200 md:grid-cols-2">
          {/* Image (left) */}
          <div className="relative min-h-[320px] bg-neutral-100 md:min-h-[560px]">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt="Installation view of work in the Portman Gallery at Morpeth School"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-200" />
            )}
          </div>

          {/* Text panel (right) */}
          <div className="flex flex-col justify-between bg-black px-8 py-10 text-white md:px-12 md:py-14">
            <div>
              <p className="font-exhibitions text-xs tracking-[0.4em] text-white/70">
                PORTMAN GALLERY
              </p>

              <h1 className="font-exhibitions mt-6 text-4xl font-normal leading-tight tracking-[0.12em] md:text-6xl">
                EXHIBITIONS
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                A working gallery space at Morpeth School, showcasing art and photography from
                students, staff and collaborators across the school year.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.26em] text-white/80">
                <span className="font-exhibitions inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                  KS3 &ndash; KS5
                </span>
                <span className="font-exhibitions inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                  Art &amp; Photography
                </span>
                <span className="font-exhibitions inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                  Portman Gallery
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/gallery/student"
                className="font-exhibitions inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-xs uppercase tracking-[0.26em] text-black"
              >
                Explore student work <span aria-hidden>→</span>
              </Link>
              <Link
                href="/gallery/staff"
                className="font-exhibitions inline-flex items-center justify-center gap-2 border border-white/30 bg-transparent px-5 py-3 text-xs uppercase tracking-[0.26em] text-white"
              >
                Staff &amp; visiting <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT EXHIBITIONS STRIP (CAROUSEL) */}
      <section
        style={{ backgroundColor: activeExhibition?.bgColor || '#9EDFE6' }}
        className="mt-16 overflow-hidden border-y border-neutral-200 px-6 py-10 transition-colors duration-500 md:px-12 lg:px-20"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onFocusCapture={() => setIsCarouselPaused(true)}
        onBlurCapture={() => setIsCarouselPaused(false)}
      >
        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div>
            <p className="font-exhibitions text-xs tracking-[0.35em] text-neutral-800">
              CURRENT Digital-only EXHIBITIONS
            </p>
            {isDigitalStrip && (
              <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-neutral-700">
                
              </p>
            )}
            <h2 className="font-exhibitions mt-4 text-2xl font-normal tracking-[0.16em] md:text-3xl">
              {activeExhibition ? activeExhibition.title : 'No current exhibitions'}
            </h2>
            {activeExhibition && (
              <>
                {activeExhibition.subtitle && (
                  <p className="mt-2 text-sm text-neutral-900">
                    {activeExhibition.subtitle}
                  </p>
                )}
                {activeExhibition.description && (
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-900">
                    {activeExhibition.description}
                  </p>
                )}
              </>
            )}

            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              {activeExhibition?.slug?.current ? (
                <Link
                  href={`/gallery/${activeExhibition.slug.current}`}
                  className="font-exhibitions inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs uppercase tracking-[0.26em] text-white"
                >
                  View exhibition details
                  <span aria-hidden>→</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="font-exhibitions inline-flex cursor-not-allowed items-center justify-center gap-2 bg-black/40 px-5 py-3 text-xs uppercase tracking-[0.26em] text-white"
                >
                  View exhibition details
                  <span aria-hidden>→</span>
                </button>
              )}

              {activeExhibition?.guidePdfUrl ? (
                <a
                  href={activeExhibition.guidePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-exhibitions inline-flex items-center justify-center gap-2 border border-neutral-900 bg-white/20 px-5 py-3 text-xs uppercase tracking-[0.26em] text-neutral-900"
                >
                  Download exhibition guide
                </a>
              ) : (
                <button
                  disabled
                  className="font-exhibitions inline-flex cursor-not-allowed items-center justify-center gap-2 border border-neutral-900/40 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.26em] text-neutral-900/50"
                >
                  Download exhibition guide
                </button>
              )}
            </div>

            {/* Carousel controls: small, Tate-style indicators */}
            <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.26em] text-neutral-800">
              <button
                type="button"
                onClick={goToPrevious}
                className="font-exhibitions inline-flex items-center justify-center border border-neutral-900 bg-transparent px-3 py-2 text-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="font-exhibitions inline-flex items-center justify-center border border-neutral-900 bg-transparent px-3 py-2 text-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                Next →
              </button>

              <div className="ml-2 flex items-center gap-2">
                {currentExhibitions.map((exhibition, index) => (
                  <span
                    key={exhibition.title}
                    className={`h-1.5 w-6 rounded-full transition ${
                      index === activeExhibitionIndex
                        ? 'bg-neutral-900'
                        : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>

              <span className="ml-auto text-[10px] tracking-[0.26em]">
                {activeExhibitionIndex + 1} / {currentExhibitions.length}
              </span>
            </div>
          </div>

          <div className="relative">
            {/* Single halftone strip sitting behind the image pair – uses your halftone PNG */}
            <div className="pointer-events-none absolute -top-38 -bottom-58 right-[-38%] w-[165%] rotate-6 halftone-current-exhibitions" />
            <div className="relative z-10 grid gap-4 md:grid-cols-2">
              {activeExhibition && activeExhibition.heroImageUrl && (
                <div className="relative aspect-[4/3] bg-neutral-200 md:col-span-2">
                  <Image
                    src={activeExhibition.heroImageUrl}
                    alt={activeExhibition.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S ON GRID (TATE-STYLE CARDS) */}
      <section className="relative px-6 py-20 md:px-12 lg:px-20">
        {/* Soft halftone texture behind the section */}
        <div className="pointer-events-none absolute inset-0 halftone-soft opacity-35" />

        <div className="relative">
          <header className="mb-12 text-center md:text-left">
            <p className="font-exhibitions text-xs tracking-[0.35em] text-neutral-500">
              WHAT&apos;S ON
            </p>
            <p className="mt-3 max-w-xl text-sm text-neutral-700 md:text-base">
              Exhibitions, projects and events taking place around Morpeth School and in local
              galleries, including student work shown off site and collaborations with
              partner organisations. Updated throughout the school year.
            </p>
          </header>

          <div className="grid gap-10 md:grid-cols-3 items-stretch">
            {whatsOnExhibitions.map((item) => (
              <article key={item._id} className="flex flex-col h-full">
                <div className="relative aspect-[4/5] bg-neutral-100">
                  {item.heroImageUrl && (
                    <Image
                      src={item.heroImageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <p className="font-exhibitions text-[11px] tracking-[0.3em] text-neutral-500">
                    EXHIBITION
                  </p>
                  <h3 className="font-exhibitions mt-2 text-lg font-normal tracking-[0.12em]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-col gap-1 text-xs text-neutral-600">
                    {item.locationType && (
                      <p>
                        📍{' '}
                        {item.locationType === 'portman'
                          ? 'Portman Gallery'
                          : item.locationType === 'aroundSchool'
                          ? 'Around the school'
                          : item.locationType === 'external'
                          ? 'External gallery'
                          : 'Digital-only'}
                      </p>
                    )}
                    {item.endDate && (
                      <p>📅 Until {new Date(item.endDate).toLocaleDateString('en-GB')}</p>
                    )}
                  </div>
                  <div className="mt-auto pt-4">
                    {item.slug?.current ? (
                      <Link
                        href={`/gallery/${item.slug.current}`}
                        className="font-exhibitions inline-flex w-full items-center justify-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
                      >
                        View details
                        <span aria-hidden>→</span>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="font-exhibitions inline-flex w-full cursor-not-allowed items-center justify-center gap-2 border border-neutral-900/40 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900/50"
                      >
                        View details
                        <span aria-hidden>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COLOUR BLOCKS / MEMBERSHIP-STYLE PROMOS */}
      <section className="bg-neutral-50 px-6 py-20 md:px-12 lg:px-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col justify-between bg-[#8CC1B2] px-8 py-10 text-white">
            <div>
              <p className="font-exhibitions text-xs tracking-[0.36em]">
                PORTMAN GALLERY
              </p>
              <h2 className="font-exhibitions mt-4 text-2xl font-normal tracking-[0.16em]">
                A WORLD OF STUDENT ART
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed">
                Regular shows of work from across Morpeth School. Bring families, friends or
                collaborators to see what students are making.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <Link
                href="/gallery/about"
                className="font-exhibitions inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-xs uppercase tracking-[0.26em] text-neutral-900"
              >
                About the gallery
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-rows-2">
            <div className="flex flex-col justify-between bg-[#E89AB5] px-8 py-8 text-white">
              <div>
                <p className="font-exhibitions text-xs tracking-[0.36em]">
                  AFTER-SCHOOL
                </p>
                <h3 className="font-exhibitions mt-3 text-lg font-normal tracking-[0.14em]">
                  Clubs &amp; studios
                </h3>
                <p className="mt-3 text-sm leading-relaxed">
                  Life drawing, darkroom sessions and portfolio support run throughout the week.
                </p>
              </div>
              <Link
                href="/gallery/clubs"
                className="font-exhibitions mt-4 inline-flex w-fit items-center justify-center gap-2 bg-black px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-white"
              >
                Explore clubs
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="flex flex-col justify-between bg-neutral-900 px-8 py-8 text-white">
              <div>
                <p className="font-exhibitions text-xs tracking-[0.36em] text-neutral-300">
                  SIXTH FORM
                </p>
                <h3 className="font-exhibitions mt-3 text-lg font-normal tracking-[0.14em]">
                  Art &amp; Photography
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-200">
                  A level students exhibit every year in the Portman Gallery, building portfolios
                  for art school, apprenticeships and creative careers.
                </p>
              </div>
              <Link
                href="/sixth-form"
                className="font-exhibitions mt-4 inline-flex w-fit items-center justify-center gap-2 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
              >
                Sixth Form information
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INFO / SUPPORT */}
      <section className="relative border-t border-neutral-200 bg-[#9EDFE6] px-6 py-20 md:px-12 lg:px-20">
        {/* Soft halftone band behind heading */}
        <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-32 max-w-3xl halftone-soft opacity-35" />
        <div className="mx-auto max-w-5xl">
          <h2 className="font-exhibitions text-center text-4xl font-normal leading-tight tracking-[0.12em] text-neutral-900 md:text-6xl">
            SUPPORT THE GALLERY
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-neutral-700">
            The Portman Gallery is Morpeth School&apos;s dedicated exhibition space. Shows change
            throughout the year and are open to students, families and visitors by arrangement.
            For visit enquiries, or to find out how you can support our programme, please contact
            the school office or the Art &amp; Photography department.
          </p>

          <div className="mt-12 grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Text band (left) */}
            <div className="flex flex-col justify-between px-8 py-10 text-neutral-900 md:px-10 md:py-12">
              <div>
                <p className="font-exhibitions text-xs tracking-[0.36em] text-neutral-800">
                  SUPPORT
                </p>
                <h3 className="font-exhibitions mt-4 text-2xl font-normal tracking-[0.16em]">
                  Help the Portman Gallery grow
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-800">
                  Sales of books and prints, donations and partnerships help us fund new shows,
                  commission projects and provide opportunities for young people at Morpeth.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                <button className="font-exhibitions inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs uppercase tracking-[0.26em] text-white">
                  Get in touch
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>

            {/* Image band (right) */}
            <div className="relative min-h-[260px] md:min-h-[320px]">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="Installation view in the Portman Gallery at Morpeth School"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-200" />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}