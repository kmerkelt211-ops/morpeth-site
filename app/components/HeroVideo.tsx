"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroPageKey =
  | "home"
  | "ourSchool"
  | "teachingLearning"
  | "sixthForm"
  | "extracurricular"
  | "parents"
  | "staff";

type HeroVideoProps = {
  src: string;
  webmSrc?: string;
  pageKey?: HeroPageKey;
  overlayClassName?: string;
  containerClassName?: string;
  videoClassName?: string;
  posterSrc?: string;
  posterAlt?: string;
  preload?: "none" | "metadata" | "auto";
  priorityPoster?: boolean;
  fadeInDelayMs?: number;
};

const DEFAULT_HERO_OVERLAY =
  "pointer-events-none bg-gradient-to-b from-black/55 via-morpeth-navy/65 to-morpeth-navy/85";
const DEFAULT_HERO_BASE_BG =
  "bg-gradient-to-r from-morpeth-navy via-[#12355b] to-[#3b6fb6]";
const heroSrcCache = new Map<string, string>();
const heroWebmSrcCache = new Map<string, string>();

export default function HeroVideo({
  src,
  webmSrc,
  pageKey,
  overlayClassName,
  containerClassName = "",
  videoClassName = "",
  posterSrc,
  posterAlt = "",
  preload = "metadata",
  priorityPoster = false,
  fadeInDelayMs = 1800,
}: HeroVideoProps) {
  const effectivePosterSrc = posterSrc;
  const [remoteSrc, setRemoteSrc] = useState<string | null>(() => {
    if (!pageKey) return null;
    const cached = heroSrcCache.get(`${pageKey}:${src}`);
    return cached && cached !== src ? cached : null;
  });
  const [remoteWebmSrc, setRemoteWebmSrc] = useState<string | null>(() => {
    if (!pageKey) return null;
    const cached = heroWebmSrcCache.get(`${pageKey}:${src}`);
    return cached || null;
  });
  const [videoVisible, setVideoVisible] = useState(false);
  const overlay = overlayClassName ?? DEFAULT_HERO_OVERLAY;
  const resolvedSrc = remoteSrc || src;
  const resolvedWebmSrc = remoteWebmSrc || webmSrc;
  const fadeTimerRef = useRef<number | null>(null);
  const queuedRevealRef = useRef(false);

  useEffect(() => {
    if (!pageKey) return;

    const cacheKey = `${pageKey}:${src}`;
    if (heroSrcCache.has(cacheKey)) return;

    let active = true;
    fetch(`/api/hero-video?page=${pageKey}`, { cache: "no-store" })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data: { src?: string | null; webmSrc?: string | null } | null) => {
        if (!active) return;
        const remoteSrc =
          typeof data?.src === "string" && data.src.trim()
            ? data.src
            : src;
        const remoteWebmSrc =
          typeof data?.webmSrc === "string" && data.webmSrc.trim()
            ? data.webmSrc
            : "";
        heroSrcCache.set(cacheKey, remoteSrc);
        heroWebmSrcCache.set(cacheKey, remoteWebmSrc);
        if (remoteSrc !== src) {
          setRemoteSrc(remoteSrc);
        }
        if (remoteWebmSrc) {
          setRemoteWebmSrc(remoteWebmSrc);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [pageKey, src]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  const queueVideoReveal = () => {
    if (queuedRevealRef.current) return;
    queuedRevealRef.current = true;

    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
    }

    fadeTimerRef.current = window.setTimeout(
      () => setVideoVisible(true),
      Math.max(0, fadeInDelayMs)
    );
  };

  const resetVideoReveal = () => {
    queuedRevealRef.current = false;
    setVideoVisible(false);
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${DEFAULT_HERO_BASE_BG} ${containerClassName}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35"
        aria-hidden="true"
      />

      {effectivePosterSrc && (
        <Image
          src={effectivePosterSrc}
          alt={posterAlt}
          fill
          priority={priorityPoster}
          className={`object-cover transition-opacity duration-500 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
          sizes="100vw"
          aria-hidden="true"
        />
      )}

      <video
        key={`${resolvedWebmSrc || "no-webm"}|${resolvedSrc}`}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          videoVisible ? "opacity-100" : "opacity-0"
        } ${videoClassName}`}
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        onLoadStart={resetVideoReveal}
        onCanPlay={queueVideoReveal}
        onLoadedData={queueVideoReveal}
        onPlaying={queueVideoReveal}
        aria-hidden="true"
      >
        {resolvedWebmSrc ? (
          <source src={resolvedWebmSrc} type="video/webm" />
        ) : null}
        <source src={resolvedSrc} type="video/mp4" />
      </video>

      {overlay ? (
        <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
      ) : null}
    </div>
  );
}
