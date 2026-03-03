import { NextResponse } from "next/server";
import { answerSchoolQuestion } from "../../../lib/schoolAssistant";

type AssistantRequestBody = {
  question?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequestBody;
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (question.length < 2) {
      return NextResponse.json(
        {
          error: "Please ask a fuller question so I can help.",
        },
        { status: 400 }
      );
    }

    if (question.length > 800) {
      return NextResponse.json(
        {
          error: "Question is too long. Please keep it under 800 characters.",
        },
        { status: 400 }
      );
    }

    const result = answerSchoolQuestion(question);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Assistant is temporarily unavailable. Please contact reception.",
      },
      { status: 500 }
    );
  }
}
