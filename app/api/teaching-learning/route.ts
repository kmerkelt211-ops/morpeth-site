import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

const QUERY = `*[_type == "teachingLearningPage"][0]{
  hero{
    eyebrow,
    title,
    description
  },
  onPage{
    eyebrow,
    title,
    description,
    links[]{
      label,
      href
    }
  },
  ks3{
    eyebrow,
    title,
    description,
    subjects,
    features[]{
      id,
      title,
      description,
      icon
    },
    details[]{
      title,
      paragraphs
    }
  },
  subjects{
    eyebrow,
    title,
    description,
    searchPlaceholder,
    emptyText,
    items[]{
      id,
      name,
      phase,
      description,
      imageUrl,
      "imageFileUrl": image.asset->url,
      videoUrl,
      "videoFileUrl": videoFile.asset->url,
      "videoPosterUrl": videoPoster.asset->url
    }
  },
  support{
    cards[]{
      id,
      title,
      intro,
      details,
      note,
      imageUrl,
      "imageFileUrl": image.asset->url,
      imageAlt
    }
  },
  modal{
    comingSoonText,
    fallbackDescription,
    footerText
  }
}`;

export async function GET() {
  try {
    const data = await client.fetch(QUERY);
    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error("Failed to fetch teaching-learning page data", error);
    return NextResponse.json({}, { status: 500 });
  }
}
