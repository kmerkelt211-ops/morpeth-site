import { serverEnv } from "./env";

const INSTAGRAM_API_BASE = "https://graph.instagram.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const PAGE_SIZE = 25;
const MAX_PAGES = 10;

type InstagramMediaChild = {
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
};

type InstagramMediaItem = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: {
    data?: InstagramMediaChild[];
  };
};

type InstagramMediaResponse = {
  data?: InstagramMediaItem[];
  paging?: {
    next?: string;
  };
};

export type InstagramNewsPost = {
  id: string;
  title: string;
  href: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type FetchInstagramOptions = {
  limit?: number;
  revalidateSeconds?: number;
};

function pickImageUrl(item: InstagramMediaItem): string | undefined {
  if (item.media_type === "VIDEO") {
    return item.thumbnail_url || item.media_url || undefined;
  }

  if (item.media_type === "CAROUSEL_ALBUM") {
    const child = item.children?.data?.find((entry) => entry.media_url || entry.thumbnail_url);
    return child?.media_url || child?.thumbnail_url || item.media_url || item.thumbnail_url || undefined;
  }

  return item.media_url || item.thumbnail_url || undefined;
}

function toTitle(caption: string | undefined): string {
  const firstLine = (caption || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!firstLine) return "Instagram post";
  return firstLine.length > 88 ? `${firstLine.slice(0, 85)}...` : firstLine;
}

function toNewsPost(item: InstagramMediaItem): InstagramNewsPost | null {
  const permalink = item.permalink?.trim();
  const timestamp = item.timestamp?.trim();
  const id = item.id?.trim();

  if (!permalink || !timestamp || !id) return null;

  const caption = item.caption?.trim();
  const imageUrl = pickImageUrl(item);

  return {
    id,
    title: toTitle(caption),
    href: permalink,
    date: timestamp,
    excerpt: caption || undefined,
    imageUrl,
    imageAlt: caption || "Instagram post",
  };
}

function buildFirstPageUrl(accessToken: string, userId?: string): string {
  const endpoint = userId ? `/${encodeURIComponent(userId)}/media` : "/me/media";
  const url = new URL(`${INSTAGRAM_API_BASE}${endpoint}`);

  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}"
  );
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("access_token", accessToken);

  return url.toString();
}

export async function fetchInstagramNewsPosts(options: FetchInstagramOptions = {}): Promise<InstagramNewsPost[]> {
  const accessToken = serverEnv.instagramAccessToken;
  const userId = serverEnv.instagramUserId;
  const limit = Math.max(1, Math.min(options.limit ?? 200, 200));
  const revalidateSeconds = Math.max(30, options.revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS);

  if (!accessToken) return [];

  const firstPageUrls = userId
    ? [buildFirstPageUrl(accessToken, userId), buildFirstPageUrl(accessToken)]
    : [buildFirstPageUrl(accessToken)];

  for (const firstPageUrl of firstPageUrls) {
    const collected: InstagramNewsPost[] = [];
    let nextUrl: string | undefined = firstPageUrl;
    let pageCount = 0;

    while (nextUrl && collected.length < limit && pageCount < MAX_PAGES) {
      pageCount += 1;

      try {
        const response = await fetch(nextUrl, {
          next: { revalidate: revalidateSeconds },
        });

        if (!response.ok) {
          const body = await response.text();
          console.error("Instagram API error", response.status, body.slice(0, 300));
          break;
        }

        const payload = (await response.json()) as InstagramMediaResponse;
        const items = Array.isArray(payload.data) ? payload.data : [];

        for (const item of items) {
          const post = toNewsPost(item);
          if (post) {
            collected.push(post);
            if (collected.length >= limit) break;
          }
        }

        nextUrl = payload.paging?.next;
      } catch (error) {
        console.error("Instagram fetch failed", error);
        break;
      }
    }

    if (collected.length > 0) {
      return collected
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
  }

  return [];
}
