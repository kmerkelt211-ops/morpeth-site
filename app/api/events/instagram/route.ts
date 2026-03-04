import { NextResponse } from "next/server";
import { fetchInstagramNewsPosts } from "../../../../lib/instagramFeed";

export const revalidate = 300;

function parseLimit(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 200;
  return Math.max(1, Math.min(Math.trunc(parsed), 200));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseLimit(searchParams.get("limit"));
  const posts = await fetchInstagramNewsPosts({ limit, revalidateSeconds: revalidate });
  return NextResponse.json(posts);
}
