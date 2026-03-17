import { NextResponse } from "next/server";
import { loadParentsPageContent } from "../../../lib/contentLoaders";

export async function GET() {
  try {
    const data = await loadParentsPageContent();
    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error("Failed to fetch parents page data", error);
    return NextResponse.json({}, { status: 500 });
  }
}
