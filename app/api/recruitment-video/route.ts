export const runtime = "nodejs";
export const revalidate = 3600;

import { NextResponse } from "next/server";
import { loadRecruitmentMedia } from "../../../lib/siteMediaLoaders";

export async function GET() {
  try {
    const media = await loadRecruitmentMedia();

    return NextResponse.json(
      media,
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
