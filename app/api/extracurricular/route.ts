import { NextResponse } from "next/server";
import { loadExtracurricularPageContent } from "../../../lib/contentLoaders";
export const revalidate = 600;

export async function GET() {
  try {
    const data = await loadExtracurricularPageContent();
    return NextResponse.json(data ?? {}, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Failed to fetch extracurricular page data", error);
    return NextResponse.json(
      {},
      {
        status: 500,
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  }
}
