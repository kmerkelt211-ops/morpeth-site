import { jsonError, jsonOk } from "../../../lib/apiResponses";
import { answerSchoolQuestion } from "../../../lib/schoolAssistant";
import { validateAssistantQuestion } from "../../../lib/schoolAssistantValidation";

type AssistantRequestBody = {
  question?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequestBody;
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const validationError = validateAssistantQuestion(question);

    if (validationError) {
      return jsonError(validationError, { status: 400 });
    }

    const result = await answerSchoolQuestion(question);
    return jsonOk(result);
  } catch {
    return jsonError("Assistant is temporarily unavailable. Please contact reception.", { status: 500 });
  }
}
