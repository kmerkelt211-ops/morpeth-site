export type RemoteMediaAsset = {
  url?: string | null;
  size?: number | null;
};

// Shared autoplay/looping media budget for homepage-style surfaces.
// This does not apply to every Sanity asset on the site. It is only used by
// the lightweight "instant render" media paths that should stay fast on first load.
// If an uploaded remote video is larger than this, the UI should fall back to a
// poster image, static image, or a deliberate non-autoplay treatment instead.
export const MAX_AUTOPLAY_MEDIA_BYTES = 12 * 1024 * 1024;

export function cleanMediaText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function pickRemoteMediaUrl(
  asset?: RemoteMediaAsset | null,
  maxBytes = MAX_AUTOPLAY_MEDIA_BYTES,
): string | null {
  if (!asset) return null;
  const url = cleanMediaText(asset.url);
  if (!url) return null;
  if (typeof asset.size === "number" && asset.size > maxBytes) return null;
  return url;
}
