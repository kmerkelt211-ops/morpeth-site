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

type ImageAsset = {
  url?: string;
  alt?: string | null;
};

type HeroSettings = {
  heroVideoUrl?: string | null;
  heroVideoFile?: VideoAsset | null;
  heroVideoWebmUrl?: string | null;
  heroVideoWebmFile?: VideoAsset | null;
  heroImage?: ImageAsset | null;
  heroVideoOverrides?: Partial<Record<PageKey, string | null>>;
  heroVideoFileOverrides?: Partial<Record<PageKey, VideoAsset | null>>;
  heroVideoWebmOverrides?: Partial<Record<PageKey, string | null>>;
  heroVideoWebmFileOverrides?: Partial<Record<PageKey, VideoAsset | null>>;
  heroImageOverrides?: Partial<Record<PageKey, ImageAsset | null>>;
};

const QUERY = `*[_type == "siteSettings"][0]{
  "heroVideoFile": heroVideoFile.asset->{url, size},
  heroVideoUrl,
  "heroVideoWebmFile": heroVideoWebmFile.asset->{url, size},
  heroVideoWebmUrl,
  "heroImage": {
    "url": heroImage.asset->url,
    "alt": heroImage.alt
  },
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
  "heroImageOverrides": {
    "home": {"url": heroImageOverrides.home.asset->url, "alt": heroImageOverrides.home.alt},
    "ourSchool": {"url": heroImageOverrides.ourSchool.asset->url, "alt": heroImageOverrides.ourSchool.alt},
    "teachingLearning": {"url": heroImageOverrides.teachingLearning.asset->url, "alt": heroImageOverrides.teachingLearning.alt},
    "sixthForm": {"url": heroImageOverrides.sixthForm.asset->url, "alt": heroImageOverrides.sixthForm.alt},
    "extracurricular": {"url": heroImageOverrides.extracurricular.asset->url, "alt": heroImageOverrides.extracurricular.alt},
    "parents": {"url": heroImageOverrides.parents.asset->url, "alt": heroImageOverrides.parents.alt},
    "staff": {"url": heroImageOverrides.staff.asset->url, "alt": heroImageOverrides.staff.alt}
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

function pickImageAsset(asset?: ImageAsset | null): ImageAsset | null {
  if (!asset) return null;
  const url = pickUrl(asset.url);
  if (!url) return null;
  const alt = pickUrl(asset.alt) || null;
  return { url, alt };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "";
    if (!isPageKey(page)) {
      return NextResponse.json(
        { src: null, webmSrc: null, imageSrc: null, imageAlt: null, preferImage: false },
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

    const imageOverride = pickImageAsset(settings?.heroImageOverrides?.[page]);
    const imageGlobal = pickImageAsset(settings?.heroImage);
    const image = imageOverride || imageGlobal || null;
    const preferImage = Boolean(image?.url) && !src && !webmSrc;

    return NextResponse.json(
      {
        src,
        webmSrc,
        imageSrc: image?.url || null,
        imageAlt: image?.alt || null,
        preferImage,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { src: null, webmSrc: null, imageSrc: null, imageAlt: null, preferImage: false },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  }
}
