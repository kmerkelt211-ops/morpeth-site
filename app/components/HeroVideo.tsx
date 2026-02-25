"use client";

import Image from "next/image";
import { useState } from "react";

type HeroVideoProps = {
  src: string;
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

export default function HeroVideo({
  src,
  overlayClassName,
  containerClassName = "",
  videoClassName = "",
  posterSrc,
  posterAlt = "",
  preload = "metadata",
  priorityPoster = false,
}: HeroVideoProps) {
  const [videoReady, setVideoReady] = useState(!posterSrc);
  const [videoFailed, setVideoFailed] = useState(false);
  const overlay = overlayClassName ?? DEFAULT_HERO_OVERLAY;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-morpeth-navy ${containerClassName}`}>
      {posterSrc && (
        <Image
          src={posterSrc}
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

      {!videoFailed && (
        <video
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
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {overlay ? (
        <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
      ) : null}
    </div>
  );
}
