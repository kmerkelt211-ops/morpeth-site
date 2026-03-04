import "server-only";

import type { TypedObject } from "@portabletext/types";
import { client } from "../sanity/client";

type PortableTextChild = {
  _type?: string;
  text?: string;
};

type PortableTextBlock = TypedObject & {
  children?: PortableTextChild[];
};

type HouseLead = {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
};

type HouseEvent = {
  title?: string;
  date?: string;
  location?: string;
  summary?: string;
};

type HouseLink = {
  label?: string;
  url?: string;
};

type HouseDownloadItem = {
  label?: string;
  fileUrl?: string;
  fileName?: string;
};

type HouseNotice = {
  title?: string;
  body?: PortableTextBlock[];
};

type HouseUpdate = {
  _id?: string;
  title?: string;
  publishedAt?: string;
  summary?: string;
  body?: PortableTextBlock[];
};

type HouseSummaryRow = {
  _id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  brandColor?: string;
  crestUrl?: string;
  leadNames?: string[];
  pointsValue?: number;
  pointsLabel?: string;
  pointsUpdatedAt?: string;
  nextEvent?: HouseEvent;
  updateCount?: number;
};

type HouseDetailRow = {
  _id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  about?: PortableTextBlock[];
  brandColor?: string;
  crestUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  videoFileUrl?: string;
  videoPosterUrl?: string;
  leads?: HouseLead[];
  pointsValue?: number;
  pointsLabel?: string;
  pointsUpdatedAt?: string;
  events?: HouseEvent[];
  links?: HouseLink[];
  notices?: HouseNotice[];
  downloadItems?: HouseDownloadItem[];
  legacyDownloads?: HouseDownloadItem[];
  updates?: HouseUpdate[];
};

export type HouseSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  brandColor: string;
  crestUrl: string | null;
  leadNames: string[];
  pointsValue: number | null;
  pointsLabel: string;
  pointsUpdatedAt: string | null;
  nextEvent: {
    title: string;
    date: string | null;
    location: string;
  } | null;
  updateCount: number;
};

export type HouseDetail = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  about: PortableTextBlock[];
  brandColor: string;
  crestUrl: string | null;
  heroImageUrl: string | null;
  videoUrl: string | null;
  videoFileUrl: string | null;
  videoPosterUrl: string | null;
  leads: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
    photoUrl: string | null;
  }>;
  pointsValue: number | null;
  pointsLabel: string;
  pointsUpdatedAt: string | null;
  events: Array<{
    title: string;
    date: string | null;
    location: string;
    summary: string;
  }>;
  links: Array<{
    label: string;
    url: string;
  }>;
  notices: Array<{
    title: string;
    body: PortableTextBlock[];
  }>;
  downloads: Array<{
    label: string;
    fileUrl: string;
    fileName: string;
  }>;
  updates: Array<{
    id: string;
    title: string;
    publishedAt: string | null;
    summary: string;
    body: PortableTextBlock[];
  }>;
};

export const HOUSE_BRAND_STYLES: Record<
  string,
  {
    badge: string;
    chip: string;
    ring: string;
  }
> = {
  chapman: {
    badge: "bg-red-600 text-white",
    chip: "bg-red-50 text-red-800 border-red-200",
    ring: "ring-red-200",
  },
  jalal: {
    badge: "bg-blue-600 text-white",
    chip: "bg-blue-50 text-blue-800 border-blue-200",
    ring: "ring-blue-200",
  },
  tull: {
    badge: "bg-amber-400 text-slate-900",
    chip: "bg-amber-50 text-amber-900 border-amber-200",
    ring: "ring-amber-200",
  },
  pankhurst: {
    badge: "bg-violet-600 text-white",
    chip: "bg-violet-50 text-violet-800 border-violet-200",
    ring: "ring-violet-200",
  },
  mendoza: {
    badge: "bg-lime-500 text-slate-900",
    chip: "bg-lime-50 text-lime-900 border-lime-200",
    ring: "ring-lime-200",
  },
};

const HOUSE_SUMMARIES_QUERY = `*[_type == "house"] | order(coalesce(order, 999) asc, title asc){
  _id,
  title,
  "slug": slug.current,
  summary,
  brandColor,
  "crestUrl": crest.asset->url,
  "leadNames": houseLeads[]->name,
  "pointsValue": currentPoints,
  "pointsLabel": latestPoints,
  pointsUpdatedAt,
  "nextEvent": events[dateTime(date) >= now()] | order(date asc)[0]{
    title,
    date,
    location,
    summary
  },
  "updateCount": count(*[_type == "houseUpdate" && house._ref == ^._id])
}`;

