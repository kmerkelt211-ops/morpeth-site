import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";
export const revalidate = 600;

const QUERY = `*[_type == "extracurricularPage"][0]{
  hero{
    eyebrow,
    title,
    description,
    links[]{
      label,
      href
    }
  },
  whyEnrichment{
    eyebrow,
    title,
    paragraphs,
    sidebarTitle,
    sidebarBullets,
    sidebarNote
  },
  enrichmentVideo{
    eyebrow,
    title,
    paragraphs,
    videoUrl,
    "videoFileUrl": videoFile.asset->url,
    "videoPosterUrl": videoPoster.asset->url
  },
  clubVideos{
    eyebrow,
    title,
    description,
    cards[]{
      title,
      description,
      videoUrl,
      "videoFileUrl": videoFile.asset->url,
      "videoPosterUrl": videoPoster.asset->url
    },
    footerText
  },
  flexibleTimetable{
    eyebrow,
    title,
    paragraphs,
    sidebarTitle,
    sidebarBullets,
    sidebarBody,
    links[]{
      label,
      href,
      openInNewTab
    }
  },
  lifeBeyondLessons{
    eyebrow,
    title,
    description,
    cards[]{
      title,
      description
    },
    footerText
  }
}`;

export async function GET() {
  try {
    const data = await client.fetch(QUERY);
    return NextResponse.json(data ?? {}, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Failed to fetch extracurricular page data", error);
    return NextResponse.json(
      {},
      {
        status: 500,
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  }
}
