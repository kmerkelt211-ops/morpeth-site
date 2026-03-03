export const runtime = "nodejs";
export const revalidate = 3600;

import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

type RecruitmentSettings = {
  recruitmentVideoUrl?: string | null;
  recruitmentVideoFileUrl?: string | null;
  recruitmentLoopUrl?: string | null;
  recruitmentLoopFileUrl?: string | null;
  recruitmentPosterUrl?: string | null;
};

const QUERY = `*[_type == "siteSettings"][0]{
  recruitmentVideoUrl,
  "recruitmentVideoFileUrl": recruitmentVideoFile.asset->url,
  recruitmentLoopUrl,
  "recruitmentLoopFileUrl": recruitmentLoopFile.asset->url,
  "recruitmentPosterUrl": recruitmentPoster.asset->url
}`;

function cleanUrl(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function GET() {
  try {
    const settings = await client.fetch<RecruitmentSettings | null>(QUERY);
    const videoSrc =
      cleanUrl(settings?.recruitmentVideoFileUrl) ||
      cleanUrl(settings?.recruitmentVideoUrl) ||
      null;
    const loopSrc =
      cleanUrl(settings?.recruitmentLoopFileUrl) ||
      cleanUrl(settings?.recruitmentLoopUrl) ||
      null;
    const posterSrc = cleanUrl(settings?.recruitmentPosterUrl) || null;

    return NextResponse.json(
      { videoSrc, loopSrc, posterSrc },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { videoSrc: null, loopSrc: null, posterSrc: null },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  }
}
