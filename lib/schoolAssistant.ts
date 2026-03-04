import "server-only";

import { client } from "../sanity/client";
import { DEFAULT_SUBJECTS, type SubjectCard } from "./subjectCatalog";

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

type KnowledgeCategory = "general" | "subject";

type KnowledgeEntry = {
  id: string;
  category: KnowledgeCategory;
  displayName?: string;
  keywords: string[];
  answer: string;
  sources: AssistantSource[];
  followUps: string[];
};

type RankedEntry = {
  entry: KnowledgeEntry;
  score: number;
  phraseHits: number;
  tokenHits: number;
  exactMatch: boolean;
};

const ESCALATION_SOURCES: AssistantSource[] = [
  { label: "Contact school reception", href: "/contact#message" },
  { label: "Call: 020 8981 0921", href: "tel:+442089810921" },
  { label: "Email: info@morpeth.towerhamlets.sch.uk", href: "mailto:info@morpeth.towerhamlets.sch.uk" },
];

const CURRICULUM_SOURCES: AssistantSource[] = [
  { label: "Teaching and learning", href: "/teaching-learning" },
  { label: "Explore subjects", href: "/teaching-learning#subjects" },
];

const SUBJECTS_QUERY = `*[_type == "teachingLearningPage"][0].subjects.items[]{
  id,
  name,
  phase,
  description
}`;
const SUBJECT_CACHE_TTL_MS = 5 * 60 * 1000;

const GENERAL_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: "term-dates",
    category: "general",
    keywords: ["term date", "term dates", "half term", "inset", "holiday", "break", "academic year"],
    answer:
      "Term dates, holiday periods and INSET days are published on the Term Dates page. That is the official source for current and upcoming dates.",
    sources: [{ label: "Term dates", href: "/term-dates" }],
    followUps: ["Do you need dates for a specific term or year group?"],
  },
  {
    id: "uniform",
    category: "general",
    keywords: ["uniform", "blazer", "pe kit", "school shoes", "equipment", "dress code"],
    answer:
      "Uniform and equipment expectations are listed in the Parents area, including practical guidance families use day to day.",
    sources: [{ label: "Parents hub", href: "/parents" }],
    followUps: ["Do you need uniform guidance for a specific year group?"],
  },
  {
    id: "transport",
    category: "general",
    keywords: ["transport", "travel", "bus", "tube", "journey", "how to get", "directions", "location"],
    answer:
      "Travel and location details are available on the Contact page, including map links and school address information.",
    sources: [{ label: "Contact and directions", href: "/contact" }],
    followUps: ["Would you like public transport directions or drop-off guidance?"],
  },
  {
    id: "clubs",
    category: "general",
    keywords: ["club", "clubs", "extracurricular", "enrichment", "timetable", "robotics", "drama", "sports"],
    answer:
      "Clubs and enrichment opportunities are published in the Extracurricular section, including flexible timetable information.",
    sources: [{ label: "Extracurricular and clubs", href: "/extracurricular" }],
    followUps: ["Are you looking for sports, arts, STEM or study support clubs?"],
  },
  {
    id: "admissions",
    category: "general",
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
    category: "general",
    keywords: ["calendar", "event", "events", "key date", "what's on", "upcoming"],
    answer:
      "Upcoming school events and key dates are listed in the calendar area and updated as events are published.",
    sources: [{ label: "School calendar", href: "/calendar" }],
    followUps: ["Do you want events for this month or a specific activity?"],
  },
  {
    id: "lunches",
    category: "general",
    keywords: ["lunch", "menu", "meal", "food", "canteen", "ipay", "meal payment"],
    answer:
      "School meal information, current menu documents and payment guidance are available on the School Lunches page.",
    sources: [{ label: "School lunches", href: "/school-lunches" }],
    followUps: ["Do you need the latest menu file or meal payment support?"],
  },
  {
    id: "letters-home",
    category: "general",
    keywords: ["letter", "letters", "newsletter", "home communication", "notice"],
    answer: "Recent letters and parent communications are published in the Letters Home section.",
    sources: [{ label: "Letters home", href: "/letters-home" }],
    followUps: ["Are you trying to find a specific letter topic or date?"],
  },
  {
    id: "edulink",
    category: "general",
    keywords: ["edulink", "login", "app", "parent app", "student app", "password"],
    answer:
      "Edulink access and setup help are available on the Edulink page, including direct login guidance.",
    sources: [{ label: "Edulink support", href: "/edulink" }],
    followUps: ["Do you need login help for parent access or student access?"],
  },
];

