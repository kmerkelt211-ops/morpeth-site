import { client } from "../sanity/client";
import { cleanMediaText, pickRemoteMediaUrl, type RemoteMediaAsset } from "./mediaPolicy";

export type PulseMediaSlide = {
  imageSrc: string;
  alt?: string;
  caption?: string;
};

export type PulseMedia = {
  title: string;
  description: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  loopSrc: string | null;
  posterSrc: string | null;
  slides: PulseMediaSlide[];
};

export type HomeSixthFormMedia = {
  videoSrc: string | null;
  posterSrc: string | null;
  imageSrc: string;
  imageAlt: string;
};

export type SixthFormMedia = {
  whyJoinVideoSrc: string | null;
  whyJoinVideoPoster: string | null;
};

export type RecruitmentMedia = {
  videoSrc: string | null;
  loopSrc: string | null;
  posterSrc: string | null;
};

type PulseSlide = {
  imageSrc?: string | null;
  alt?: string | null;
  caption?: string | null;
};

type PulseMediaSettings = {
  pulseMediaTitle?: string | null;
  pulseMediaDescription?: string | null;
  pulseMediaCtaLabel?: string | null;
  pulseMediaCtaHref?: string | null;
  pulseMediaLoopUrl?: string | null;
  pulseMediaLoopFile?: RemoteMediaAsset | null;
  pulseMediaPosterUrl?: string | null;
  pulseMediaSlides?: PulseSlide[] | null;
};

type HomeSixthFormMediaSettings = {
  homeSixthFormHighlightVideoUrl?: string | null;
  homeSixthFormHighlightVideoFile?: RemoteMediaAsset | null;
  homeSixthFormHighlightPosterUrl?: string | null;
  homeSixthFormHighlightImageUrl?: string | null;
  homeSixthFormHighlightImageAlt?: string | null;
};

type SixthFormMediaSettings = {
  whyJoinVideoUrl?: string | null;
  whyJoinVideoFile?: RemoteMediaAsset | null;
  whyJoinVideoPosterUrl?: string | null;
};

type RecruitmentSettings = {
  recruitmentVideoUrl?: string | null;
  recruitmentVideoFile?: RemoteMediaAsset | null;
  recruitmentLoopUrl?: string | null;
  recruitmentLoopFile?: RemoteMediaAsset | null;
  recruitmentPosterUrl?: string | null;
};

export const DEFAULT_PULSE_MEDIA: PulseMedia = {
  title: "Inside Morpeth",
  description: "Real moments from lessons, productions and school life.",
  ctaLabel: "Explore school life",
  ctaHref: "/our-school",
  loopSrc: null,
  posterSrc: null,
  slides: [],
};

export const DEFAULT_HOME_SIXTH_FORM_MEDIA: HomeSixthFormMedia = {
  videoSrc: null,
  posterSrc: "/images/sixthform-hero.jpg",
  imageSrc: "/images/sixthform-hero.jpg",
  imageAlt: "Morpeth Sixth Form students",
};

export const DEFAULT_SIXTH_FORM_MEDIA: SixthFormMedia = {
  whyJoinVideoSrc: null,
  whyJoinVideoPoster: null,
};

export const DEFAULT_RECRUITMENT_MEDIA: RecruitmentMedia = {
  videoSrc: null,
  loopSrc: null,
  posterSrc: null,
};

