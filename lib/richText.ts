type HtmlReplacement = {
  pattern: RegExp;
  replacement: string;
};

const HTML_REPLACEMENTS: HtmlReplacement[] = [
  { pattern: /<\s*br\s*\/?>/gi, replacement: "\n" },
  { pattern: /<\s*\/p\s*>/gi, replacement: "\n\n" },
  { pattern: /<\s*\/div\s*>/gi, replacement: "\n\n" },
  { pattern: /<\s*\/li\s*>/gi, replacement: "\n" },
  { pattern: /<\s*li[^>]*>/gi, replacement: "- " },
  { pattern: /<\s*\/h[1-6]\s*>/gi, replacement: "\n\n" },
];

export function stripHtmlToPlainText(value: string | undefined): string {
  if (!value) return "";

  let text = value;
  for (const { pattern, replacement } of HTML_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }

  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