const SUBJECT_ALIASES: Record<string, string[]> = {
  "art-photography": ["art", "photography", "art and photography"],
  "business-economics": ["business", "economics", "enterprise"],
  "careers-programme": ["careers", "career", "work experience"],
  "computing-ict": ["computing", "ict", "computer science", "programming", "coding"],
  cpshe: ["cpshe", "pshe", "rse", "personal social health education"],
  "design-technology": [
    "design and technology",
    "design technology",
    "dt",
    "food technology",
    "textiles",
    "product design",
    "resistant materials",
  ],
  drama: ["drama", "performing arts"],
  "digital-media": ["digital media", "creative media", "content creation", "media production"],
  english: ["english", "literature", "language"],
  "film-studies": ["film studies", "film", "cinema studies"],
  geography: ["geography"],
  "gov-politics-citizenship": ["government", "politics", "citizenship", "political studies"],
  history: ["history"],
  humanities: ["humanities"],
  maths: ["maths", "math", "mathematics"],
  "media-studies": ["media studies", "media"],
  mfl: ["mfl", "modern foreign languages", "french", "spanish", "bengali", "languages"],
  music: ["music"],
  pe: ["pe", "physical education", "sport", "sports"],
  psychology: ["psychology"],
  rs: ["rs", "religious studies", "religion", "ethics"],
  science: ["science", "biology", "chemistry", "physics"],
  sen: ["sen", "send", "special educational needs", "learning support"],
  "sociology-health-social-care": [
    "sociology",
    "health and social care",
    "health social care",
    "social care",
  ],
};

const CURRICULUM_INTENT_KEYWORDS = [
  "subject",
  "subjects",
  "curriculum",
  "course",
  "courses",
  "ks3",
  "ks4",
  "ks5",
  "gcse",
  "a level",
  "alevel",
  "lesson",
  "class",
];

const URGENT_KEYWORDS = ["safeguarding", "abuse", "harm", "suicide", "self harm", "urgent", "emergency", "danger"];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "me",
  "of",
  "on",
  "the",
  "to",
  "what",
  "where",
  "which",
  "with",
  "year",
]);

type SubjectCacheValue = {
  expiresAt: number;
  subjects: SubjectCard[];
};

let subjectCache: SubjectCacheValue | null = null;
let subjectLoadPromise: Promise<SubjectCard[]> | null = null;

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => normalize(value)).filter(Boolean)));
}

function uniqueSources(sources: AssistantSource[]): AssistantSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.label}|${source.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function slugify(value: string): string {
  return normalize(value).replace(/\s+/g, "-");
}

function normalizeSubjectRows(rows: Array<Partial<SubjectCard>> | null | undefined): SubjectCard[] {
  if (!Array.isArray(rows) || rows.length === 0) {
    return DEFAULT_SUBJECTS;
  }

  const sanitized: SubjectCard[] = [];
  for (const row of rows) {
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) continue;

    const idCandidate = typeof row.id === "string" ? row.id.trim() : "";
    const id = idCandidate || slugify(name);
    const phase = typeof row.phase === "string" ? row.phase.trim() : "";
    const description = typeof row.description === "string" ? row.description.trim() : "";

    const subject: SubjectCard = {
      id,
      name,
      phase: phase || undefined,
      description: description || undefined,
    };
    sanitized.push(subject);
  }

  if (sanitized.length === 0) {
    return DEFAULT_SUBJECTS;
  }

  const uniqueById = new Map<string, SubjectCard>();
  for (const subject of sanitized) {
    if (!uniqueById.has(subject.id)) {
      uniqueById.set(subject.id, subject);
    }
  }

  return Array.from(uniqueById.values());
}