const PULSE_MEDIA_QUERY = `coalesce(
  *[_type == "homeSchoolPulseSettings" && _id == "homeSchoolPulseSettings"][0]{
    pulseMediaTitle,
    pulseMediaDescription,
    pulseMediaCtaLabel,
    pulseMediaCtaHref,
    pulseMediaLoopUrl,
    "pulseMediaLoopFile": pulseMediaLoopFile.asset->{url, size},
    "pulseMediaPosterUrl": pulseMediaPoster.asset->url,
    "pulseMediaSlides": coalesce(pulseMediaSlides, [])[]{
      "imageSrc": image.asset->url,
      alt,
      caption
    }
  },
  *[_type == "homeSchoolPulseSettings"] | order(_updatedAt desc)[0]{
    pulseMediaTitle,
    pulseMediaDescription,
    pulseMediaCtaLabel,
    pulseMediaCtaHref,
    pulseMediaLoopUrl,
    "pulseMediaLoopFile": pulseMediaLoopFile.asset->{url, size},
    "pulseMediaPosterUrl": pulseMediaPoster.asset->url,
    "pulseMediaSlides": coalesce(pulseMediaSlides, [])[]{
      "imageSrc": image.asset->url,
      alt,
      caption
    }
  },
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    pulseMediaTitle,
    pulseMediaDescription,
    pulseMediaCtaLabel,
    pulseMediaCtaHref,
    pulseMediaLoopUrl,
    "pulseMediaLoopFile": pulseMediaLoopFile.asset->{url, size},
    "pulseMediaPosterUrl": pulseMediaPoster.asset->url,
    "pulseMediaSlides": coalesce(pulseMediaSlides, [])[]{
      "imageSrc": image.asset->url,
      alt,
      caption
    }
  },
  *[_type == "siteSettings"] | order(_updatedAt desc)[0]{
    pulseMediaTitle,
    pulseMediaDescription,
    pulseMediaCtaLabel,
    pulseMediaCtaHref,
    pulseMediaLoopUrl,
    "pulseMediaLoopFile": pulseMediaLoopFile.asset->{url, size},
    "pulseMediaPosterUrl": pulseMediaPoster.asset->url,
    "pulseMediaSlides": coalesce(pulseMediaSlides, [])[]{
      "imageSrc": image.asset->url,
      alt,
      caption
    }
  }
)`;

const HOME_SIXTH_FORM_MEDIA_QUERY = `coalesce(
  *[_type == "homeSixthFormHighlightSettings" && _id == "homeSixthFormHighlightSettings"][0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFile": homeSixthFormHighlightVideoFile.asset->{url, size},
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  },
  *[_type == "homeSixthFormHighlightSettings"] | order(_updatedAt desc)[0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFile": homeSixthFormHighlightVideoFile.asset->{url, size},
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  },
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFile": homeSixthFormHighlightVideoFile.asset->{url, size},
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  },
  *[_type == "siteSettings"] | order(_updatedAt desc)[0]{
    homeSixthFormHighlightVideoUrl,
    "homeSixthFormHighlightVideoFile": homeSixthFormHighlightVideoFile.asset->{url, size},
    "homeSixthFormHighlightPosterUrl": homeSixthFormHighlightPoster.asset->url,
    "homeSixthFormHighlightImageUrl": homeSixthFormHighlightImage.asset->url,
    "homeSixthFormHighlightImageAlt": homeSixthFormHighlightImage.alt
  }
)`;

const SIXTH_FORM_MEDIA_QUERY = `*[_type == "siteSettings"][0]{
  "whyJoinVideoUrl": sixthFormWhyJoinVideoUrl,
  "whyJoinVideoFile": sixthFormWhyJoinVideoFile.asset->{url, size},
  "whyJoinVideoPosterUrl": sixthFormWhyJoinVideoPoster.asset->url
}`;

const RECRUITMENT_MEDIA_QUERY = `*[_type == "siteSettings"][0]{
  recruitmentVideoUrl,
  "recruitmentVideoFile": recruitmentVideoFile.asset->{url, size},
  recruitmentLoopUrl,
  "recruitmentLoopFile": recruitmentLoopFile.asset->{url, size},
  "recruitmentPosterUrl": recruitmentPoster.asset->url
}`;

