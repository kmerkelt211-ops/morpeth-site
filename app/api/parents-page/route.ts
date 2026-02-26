import { NextResponse } from "next/server";
import { client } from "../../../sanity/client";

const QUERY = `*[_type == "parentsPage"][0]{
  attendanceCard{
    eyebrow,
    title,
    description,
    phoneLabel,
    phoneDisplay,
    phoneHref,
    emailLabel,
    emailAddress,
    buttonLabel
  },
  attendanceModal{
    heading,
    whyTitle,
    whyParagraphs,
    scaleTitle,
    scaleIntroParagraphs,
    scaleRows[]{
      judgement,
      attendance,
      daysAbsent,
      tone,
      summaryText
    },
    summaryTitle,
    reportingTitle,
    reportingParagraphs,
    reportingPhoneLabel,
    reportingPhoneDisplay,
    reportingPhoneHref,
    reportingEmailLabel,
    reportingEmailAddress,
    punctualityTitle,
    punctualityParagraphs,
    concernTitle,
    concernParagraphs,
    termTimeTitle,
    termTimeParagraphs,
    policyTitle,
    policyParagraphs,
    policyButtonLabel,
    policyButtonHref
  }
}`;

export async function GET() {
  try {
    const data = await client.fetch(QUERY);
    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error("Failed to fetch parents page data", error);
    return NextResponse.json({}, { status: 500 });
  }
}
