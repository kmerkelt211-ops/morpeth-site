export const runtime = "nodejs";
export const revalidate = 3600;

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
const MAX_HERO_FILE_BYTES = 16 * 1024 * 1024;

type VideoAsset = {
  url?: string;
  size?: number;
};

type HeroSettings = {
  heroVideoUrl?: string | null;
  heroVideoFile?: VideoAsset | null;
  heroVideoWebmUrl?: string | null;
  heroVideoWebmFile?: VideoAsset | null;
  heroVideoOverrides?: Partial<Record<PageKey, string | null>>;
  heroVideoFileOverrides?: Partial<Record<PageKey, VideoAsset | null>>;
  heroVideoWebmOverrides?: Partial<Record<PageKey, string | null>>;
  heroVideoWebmFileOverrides?: Partial<Record<PageKey, VideoAsset | null>>;
};

const QUERY = `*[_type == "siteSettings"][0]{
  "heroVideoFile": heroVideoFile.asset->{url, size},
  heroVideoUrl,
  "heroVideoWebmFile": heroVideoWebmFile.asset->{url, size},
  heroVideoWebmUrl,
  "heroVideoFileOverrides": {
    "home": heroVideoFileOverrides.home.asset->{url, size},
    "ourSchool": heroVideoFileOverrides.ourSchool.asset->{url, size},
    "teachingLearning": heroVideoFileOverrides.teachingLearning.asset->{url, size},
    "sixthForm": heroVideoFileOverrides.sixthForm.asset->{url, size},
    "extracurricular": heroVideoFileOverrides.extracurricular.asset->{url, size},
    "parents": heroVideoFileOverrides.parents.asset->{url, size},
    "staff": heroVideoFileOverrides.staff.asset->{url, size}
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
    "home": heroVideoWebmFileOverrides.home.asset->{url, size},
    "ourSchool": heroVideoWebmFileOverrides.ourSchool.asset->{url, size},
    "teachingLearning": heroVideoWebmFileOverrides.teachingLearning.asset->{url, size},
    "sixthForm": heroVideoWebmFileOverrides.sixthForm.asset->{url, size},
    "extracurricular": heroVideoWebmFileOverrides.extracurricular.asset->{url, size},
    "parents": heroVideoWebmFileOverrides.parents.asset->{url, size},
    "staff": heroVideoWebmFileOverrides.staff.asset->{url, size}
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

function pickUrl(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function pickAssetUrl(
  asset?: VideoAsset | null,
  maxBytes = MAX_HERO_FILE_BYTES
): string | null {
  if (!asset) return null;
  const url = pickUrl(asset.url);
  if (!url) return null;
  if (typeof asset.size === "number" && asset.size > maxBytes) return null;
  return url;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "";
    if (!isPageKey(page)) {
      return NextResponse.json(
        { src: null },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }

    const settings = await client.fetch<HeroSettings | null>(QUERY);
    const heroFileOverride = pickAssetUrl(settings?.heroVideoFileOverrides?.[page]);
    const heroFileGlobal = pickAssetUrl(settings?.heroVideoFile);
    const heroUrlOverride = pickUrl(settings?.heroVideoOverrides?.[page]);
    const heroUrlGlobal = pickUrl(settings?.heroVideoUrl);
    const src =
      heroFileOverride ||
      heroUrlOverride ||
      heroFileGlobal ||
      heroUrlGlobal ||
      null;

    const webmFileOverride = pickAssetUrl(settings?.heroVideoWebmFileOverrides?.[page]);
    const webmFileGlobal = pickAssetUrl(settings?.heroVideoWebmFile);
    const webmUrlOverride = pickUrl(settings?.heroVideoWebmOverrides?.[page]);
    const webmUrlGlobal = pickUrl(settings?.heroVideoWebmUrl);
    const webmSrc =
      webmFileOverride ||
      webmUrlOverride ||
      webmFileGlobal ||
      webmUrlGlobal ||
      null;

    return NextResponse.json(
      { src, webmSrc },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { src: null, webmSrc: null },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  }
}
