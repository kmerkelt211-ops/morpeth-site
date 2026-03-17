export function validateAssistantQuestion(question: string): string | null {
  if (question.length < 2) {
    return "Please ask a fuller question so I can help.";
  }

  if (question.length > 800) {
    return "Question is too long. Please keep it under 800 characters.";
  }

  return null;
}
