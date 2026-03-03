export const runtime = "nodejs";
export const revalidate = 3600;

import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

type SixthFormMediaSettings = {
  whyJoinVideoUrl?: string | null;
  whyJoinVideoFileUrl?: string | null;
  whyJoinVideoPosterUrl?: string | null;
};

const QUERY = `*[_type == "siteSettings"][0]{
  sixthFormWhyJoinVideoUrl,
  "sixthFormWhyJoinVideoFileUrl": sixthFormWhyJoinVideoFile.asset->url,
  "sixthFormWhyJoinVideoPosterUrl": sixthFormWhyJoinVideoPoster.asset->url
}`;

function cleanUrl(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function GET() {
  try {
    const settings = await client.fetch<SixthFormMediaSettings | null>(QUERY);
    const whyJoinVideoSrc =
      cleanUrl(settings?.whyJoinVideoFileUrl) ||
      cleanUrl(settings?.whyJoinVideoUrl) ||
      null;
    const whyJoinVideoPoster = cleanUrl(settings?.whyJoinVideoPosterUrl) || null;

    return NextResponse.json(
      { whyJoinVideoSrc, whyJoinVideoPoster },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { whyJoinVideoSrc: null, whyJoinVideoPoster: null },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  }
}
