"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
};

const DEFAULT_HERO_OVERLAY =
  "pointer-events-none bg-gradient-to-b from-black/55 via-morpeth-navy/65 to-morpeth-navy/85";
const DEFAULT_HERO_POSTER = "/images/morpeth-old-0.jpg";
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
}: HeroVideoProps) {
  const effectivePosterSrc = posterSrc ?? DEFAULT_HERO_POSTER;
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
  const [videoReady, setVideoReady] = useState(!effectivePosterSrc);
  const overlay = overlayClassName ?? DEFAULT_HERO_OVERLAY;
  const resolvedSrc = remoteSrc || src;
  const resolvedWebmSrc = remoteWebmSrc || webmSrc;

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

  return (
    <div className={`absolute inset-0 overflow-hidden bg-morpeth-navy ${containerClassName}`}>
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
        key={resolvedSrc}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          videoReady || !posterSrc ? "opacity-100" : "opacity-0"
        } ${videoClassName}`}
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
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
