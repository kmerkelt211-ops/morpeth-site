export const runtime = "nodejs";
export const revalidate = 3600;

import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

type PulseSlide = {
  imageSrc?: string | null;
  alt?: string | null;
  caption?: string | null;
};

type PulseMediaSettings = {
  pulseMediaTitle?: string | null;
  pulseMediaDescription?: string | null;
  pulseMediaCtaLabel?: string | null;
  pulseMediaCtaHref?: string | null;
  pulseMediaLoopUrl?: string | null;
  pulseMediaLoopFileUrl?: string | null;
  pulseMediaPosterUrl?: string | null;
  pulseMediaSlides?: PulseSlide[] | null;
};

const QUERY = `coalesce(
  *[_type == "homeSchoolPulseSettings"][0]{
    pulseMediaTitle,
    pulseMediaDescription,
    pulseMediaCtaLabel,
    pulseMediaCtaHref,
    pulseMediaLoopUrl,
    "pulseMediaLoopFileUrl": pulseMediaLoopFile.asset->url,
    "pulseMediaPosterUrl": pulseMediaPoster.asset->url,
    "pulseMediaSlides": coalesce(pulseMediaSlides, [])[]{
      "imageSrc": image.asset->url,
      alt,
      caption
    }
  },
  *[_type == "siteSettings"][0]{
    pulseMediaTitle,
    pulseMediaDescription,
    pulseMediaCtaLabel,
    pulseMediaCtaHref,
    pulseMediaLoopUrl,
    "pulseMediaLoopFileUrl": pulseMediaLoopFile.asset->url,
    "pulseMediaPosterUrl": pulseMediaPoster.asset->url,
    "pulseMediaSlides": coalesce(pulseMediaSlides, [])[]{
      "imageSrc": image.asset->url,
      alt,
      caption
    }
  }
)`;

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  try {
    const settings = await client.fetch<PulseMediaSettings | null>(QUERY);

    const slides = Array.isArray(settings?.pulseMediaSlides)
      ? settings.pulseMediaSlides
          .map((slide) => ({
            imageSrc: cleanText(slide?.imageSrc),
            alt: cleanText(slide?.alt) || undefined,
            caption: cleanText(slide?.caption) || undefined,
          }))
          .filter((slide) => slide.imageSrc.length > 0)
      : [];

    return NextResponse.json(
      {
        title: cleanText(settings?.pulseMediaTitle),
        description: cleanText(settings?.pulseMediaDescription),
        ctaLabel: cleanText(settings?.pulseMediaCtaLabel),
        ctaHref: cleanText(settings?.pulseMediaCtaHref),
        loopSrc: cleanText(settings?.pulseMediaLoopFileUrl) || cleanText(settings?.pulseMediaLoopUrl) || null,
        posterSrc: cleanText(settings?.pulseMediaPosterUrl) || null,
        slides,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        title: "",
        description: "",
        ctaLabel: "",
        ctaHref: "",
        loopSrc: null,
        posterSrc: null,
        slides: [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  }
}
