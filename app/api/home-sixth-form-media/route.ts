export const runtime = "nodejs";
export const revalidate = 60;

import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

type HomeSixthFormMediaSettings = {
  homeSixthFormHighlightVideoUrl?: string | null;
  homeSixthFormHighlightVideoFileUrl?: string | null;
  homeSixthFormHighlightPosterUrl?: string | null;
  homeSixthFormHighlightImageUrl?: string | null;
  homeSixthFormHighlightImageAlt?: string | null;
};

const DEFAULT_IMAGE_SRC = "/images/sixthform-hero.jpg";
const DEFAULT_IMAGE_ALT = "Morpeth Sixth Form students";

const QUERY = `coalesce(
  *[_type == "homeSixthFormHighlightSettings" && _id == "homeSixthFormHighlightSettings"][0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFileUrl": homeSixthFormHighlightVideoFile.asset->url,
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  },
  *[_type == "homeSixthFormHighlightSettings"] | order(_updatedAt desc)[0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFileUrl": homeSixthFormHighlightVideoFile.asset->url,
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  },
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFileUrl": homeSixthFormHighlightVideoFile.asset->url,
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  },
  *[_type == "siteSettings"] | order(_updatedAt desc)[0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFileUrl": homeSixthFormHighlightVideoFile.asset->url,
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  }
)`;

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  try {
    const settings = await client.fetch<HomeSixthFormMediaSettings | null>(QUERY);

    const videoSrc = cleanText(settings?.homeSixthFormHighlightVideoFileUrl) || cleanText(settings?.homeSixthFormHighlightVideoUrl);
    const imageSrc = cleanText(settings?.homeSixthFormHighlightImageUrl) || DEFAULT_IMAGE_SRC;
    const posterSrc = cleanText(settings?.homeSixthFormHighlightPosterUrl) || imageSrc;

    return NextResponse.json(
      {
        videoSrc: videoSrc || null,
        posterSrc: posterSrc || null,
        imageSrc,
        imageAlt: cleanText(settings?.homeSixthFormHighlightImageAlt) || DEFAULT_IMAGE_ALT,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        videoSrc: null,
        posterSrc: DEFAULT_IMAGE_SRC,
        imageSrc: DEFAULT_IMAGE_SRC,
        imageAlt: DEFAULT_IMAGE_ALT,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=10, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  }
}
