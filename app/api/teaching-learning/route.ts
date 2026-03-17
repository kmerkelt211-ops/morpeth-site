import { NextResponse } from "next/server";
import { loadTeachingLearningPageContent } from "../../../lib/contentLoaders";

export async function GET() {
  try {
    const data = await loadTeachingLearningPageContent();
    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error("Failed to fetch teaching-learning page data", error);
    return NextResponse.json({}, { status: 500 });
  }
}
