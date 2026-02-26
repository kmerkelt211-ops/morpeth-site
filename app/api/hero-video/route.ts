export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

const PAGE_KEYS = [
  "home",
  "ourSchool",
  "teachingLearning",
  "sixthForm",
  "extracurricular",
  "parents",
  "staff",
] as const;

type PageKey = (typeof PAGE_KEYS)[number];

type HeroSettings = {
  heroVideoUrl?: string;
  heroVideoWebmUrl?: string;
  heroVideoOverrides?: Partial<Record<PageKey, string>>;
  heroVideoWebmOverrides?: Partial<Record<PageKey, string>>;
};

const QUERY = `*[_type == "siteSettings"][0]{
  heroVideoUrl,
  heroVideoWebmUrl,
  heroVideoOverrides{
    home,
    ourSchool,
    teachingLearning,
    sixthForm,
    extracurricular,
    parents,
    staff
  },
  heroVideoWebmOverrides{
    home,
    ourSchool,
    teachingLearning,
    sixthForm,
    extracurricular,
    parents,
    staff
  }
}`;

function isPageKey(value: string): value is PageKey {
  return (PAGE_KEYS as readonly string[]).includes(value);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "";
    if (!isPageKey(page)) {
      return NextResponse.json({ src: null }, { status: 200 });
    }

    const settings = await client.fetch<HeroSettings | null>(QUERY);
    const src =
      settings?.heroVideoOverrides?.[page] ||
      settings?.heroVideoUrl ||
      null;
    const webmSrc =
      settings?.heroVideoWebmOverrides?.[page] ||
      settings?.heroVideoWebmUrl ||
      null;

    return NextResponse.json({ src, webmSrc }, { status: 200 });
  } catch {
    return NextResponse.json({ src: null, webmSrc: null }, { status: 200 });
  }
}
