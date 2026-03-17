export const runtime = "nodejs";
export const revalidate = 60;

import { NextResponse } from "next/server";
import { loadPulseMedia } from "../../../lib/siteMediaLoaders";

export async function GET() {
  try {
    const media = await loadPulseMedia();

    return NextResponse.json(
      media,
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
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
          "Cache-Control": "public, max-age=10, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  }
}
