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
  heroVideoFileUrl?: string;
  heroVideoWebmUrl?: string;
  heroVideoWebmFileUrl?: string;
  heroVideoOverrides?: Partial<Record<PageKey, string>>;
  heroVideoFileOverrides?: Partial<Record<PageKey, string>>;
  heroVideoWebmOverrides?: Partial<Record<PageKey, string>>;
  heroVideoWebmFileOverrides?: Partial<Record<PageKey, string>>;
};

const QUERY = `*[_type == "siteSettings"][0]{
  "heroVideoFileUrl": heroVideoFile.asset->url,
  heroVideoUrl,
  "heroVideoWebmFileUrl": heroVideoWebmFile.asset->url,
  heroVideoWebmUrl,
  "heroVideoFileOverrides": {
    "home": heroVideoFileOverrides.home.asset->url,
    "ourSchool": heroVideoFileOverrides.ourSchool.asset->url,
    "teachingLearning": heroVideoFileOverrides.teachingLearning.asset->url,
    "sixthForm": heroVideoFileOverrides.sixthForm.asset->url,
    "extracurricular": heroVideoFileOverrides.extracurricular.asset->url,
    "parents": heroVideoFileOverrides.parents.asset->url,
    "staff": heroVideoFileOverrides.staff.asset->url
  },
  heroVideoOverrides{
    home,
    ourSchool,
    teachingLearning,
    sixthForm,
    extracurricular,
    parents,
    staff
  },
  "heroVideoWebmFileOverrides": {
    "home": heroVideoWebmFileOverrides.home.asset->url,
    "ourSchool": heroVideoWebmFileOverrides.ourSchool.asset->url,
    "teachingLearning": heroVideoWebmFileOverrides.teachingLearning.asset->url,
    "sixthForm": heroVideoWebmFileOverrides.sixthForm.asset->url,
    "extracurricular": heroVideoWebmFileOverrides.extracurricular.asset->url,
    "parents": heroVideoWebmFileOverrides.parents.asset->url,
    "staff": heroVideoWebmFileOverrides.staff.asset->url
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
      settings?.heroVideoFileOverrides?.[page] ||
      settings?.heroVideoOverrides?.[page] ||
      settings?.heroVideoFileUrl ||
      settings?.heroVideoUrl ||
      null;
    const webmSrc =
      settings?.heroVideoWebmFileOverrides?.[page] ||
      settings?.heroVideoWebmOverrides?.[page] ||
      settings?.heroVideoWebmFileUrl ||
      settings?.heroVideoWebmUrl ||
      null;

    return NextResponse.json({ src, webmSrc }, { status: 200 });
  } catch {
    return NextResponse.json({ src: null, webmSrc: null }, { status: 200 });
  }
}