export async function loadPulseMedia(): Promise<PulseMedia> {
  try {
    const settings = await client.fetch<PulseMediaSettings | null>(PULSE_MEDIA_QUERY);
    const configuredCtaLabel = cleanMediaText(settings?.pulseMediaCtaLabel);
    const configuredCtaHref = cleanMediaText(settings?.pulseMediaCtaHref);

    const slides = Array.isArray(settings?.pulseMediaSlides)
      ? settings.pulseMediaSlides
          .map((slide) => ({
            imageSrc: cleanMediaText(slide?.imageSrc),
            alt: cleanMediaText(slide?.alt) || undefined,
            caption: cleanMediaText(slide?.caption) || undefined,
          }))
          .filter((slide) => slide.imageSrc.length > 0)
      : [];

    return {
      title: cleanMediaText(settings?.pulseMediaTitle) || DEFAULT_PULSE_MEDIA.title,
      description:
        cleanMediaText(settings?.pulseMediaDescription) || DEFAULT_PULSE_MEDIA.description,
      ctaLabel: configuredCtaLabel || DEFAULT_PULSE_MEDIA.ctaLabel,
      ctaHref:
        configuredCtaHref || (configuredCtaLabel ? null : DEFAULT_PULSE_MEDIA.ctaHref),
      loopSrc:
        pickRemoteMediaUrl(settings?.pulseMediaLoopFile) ||
        cleanMediaText(settings?.pulseMediaLoopUrl) ||
        null,
      posterSrc: cleanMediaText(settings?.pulseMediaPosterUrl) || null,
      slides,
    };
  } catch {
    return DEFAULT_PULSE_MEDIA;
  }
}

export async function loadHomeSixthFormMedia(): Promise<HomeSixthFormMedia> {
  try {
    const settings = await client.fetch<HomeSixthFormMediaSettings | null>(
      HOME_SIXTH_FORM_MEDIA_QUERY
    );
    const videoSrc =
      pickRemoteMediaUrl(settings?.homeSixthFormHighlightVideoFile) ||
      cleanMediaText(settings?.homeSixthFormHighlightVideoUrl);
    const imageSrc =
      cleanMediaText(settings?.homeSixthFormHighlightImageUrl) ||
      DEFAULT_HOME_SIXTH_FORM_MEDIA.imageSrc;
    const posterSrc =
      cleanMediaText(settings?.homeSixthFormHighlightPosterUrl) || imageSrc;

    return {
      videoSrc: videoSrc || null,
      posterSrc: posterSrc || null,
      imageSrc,
      imageAlt:
        cleanMediaText(settings?.homeSixthFormHighlightImageAlt) ||
        DEFAULT_HOME_SIXTH_FORM_MEDIA.imageAlt,
    };
  } catch {
    return DEFAULT_HOME_SIXTH_FORM_MEDIA;
  }
}

export async function loadSixthFormMedia(): Promise<SixthFormMedia> {
  try {
    const settings = await client.fetch<SixthFormMediaSettings | null>(SIXTH_FORM_MEDIA_QUERY);
    return {
      whyJoinVideoSrc:
        pickRemoteMediaUrl(settings?.whyJoinVideoFile) ||
        cleanMediaText(settings?.whyJoinVideoUrl) ||
        null,
      whyJoinVideoPoster: cleanMediaText(settings?.whyJoinVideoPosterUrl) || null,
    };
  } catch {
    return DEFAULT_SIXTH_FORM_MEDIA;
  }
}

export async function loadRecruitmentMedia(): Promise<RecruitmentMedia> {
  try {
    const settings = await client.fetch<RecruitmentSettings | null>(RECRUITMENT_MEDIA_QUERY);
    return {
      videoSrc:
        pickRemoteMediaUrl(settings?.recruitmentVideoFile) ||
        cleanMediaText(settings?.recruitmentVideoUrl) ||
        null,
      loopSrc:
        pickRemoteMediaUrl(settings?.recruitmentLoopFile) ||
        cleanMediaText(settings?.recruitmentLoopUrl) ||
        null,
      posterSrc: cleanMediaText(settings?.recruitmentPosterUrl) || null,
    };
  } catch {
    return DEFAULT_RECRUITMENT_MEDIA;
  }
}
