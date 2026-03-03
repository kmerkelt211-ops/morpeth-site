export type AssistantSource = {
  label: string;
  href: string;
};

export type AssistantResult = {
  status: "answered" | "escalate";
  answer: string;
  confidence: number;
  sources: AssistantSource[];
  followUps: string[];
};

type KnowledgeEntry = {
  id: string;
  keywords: string[];
  answer: string;
  sources: AssistantSource[];
  followUps: string[];
};

const ESCALATION_SOURCES: AssistantSource[] = [
  { label: "Contact school reception", href: "/contact#message" },
  { label: "Call: 020 8981 0921", href: "tel:+442089810921" },
  { label: "Email: info@morpeth.towerhamlets.sch.uk", href: "mailto:info@morpeth.towerhamlets.sch.uk" },
];

const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "term-dates",
    keywords: ["term date", "term dates", "half term", "inset", "holiday", "break", "academic year"],
    answer:
      "Term dates, holiday periods and INSET days are published on the Term Dates page. That is the official source for current and upcoming dates.",
    sources: [{ label: "Term dates", href: "/term-dates" }],
    followUps: ["Do you need dates for a specific term or year group?"],
  },
  {
    id: "uniform",
    keywords: ["uniform", "blazer", "pe kit", "school shoes", "equipment", "dress code"],
    answer:
      "Uniform and equipment expectations are listed in the Parents area, including practical guidance families use day to day.",
    sources: [{ label: "Parents hub", href: "/parents" }],
    followUps: ["Do you need uniform guidance for a specific year group?"],
  },
  {
    id: "transport",
    keywords: ["transport", "travel", "bus", "tube", "journey", "how to get", "directions", "location"],
    answer:
      "Travel and location details are available on the Contact page, including map links and school address information.",
    sources: [{ label: "Contact and directions", href: "/contact" }],
    followUps: ["Would you like public transport directions or drop-off guidance?"],
  },
  {
    id: "clubs",
    keywords: ["club", "clubs", "extracurricular", "enrichment", "timetable", "robotics", "drama", "sports"],
    answer:
      "Clubs and enrichment opportunities are published in the Extracurricular section, including flexible timetable information.",
    sources: [{ label: "Extracurricular and clubs", href: "/extracurricular" }],
    followUps: ["Are you looking for sports, arts, STEM or study support clubs?"],
  },
  {
    id: "admissions",
    keywords: ["admission", "admissions", "apply", "application", "open day", "visit", "year 5", "year 6"],
    answer:
      "Admissions steps are shown in the Admissions Pathway with enquiry, guidance and application actions in one place.",
    sources: [
      { label: "Admissions pathway", href: "/#admissions-pathway" },
      { label: "Contact admissions team", href: "/contact#message" },
    ],
    followUps: ["Do you want help with visit booking or local authority application steps?"],
  },
  {
    id: "calendar-events",
    keywords: ["calendar", "event", "events", "key date", "what's on", "upcoming"],
    answer:
      "Upcoming school events and key dates are listed in the calendar area and updated as events are published.",
    sources: [{ label: "School calendar", href: "/calendar" }],
    followUps: ["Do you want events for this month or a specific activity?"],
  },
  {
    id: "lunches",
    keywords: ["lunch", "menu", "meal", "food", "canteen", "ipay", "meal payment"],
    answer:
      "School meal information, current menu documents and payment guidance are available on the School Lunches page.",
    sources: [{ label: "School lunches", href: "/school-lunches" }],
    followUps: ["Do you need the latest menu file or meal payment support?"],
  },
  {
    id: "letters-home",
    keywords: ["letter", "letters", "newsletter", "home communication", "notice"],
    answer:
      "Recent letters and parent communications are published in the Letters Home section.",
    sources: [{ label: "Letters home", href: "/letters-home" }],
    followUps: ["Are you trying to find a specific letter topic or date?"],
  },
  {
    id: "edulink",
    keywords: ["edulink", "login", "app", "parent app", "student app", "password"],
    answer:
      "Edulink access and setup help are available on the Edulink page, including direct login guidance.",
    sources: [{ label: "Edulink support", href: "/edulink" }],
    followUps: ["Do you need login help for parent access or student access?"],
  },
];

const urgentKeywords = [
  "safeguarding",
  "abuse",
  "harm",
  "suicide",
  "self harm",
  "urgent",
  "emergency",
  "danger",
];

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function keywordScore(input: string, keywords: string[]): number {
  return keywords.reduce((score, keyword) => {
    return input.includes(keyword) ? score + 1 : score;
  }, 0);
}

function escalateResponse(reason: string): AssistantResult {
  const baseAnswer =
    reason === "urgent"
      ? "This sounds urgent, so please contact school staff directly now. If someone is in immediate danger, call emergency services."
      : "I am not confident enough to answer this safely from published school information. Please contact staff so you get the correct guidance.";

  return {
    status: "escalate",
    answer: baseAnswer,
    confidence: 0.1,
    sources: ESCALATION_SOURCES,
    followUps: ["If helpful, share the exact question and staff can respond directly."],
  };
}

export function answerSchoolQuestion(question: string): AssistantResult {
  const normalizedQuestion = normalize(question);
  if (!normalizedQuestion) {
    return {
      status: "answered",
      answer: "Ask me about admissions, term dates, uniforms, lunches, clubs, calendar events, Edulink or parent communications.",
      confidence: 0.4,
      sources: [],
      followUps: ["For example: What are the current term dates?"],
    };
  }

  if (urgentKeywords.some((keyword) => normalizedQuestion.includes(keyword))) {
    return escalateResponse("urgent");
  }

  const ranked = knowledgeBase
    .map((entry) => ({ entry, score: keywordScore(normalizedQuestion, entry.keywords) }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const second = ranked[1];

  if (!top || top.score < 1) {
    return escalateResponse("low-confidence");
  }

  const confidence = Math.min(0.95, 0.45 + top.score * 0.18);
  const ambiguous = second && top.score - second.score < 1;
  if (ambiguous && top.score < 3) {
    return {
      status: "escalate",
      answer:
        "I found related topics but your question could mean more than one thing. Please contact staff for a precise answer, or ask with more detail.",
      confidence: 0.35,
      sources: [...top.entry.sources, ...ESCALATION_SOURCES],
      followUps: top.entry.followUps,
    };
  }

  return {
    status: "answered",
    answer: top.entry.answer,
    confidence,
    sources: top.entry.sources,
    followUps: top.entry.followUps,
  };
}
