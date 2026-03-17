"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { DEFAULT_RECRUITMENT_MEDIA, type RecruitmentMedia } from "../../../lib/siteMediaLoaders"

type RecruitmentVideoCardProps = {
  initialRecruitmentMedia?: RecruitmentMedia | null
}

export default function RecruitmentVideoCard({
  initialRecruitmentMedia,
}: RecruitmentVideoCardProps) {
  const [isRecruitmentVideoOpen, setIsRecruitmentVideoOpen] = useState(false)
  const [recruitmentVideoError, setRecruitmentVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const recruitmentMedia = initialRecruitmentMedia ?? DEFAULT_RECRUITMENT_MEDIA

  useEffect(() => {
    if (!isRecruitmentVideoOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setRecruitmentVideoError(false)
        setIsRecruitmentVideoOpen(false)
        return
      }

      const videoElement = videoRef.current
      if (!videoElement) return
      if (event.altKey || event.metaKey || event.ctrlKey) return

      switch (event.key) {
        case " ":
        case "Spacebar":
          event.preventDefault()
          if (videoElement.paused) {
            videoElement.play()
          } else {
            videoElement.pause()
          }
          break
        case "ArrowRight":
          event.preventDefault()
          videoElement.currentTime += 5
          break
        case "ArrowLeft":
          event.preventDefault()
          videoElement.currentTime = Math.max(videoElement.currentTime - 5, 0)
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRecruitmentVideoOpen])

  const recruitmentPoster = recruitmentMedia.posterSrc || "/images/welcome.webp"
  const recruitmentPreviewSrc = recruitmentMedia.loopSrc || recruitmentMedia.videoSrc || null
  const recruitmentVideoSrc = recruitmentMedia.videoSrc || null

  return (
    <>
      <article className="group relative overflow-hidden rounded-3xl bg-white p-5 md:p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:col-span-2">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">Year 5 student recruitment film</h3>
        <p className="mt-2 text-xs text-slate-600">For Year 5 families starting secondary in September 2026.</p>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              if (!recruitmentVideoSrc) return
              setRecruitmentVideoError(false)
              setIsRecruitmentVideoOpen(true)
            }}
            className="group relative aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label={recruitmentVideoSrc ? "Watch the Year 5 film" : "Year 5 film currently unavailable"}
            disabled={!recruitmentVideoSrc}
          >
            {recruitmentPreviewSrc ? (
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={recruitmentPoster}
                src={recruitmentPreviewSrc}
                aria-hidden="true"
              />
            ) : (
              <Image
                src={recruitmentPoster}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                aria-hidden="true"
              />
            )}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex items-center gap-3 rounded-full bg-black/70 px-4 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-slate-900">
                    <path d="M9 7l7 5-7 5V7z" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {recruitmentVideoSrc ? "Watch the Year 5 film" : "Film unavailable"}
                </span>
              </div>
            </div>
          </button>
        </div>
      </article>

      {isRecruitmentVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Year 5 recruitment film"
          onClick={() => {
            setRecruitmentVideoError(false)
            setIsRecruitmentVideoOpen(false)
          }}
        >
          <div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setRecruitmentVideoError(false)
                setIsRecruitmentVideoOpen(false)
              }}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-md hover:bg-white"
            >
              Close
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              {recruitmentVideoSrc && !recruitmentVideoError ? (
                <video
                  ref={videoRef}
                  src={recruitmentVideoSrc}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  preload="metadata"
                  playsInline
                  poster={recruitmentPoster}
                  onError={() => setRecruitmentVideoError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-white/85">
                  This film is currently unavailable. Please check Site settings in Sanity and set
                  <span className="mx-1 font-semibold">Year 5 film (URL/upload)</span>.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
