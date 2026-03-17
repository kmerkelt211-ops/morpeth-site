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
  preload?: "none" | "metadata" | "auto";
  fadeInDelayMs?: number;
  disableVideoOnMobile?: boolean;
  disableVideoOnConstrainedNetwork?: boolean;
};

const DEFAULT_HERO_OVERLAY =
  "pointer-events-none bg-gradient-to-b from-black/55 via-morpeth-navy/65 to-morpeth-navy/85";
const DEFAULT_HERO_BASE_BG =
  "bg-gradient-to-r from-morpeth-navy via-[#12355b] to-[#3b6fb6]";

type HeroRemoteConfig = {
  src: string | null;
  webmSrc: string | null;
  imageSrc: string | null;
  imageAlt: string | null;
  preferImage: boolean;
};

const EMPTY_HERO_REMOTE_CONFIG: HeroRemoteConfig = {
  src: null,
  webmSrc: null,
  imageSrc: null,
  imageAlt: null,
  preferImage: false,
};

const heroConfigCache = new Map<string, HeroRemoteConfig>();

type ConnectionInfo = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

export default function HeroVideo({
  src,
  webmSrc,
  pageKey,
  overlayClassName,
  containerClassName = "",
  videoClassName = "",
  preload = "auto",
  fadeInDelayMs = 120,
  disableVideoOnMobile = true,
  disableVideoOnConstrainedNetwork = true,
}: HeroVideoProps) {
  const [forceLowBandwidth, setForceLowBandwidth] = useState(false);
  const [remoteConfig, setRemoteConfig] = useState<HeroRemoteConfig>(() => {
    if (!pageKey) return EMPTY_HERO_REMOTE_CONFIG;
    return heroConfigCache.get(pageKey) ?? EMPTY_HERO_REMOTE_CONFIG;
  });
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const overlay = overlayClassName ?? DEFAULT_HERO_OVERLAY;
  const resolvedSrc = remoteConfig.src || src;
  const resolvedWebmSrc = remoteConfig.webmSrc || webmSrc;
  const resolvedImageSrc = remoteConfig.imageSrc;
  const shouldPreferImage = remoteConfig.preferImage && Boolean(resolvedImageSrc);
  const shouldRenderVideo = canPlayVideo && Boolean(resolvedSrc) && !shouldPreferImage;
  const fadeTimerRef = useRef<number | null>(null);
  const queuedRevealRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyStoredPrefs = () => {
      const fromStorage = window.localStorage.getItem("morpeth_pref_low_bandwidth") === "1";
      const fromRoot = document.documentElement.dataset.lowBandwidth === "true";
      setForceLowBandwidth(fromStorage || fromRoot);
    };

    applyStoredPrefs();
    window.addEventListener("storage", applyStoredPrefs);
    window.addEventListener("morpeth:preferences-changed", applyStoredPrefs as EventListener);

    return () => {
      window.removeEventListener("storage", applyStoredPrefs);
      window.removeEventListener("morpeth:preferences-changed", applyStoredPrefs as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedDataQuery = window.matchMedia("(prefers-reduced-data: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const nav = navigator as Navigator & { connection?: ConnectionInfo };
    const connection = nav.connection;

    const updateVideoPolicy = () => {
      const shouldSkipOnMobile = disableVideoOnMobile && mobileQuery.matches;
      const shouldSkipForPreference =
        reducedMotionQuery.matches || reducedDataQuery.matches;
      const shouldSkipForConnection =
        Boolean(connection?.saveData) ||
        ["slow-2g", "2g", "3g"].includes(connection?.effectiveType || "");
      const constrained =
        disableVideoOnConstrainedNetwork &&
        (shouldSkipForPreference || shouldSkipForConnection);
      const shouldSkipForLowBandwidth = forceLowBandwidth;
      if (shouldSkipOnMobile || constrained || shouldSkipForLowBandwidth) {
        queuedRevealRef.current = false;
        if (fadeTimerRef.current !== null) {
          window.clearTimeout(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
      }
      setCanPlayVideo(!(shouldSkipOnMobile || constrained || shouldSkipForLowBandwidth));
    };

    const addMqlListener = (mql: MediaQueryList, listener: () => void) => {
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", listener);
        return;
      }
      mql.addListener(listener);
    };
    const removeMqlListener = (mql: MediaQueryList, listener: () => void) => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", listener);
        return;
      }
      mql.removeListener(listener);
    };

    updateVideoPolicy();
    addMqlListener(reducedMotionQuery, updateVideoPolicy);
    addMqlListener(reducedDataQuery, updateVideoPolicy);
    addMqlListener(mobileQuery, updateVideoPolicy);
    connection?.addEventListener?.("change", updateVideoPolicy);

    return () => {
      removeMqlListener(reducedMotionQuery, updateVideoPolicy);
      removeMqlListener(reducedDataQuery, updateVideoPolicy);
      removeMqlListener(mobileQuery, updateVideoPolicy);
      connection?.removeEventListener?.("change", updateVideoPolicy);
    };
  }, [disableVideoOnConstrainedNetwork, disableVideoOnMobile, forceLowBandwidth]);

  useEffect(() => {
    if (!pageKey) return;

    if (heroConfigCache.has(pageKey)) return;

    let active = true;
    fetch(`/api/hero-video?page=${pageKey}`, { cache: "force-cache" })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data:
        | {
            src?: string | null;
            webmSrc?: string | null;
            imageSrc?: string | null;
            imageAlt?: string | null;
            preferImage?: boolean;
          }
        | null) => {
        if (!active) return;
        const nextConfig: HeroRemoteConfig = {
          src:
            typeof data?.src === "string" && data.src.trim()
              ? data.src
              : null,
          webmSrc:
            typeof data?.webmSrc === "string" && data.webmSrc.trim()
              ? data.webmSrc
              : null,
          imageSrc:
            typeof data?.imageSrc === "string" && data.imageSrc.trim()
              ? data.imageSrc
              : null,
          imageAlt:
            typeof data?.imageAlt === "string" && data.imageAlt.trim()
              ? data.imageAlt
              : null,
          preferImage: Boolean(data?.preferImage),
        };
        heroConfigCache.set(pageKey, nextConfig);
        setRemoteConfig(nextConfig);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [pageKey]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (shouldRenderVideo) return;
    queuedRevealRef.current = false;
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    const id = window.requestAnimationFrame(() => setVideoVisible(false));
    return () => window.cancelAnimationFrame(id);
  }, [shouldRenderVideo]);

  const queueVideoReveal = () => {
    if (queuedRevealRef.current) return;
    queuedRevealRef.current = true;

    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
    }

    const revealDelay = Math.max(0, fadeInDelayMs);
    if (revealDelay === 0) {
      fadeTimerRef.current = null;
      window.requestAnimationFrame(() => setVideoVisible(true));
      return;
    }

    fadeTimerRef.current = window.setTimeout(() => setVideoVisible(true), revealDelay);
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

      {resolvedImageSrc && !shouldRenderVideo ? (
        <Image
          src={resolvedImageSrc}
          alt={remoteConfig.imageAlt || ""}
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
      ) : null}

      {shouldRenderVideo ? (
        <video
          data-ornamental-video="true"
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
      ) : null}

      {overlay ? (
        <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
      ) : null}
    </div>
  );
}