async function loadSubjectsFromSanity(): Promise<SubjectCard[]> {
  const now = Date.now();
  if (subjectCache && subjectCache.expiresAt > now) {
    return subjectCache.subjects;
  }

  if (subjectLoadPromise) {
    return subjectLoadPromise;
  }

  subjectLoadPromise = client
    .fetch<Array<Partial<SubjectCard>> | null>(SUBJECTS_QUERY)
    .then((rows) => normalizeSubjectRows(rows))
    .catch(() => DEFAULT_SUBJECTS)
    .finally(() => {
      subjectLoadPromise = null;
    });

  const subjects = await subjectLoadPromise;
  subjectCache = {
    subjects,
    expiresAt: Date.now() + SUBJECT_CACHE_TTL_MS,
  };

  return subjects;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesKeyword(query: string, keyword: string): boolean {
  if (keyword.length <= 2) {
    const wordBoundary = new RegExp(`(^|\\s)${escapeRegExp(keyword)}(\\s|$)`);
    return wordBoundary.test(query);
  }
  return query.includes(keyword);
}

function scoreEntry(question: string, questionTokens: string[], entry: KnowledgeEntry): RankedEntry {
  let phraseHits = 0;
  let tokenHits = 0;
  let exactMatch = false;
  const keywordTokens = new Set<string>();

  for (const keyword of entry.keywords) {
    const normalizedKeyword = normalize(keyword);
    if (!normalizedKeyword) continue;

    if (question === normalizedKeyword) {
      exactMatch = true;
      phraseHits += 2;
    } else if (includesKeyword(question, normalizedKeyword)) {
      phraseHits += 1;
    }

    for (const token of tokenize(normalizedKeyword)) {
      keywordTokens.add(token);
    }
  }

  for (const token of questionTokens) {
    if (keywordTokens.has(token)) tokenHits += 1;
  }

  const score = phraseHits * 2.5 + tokenHits * 0.7 + (exactMatch ? 1.5 : 0);
  return { entry, score, phraseHits, tokenHits, exactMatch };
}

function createSubjectKnowledgeEntry(subject: SubjectCard): KnowledgeEntry {
  const baseAliases = SUBJECT_ALIASES[subject.id] ?? [];
  const autoAliases = [
    subject.name,
    subject.name.replace(/ and /gi, " & "),
    subject.name.replace(/ & /gi, " and "),
    subject.id.replace(/-/g, " "),
  ];
  const keywords = unique([...baseAliases, ...autoAliases]);
  const phase = subject.phase ? `${subject.phase} at Morpeth.` : "at Morpeth.";
  const description = subject.description ?? "You can find curriculum details in the Teaching and Learning section.";

  return {
    id: `subject-${subject.id}`,
    category: "subject",
    displayName: subject.name,
    keywords,
    answer: `${subject.name} is available for ${phase} ${description}`,
    sources: [
      { label: `${subject.name} in subjects`, href: "/teaching-learning#subjects" },
      { label: "Teaching and learning", href: "/teaching-learning" },
    ],
    followUps: [`Do you want details for ${subject.name} in a specific key stage?`],
  };
}

function escalateResponse(reason: "urgent" | "low-confidence"): AssistantResult {
  const answer =
    reason === "urgent"
      ? "This sounds urgent, so please contact school staff directly now. If someone is in immediate danger, call emergency services."
      : "I am not confident enough to answer this safely from published school information. Please contact staff so you get the correct guidance.";

  return {
    status: "escalate",
    answer,
    confidence: 0.1,
    sources: ESCALATION_SOURCES,
    followUps: ["If helpful, share the exact question and staff can respond directly."],
  };
}

function curriculumFallbackResponse(): AssistantResult {
  return {
    status: "answered",
    answer:
      "You can browse subject and curriculum information in Teaching and Learning. Use the subjects section to search by subject name and key stage.",
    confidence: 0.42,
    sources: CURRICULUM_SOURCES,
    followUps: ["Try asking with a subject name, for example: Digital Media, Maths, or Film Studies."],
  };
}

function isCurriculumIntent(question: string, questionTokens: string[]): boolean {
  return CURRICULUM_INTENT_KEYWORDS.some((keyword) => includesKeyword(question, normalize(keyword))) ||
    questionTokens.some((token) => CURRICULUM_INTENT_KEYWORDS.includes(token));
}

export async function answerSchoolQuestion(question: string): Promise<AssistantResult> {
  const normalizedQuestion = normalize(question);
  if (!normalizedQuestion) {
    return {
      status: "answered",
      answer:
        "Ask me about admissions, term dates, uniforms, lunches, clubs, Edulink, or school subjects and curriculum.",
      confidence: 0.4,
      sources: [],
      followUps: ["For example: Tell me about Digital Media or What are the current term dates?"],
    };
  }

  if (URGENT_KEYWORDS.some((keyword) => includesKeyword(normalizedQuestion, normalize(keyword)))) {
    return escalateResponse("urgent");
  }

  const questionTokens = tokenize(normalizedQuestion);
  const subjects = await loadSubjectsFromSanity();
  const subjectKnowledgeBase = subjects.map(createSubjectKnowledgeEntry);
  const knowledgeBase = [...GENERAL_KNOWLEDGE_BASE, ...subjectKnowledgeBase];
  const ranked = knowledgeBase
    .map((entry) => scoreEntry(normalizedQuestion, questionTokens, entry))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const second = ranked[1];

  if (!top || top.score < 1.8) {
    if (isCurriculumIntent(normalizedQuestion, questionTokens)) {
      return curriculumFallbackResponse();
    }
    return escalateResponse("low-confidence");
  }

  const closeMatch = second && top.score - second.score < 1.1;
  const bothSubjects = closeMatch && second && top.entry.category === "subject" && second.entry.category === "subject";

  if (bothSubjects) {
    const topLabel = top.entry.displayName ?? top.entry.id.replace("subject-", "").replace(/-/g, " ");
    const secondLabel = second.entry.displayName ?? second.entry.id.replace("subject-", "").replace(/-/g, " ");
    return {
      status: "answered",
      answer: `I found more than one subject match: ${topLabel} and ${secondLabel}. Choose one and I can narrow it down further.`,
      confidence: 0.52,
      sources: CURRICULUM_SOURCES,
      followUps: ["Reply with the exact subject name and, if useful, the key stage (KS3, KS4, or KS5)."],
    };
  }

  const confidence = Math.min(
    0.96,
    0.45 + top.phraseHits * 0.14 + top.tokenHits * 0.05 + (top.exactMatch ? 0.1 : 0)
  );

  return {
    status: "answered",
    answer: top.entry.answer,
    confidence,
    sources: uniqueSources(top.entry.sources),
    followUps: top.entry.followUps,
  };
}