const HOUSE_DETAIL_QUERY = `*[_type == "house" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  about,
  brandColor,
  "crestUrl": crest.asset->url,
  "heroImageUrl": heroImage.asset->url,
  videoUrl,
  "videoFileUrl": videoFile.asset->url,
  "videoPosterUrl": videoPoster.asset->url,
  "leads": houseLeads[]->{
    name,
    role,
    email,
    phone,
    "photoUrl": photo.asset->url
  },
  "pointsValue": currentPoints,
  "pointsLabel": latestPoints,
  pointsUpdatedAt,
  events[]{
    title,
    date,
    location,
    summary
  },
  links[]{
    label,
    url
  },
  notices[]{
    title,
    body
  },
  downloadItems[]{
    label,
    "fileUrl": file.asset->url,
    "fileName": coalesce(file.asset->originalFilename, label)
  },
  "legacyDownloads": downloads[]{
    "fileUrl": asset->url,
    "fileName": asset->originalFilename
  },
  "updates": *[_type == "houseUpdate" && house._ref == ^._id] | order(publishedAt desc)[0...8]{
    _id,
    title,
    publishedAt,
    summary,
    body
  }
}`;

function toStringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toStringOrNull(value: unknown): string | null {
  const text = toStringOrEmpty(value);
  return text.length > 0 ? text : null;
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toBrandKey(value: unknown): string {
  const key = toStringOrEmpty(value).toLowerCase();
  if (HOUSE_BRAND_STYLES[key]) return key;
  return "mendoza";
}

function normalizeLeadNames(leadNames: unknown): string[] {
  if (!Array.isArray(leadNames)) return [];
  return leadNames
    .map((lead) => toStringOrEmpty(lead))
    .filter((lead) => lead.length > 0);
}

function normalizeEvents(events: unknown): Array<{ title: string; date: string | null; location: string; summary: string }> {
  if (!Array.isArray(events)) return [];
  return events
    .map((event) => {
      const candidate = event as HouseEvent;
      const title = toStringOrEmpty(candidate?.title);
      if (!title) return null;
      return {
        title,
        date: toStringOrNull(candidate?.date),
        location: toStringOrEmpty(candidate?.location),
        summary: toStringOrEmpty(candidate?.summary),
      };
    })
    .filter((event): event is { title: string; date: string | null; location: string; summary: string } => Boolean(event))
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
}

function normalizeLinks(links: unknown): Array<{ label: string; url: string }> {
  if (!Array.isArray(links)) return [];
  return links
    .map((link) => {
      const candidate = link as HouseLink;
      const label = toStringOrEmpty(candidate?.label);
      const url = toStringOrEmpty(candidate?.url);
      if (!label || !url) return null;
      return { label, url };
    })
    .filter((link): link is { label: string; url: string } => Boolean(link));
}

function normalizeNotices(notices: unknown): Array<{ title: string; body: PortableTextBlock[] }> {
  if (!Array.isArray(notices)) return [];
  return notices
    .map((notice) => {
      const candidate = notice as HouseNotice;
      const title = toStringOrEmpty(candidate?.title);
      if (!title) return null;
      const body = Array.isArray(candidate?.body) ? candidate.body : [];
      return { title, body };
    })
    .filter((notice): notice is { title: string; body: PortableTextBlock[] } => Boolean(notice));
}

function normalizeDownloads(
  downloadItems: unknown,
  legacyDownloads: unknown
): Array<{ label: string; fileUrl: string; fileName: string }> {
  const next: Array<{ label: string; fileUrl: string; fileName: string }> = [];

  if (Array.isArray(downloadItems)) {
    for (const item of downloadItems) {
      const candidate = item as HouseDownloadItem;
      const fileUrl = toStringOrEmpty(candidate?.fileUrl);
      if (!fileUrl) continue;
      const fileName = toStringOrEmpty(candidate?.fileName) || "Download file";
      const label = toStringOrEmpty(candidate?.label) || fileName;
      next.push({ label, fileUrl, fileName });
    }
  }

  if (next.length > 0) {
    return next;
  }

  if (!Array.isArray(legacyDownloads)) return [];
  for (const item of legacyDownloads) {
    const candidate = item as HouseDownloadItem;
    const fileUrl = toStringOrEmpty(candidate?.fileUrl);
    if (!fileUrl) continue;
    const fileName = toStringOrEmpty(candidate?.fileName) || "Download file";
    next.push({ label: fileName, fileUrl, fileName });
  }
  return next;
}

function normalizeUpdates(updates: unknown): Array<{ id: string; title: string; publishedAt: string | null; summary: string; body: PortableTextBlock[] }> {
  if (!Array.isArray(updates)) return [];
  return updates
    .map((update) => {
      const candidate = update as HouseUpdate;
      const id = toStringOrEmpty(candidate?._id);
      const title = toStringOrEmpty(candidate?.title);
      if (!id || !title) return null;
      const body = Array.isArray(candidate?.body) ? candidate.body : [];
      const summary = toStringOrEmpty(candidate?.summary) || portableTextToPlainText(body).slice(0, 180);
      return {
        id,
        title,
        publishedAt: toStringOrNull(candidate?.publishedAt),
        summary,
        body,
      };
    })
    .filter((update): update is { id: string; title: string; publishedAt: string | null; summary: string; body: PortableTextBlock[] } => Boolean(update));
}

export function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((block) => block && block._type === "block" && Array.isArray(block.children))
    .map((block) =>
      (block.children ?? [])
        .filter((child) => child && typeof child.text === "string")
        .map((child) => child.text ?? "")
        .join("")
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatHouseDate(value: string | null): string {
  if (!value) return "Date to be confirmed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export async function fetchHouseSummaries(): Promise<HouseSummary[]> {
  const rows = await client.fetch<HouseSummaryRow[]>(HOUSE_SUMMARIES_QUERY);
  return (rows ?? [])
    .map((row) => {
      const id = toStringOrEmpty(row?._id);
      const title = toStringOrEmpty(row?.title);
      const slug = toStringOrEmpty(row?.slug);
      if (!id || !title || !slug) return null;

      const nextEventTitle = toStringOrEmpty(row?.nextEvent?.title);
      const pointsValue = toNumberOrNull(row?.pointsValue);
      const pointsLabel = toStringOrEmpty(row?.pointsLabel);

      return {
        id,
        title,
        slug,
        summary: toStringOrEmpty(row?.summary),
        brandColor: toBrandKey(row?.brandColor),
        crestUrl: toStringOrNull(row?.crestUrl),
        leadNames: normalizeLeadNames(row?.leadNames),
        pointsValue,
        pointsLabel: pointsLabel || "Updated weekly",
        pointsUpdatedAt: toStringOrNull(row?.pointsUpdatedAt),
        nextEvent: nextEventTitle
          ? {
              title: nextEventTitle,
              date: toStringOrNull(row?.nextEvent?.date),
              location: toStringOrEmpty(row?.nextEvent?.location),
            }
          : null,
        updateCount: typeof row?.updateCount === "number" ? row.updateCount : 0,
      } satisfies HouseSummary;
    })
    .filter((house): house is HouseSummary => Boolean(house));
}

export async function fetchHouseDetailBySlug(slug: string): Promise<HouseDetail | null> {
  const row = await client.fetch<HouseDetailRow | null>(HOUSE_DETAIL_QUERY, { slug });
  if (!row) return null;

  const id = toStringOrEmpty(row._id);
  const title = toStringOrEmpty(row.title);
  const canonicalSlug = toStringOrEmpty(row.slug);
  if (!id || !title || !canonicalSlug) return null;

  const leads = Array.isArray(row.leads)
    ? row.leads
        .map((lead) => ({
          name: toStringOrEmpty(lead?.name),
          role: toStringOrEmpty(lead?.role),
          email: toStringOrEmpty(lead?.email),
          phone: toStringOrEmpty(lead?.phone),
          photoUrl: toStringOrNull(lead?.photoUrl),
        }))
        .filter((lead) => lead.name.length > 0)
    : [];

  const pointsValue = toNumberOrNull(row.pointsValue);
  const pointsLabel = toStringOrEmpty(row.pointsLabel);

  return {
    id,
    title,
    slug: canonicalSlug,
    summary: toStringOrEmpty(row.summary),
    about: Array.isArray(row.about) ? row.about : [],
    brandColor: toBrandKey(row.brandColor),
    crestUrl: toStringOrNull(row.crestUrl),
    heroImageUrl: toStringOrNull(row.heroImageUrl),
    videoUrl: toStringOrNull(row.videoUrl),
    videoFileUrl: toStringOrNull(row.videoFileUrl),
    videoPosterUrl: toStringOrNull(row.videoPosterUrl),
    leads,
    pointsValue,
    pointsLabel: pointsLabel || "Updated weekly",
    pointsUpdatedAt: toStringOrNull(row.pointsUpdatedAt),
    events: normalizeEvents(row.events),
    links: normalizeLinks(row.links),
    notices: normalizeNotices(row.notices),
    downloads: normalizeDownloads(row.downloadItems, row.legacyDownloads),
    updates: normalizeUpdates(row.updates),
  } satisfies HouseDetail;
}
