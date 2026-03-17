"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState, type SVGProps } from "react";
import { DEFAULT_SUBJECTS, type SubjectCard } from "../../lib/subjectCatalog";
import HeroVideo from "../components/HeroVideo";

type Ks3Feature = {
  id: string;
  title: string;
  description: string;
  icon: "book" | "users" | "language" | "stars";
};

type SupportCard = {
  id: string;
  title: string;
  intro: string;
  details: string[];
  note?: string;
  imageUrl?: string;
  imageFileUrl?: string;
  imageAlt?: string;
};

type TeachingLearningContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  onPage: {
    eyebrow: string;
    title: string;
    description: string;
    links: Array<{ label: string; href: string }>;
  };
  ks3: {
    eyebrow: string;
    title: string;
    description: string;
    subjects: string[];
    features: Ks3Feature[];
    details: Array<{ title: string; paragraphs: string[] }>;
  };
  subjects: {
    eyebrow: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    emptyText: string;
    items: SubjectCard[];
  };
  support: {
    cards: SupportCard[];
  };
  modal: {
    comingSoonText: string;
    fallbackDescription: string;
    footerText: string;
  };
};

const DEFAULT_CONTENT: TeachingLearningContent = {
  hero: {
    eyebrow: "TEACHING & LEARNING",
    title: "Subjects at Morpeth",
    description:
      "Explore each subject to find out more about what students study, how learning is organised across the year groups, and what support is available. Each subject page will include a short video from staff and further information about the course.",
  },
  onPage: {
    eyebrow: "ON THIS PAGE",
    title: "Teaching & learning at Morpeth",
    description:
      "An overview of our curriculum from Key Stage 3 through to Sixth Form, with a quick way to explore subjects and the support we provide to help every student thrive.",
    links: [
      { label: "KS3 overview", href: "#ks3" },
      { label: "Explore subjects", href: "#subjects" },
      { label: "Support & guidance", href: "#support" },
    ],
  },
  ks3: {
    eyebrow: "KEY STAGE 3",
    title: "A broad, balanced foundation for Years 7–9",
    description:
      "KS3 at Morpeth builds strong subject knowledge, confidence and curiosity. Pupils study a wide range of subjects so they can discover interests, develop core skills and be well prepared for Key Stage 4.",
    subjects: [
      "Art",
      "Drama",
      "Design & Technology",
      "English",
      "Geography",
      "History",
      "Computing & ICT",
      "Maths",
      "Modern Foreign Languages",
      "Music",
      "PE",
      "Religious Studies",
      "Science",
    ],
    features: [
      {
        id: "subjects",
        title: "What pupils study",
        description:
          "A broad range across Art, Drama, DT, English, Humanities, MFL, Music, PE and Science gives a strong foundation.",
        icon: "book",
      },
      {
        id: "grouping",
        title: "How classes are organised",
        description:
          "Mixed prior-attainment classes in most subjects. Maths uses setting from the beginning of Year 8.",
        icon: "users",
      },
      {
        id: "dt-mfl",
        title: "DT carousel & MFL options",
        description:
          "DT rotates Food, Product and Resistant Materials. MFL starts with Spanish or French, with additional options later.",
        icon: "language",
      },
      {
        id: "beyond",
        title: "Beyond the classroom",
        description:
          "Clubs, trips and competitions extend learning and build confidence, curiosity and cultural capital.",
        icon: "stars",
      },
    ],
    details: [
      {
        title: "Subjects studied at KS3",
        paragraphs: [
          "Pupils build their knowledge and skills in Art, Drama, Design & Technology (DT), English, Geography, History, Computing & ICT, Maths, Modern Foreign Languages (MFL), Music, Physical Education (PE), Religious Studies (RS) and Science.",
        ],
      },
      {
        title: "How classes are organised",
        paragraphs: [
          "Pupils in Year 7 have a lesson a fortnight focusing on oracy. Pupils are taught in mixed prior-attainment groupings in all subjects apart from Maths, which operates a setting system from the beginning of Year 8.",
        ],
      },
      {
        title: "Design & Technology and Modern Foreign Languages",
        paragraphs: [
          "In DT, pupils study Food Technology, Product Design and Resistant Materials on a carousel basis each year so that they experience all three disciplines.",
          "In MFL, pupils study either Spanish or French in Year 7 for two sessions a week, which they continue into Year 8. In Year 8, there is also the option for students who are very keen on languages to pick up a second language in the dual-language option, and Bengali is introduced as a single-language option.",
        ],
      },
      {
        title: "Beyond the classroom & further information",
        paragraphs: [
          "There is a wide range of extra-curricular activities on offer in many subject areas to support pupils' learning beyond the classroom.",
          "If you require further information about the curriculum, please contact us by phone on 020 8981 0921, or email enquiries@morpeth.towerhamlets.sch.uk.",
        ],
      },
    ],
  },
  subjects: {
    eyebrow: "SUBJECTS",
    title: "Explore our curriculum",
    description:
      "Search and filter to find a subject. Each card will link to a short video and key information as we build out the curriculum pages.",
    searchPlaceholder: "Search subjects...",
    emptyText: "No subjects match your search.",
    items: DEFAULT_SUBJECTS,
  },
  support: {
    cards: [
      {
        id: "library",
        title: "Library",
        intro:
          "Our library, led by Librarian James Nash with support from Kim Cunningham, holds around 10,500 books, including a large fiction collection, bilingual books and a wide range of dictionaries and special collections.",
        details: [
          "The library supports pupils with special educational needs by sourcing accessible formats such as large print, Braille and reader-friendly texts, as well as bilingual dictionaries and dual-language resources for newly arrived pupils.",
          "Alongside book stock there are digital resources, computers and printing facilities, plus a dedicated A-level and GCSE area with revision guides, textbooks, past papers and study skills materials.",
        ],
        note:
          "Students are encouraged to help develop the library by suggesting new books and can also apply to become Student Librarians, gaining leadership experience and rewards for their contribution.",
        imageUrl: "/images/library.webp",
        imageAlt: "Morpeth School library",
      },
      {
        id: "academic-coaching",
        title: "Academic coaching",
        intro:
          "Our academic coaching programme supports students to achieve at, or above, their target grades through focused small-group and one-to-one work in English and Maths. Coaches work closely with class teachers to reinforce key skills and build confidence.",
        details: [
          "Targeted Year 11 pupils typically work with a coach twice a week during the school day, followed by small-group sessions before or after school. Coaches also support groups in Years 7 and 8 with reading, writing and mathematical understanding.",
          "The programme runs across the year and may include sessions in half term and on Saturdays. We also work with external partners, including the National Tutoring Programme, to supplement the in-school offer.",
        ],
        note:
          "Academic coaching is an important part of our strategy to support students and ensure that all pupils can reach their full potential.",
        imageUrl: "/images/academic-coaching.webp",
        imageAlt: "Academic coaching in action",
      },
    ],
  },
  modal: {
    comingSoonText: "Subject video coming soon",
    fallbackDescription:
      "Information about this course, including topics studied, assessment and how families can support learning at home, will be added here soon.",
    footerText:
      "In future this section will be powered by content from our curriculum pages in Sanity, so that subject teams can keep information up to date.",
  },
};

const phaseFilters = [
  { value: "all", label: "All phases" },
  { value: "ks3", label: "KS3" },
  { value: "ks4", label: "KS4" },
  { value: "ks5", label: "KS5" },
  { value: "whole", label: "Whole school" },
];

const IconBook = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M6.5 4.75h7a3.75 3.75 0 0 1 3.75 3.75v10.5a.75.75 0 0 1-1.2.6l-.3-.225a5.25 5.25 0 0 0-3.15-1.025H6.5a2 2 0 0 0-2 2V6.75a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.5 4.75v13.5m0-11.5h7a3.5 3.5 0 0 1 3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconUsers = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M7.5 13.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm9 7a5 5 0 0 0-9 0m13-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-2 11a5 5 0 0 0-4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconLanguage = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M4 5h16M4 12h10M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13.5 5c0 0 0 6.5-6.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconStars = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M6 6l1.5 3L11 10.5 7.5 12 6 15l-1.5-3L1 10.5 4.5 9 6 6Zm10 2 2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const icons = {
  book: IconBook,
  users: IconUsers,
  language: IconLanguage,
  stars: IconStars,
} as const;

export type PartialTeachingContent = Partial<{
  hero: Partial<TeachingLearningContent["hero"]>;
  onPage: Partial<TeachingLearningContent["onPage"]>;
  ks3: Partial<TeachingLearningContent["ks3"]>;
  subjects: Partial<TeachingLearningContent["subjects"]>;
  support: Partial<TeachingLearningContent["support"]>;
  modal: Partial<TeachingLearningContent["modal"]>;
}>;

function normalizeNonEmptyArray<T>(candidate: T[] | undefined, fallback: T[]): T[] {
  if (Array.isArray(candidate) && candidate.length > 0) {
    return candidate;
  }
  return fallback;
}

function mergeTeachingContent(raw: PartialTeachingContent | null | undefined): TeachingLearningContent {
  if (!raw) return DEFAULT_CONTENT;

  const hero = { ...DEFAULT_CONTENT.hero, ...(raw.hero ?? {}) };
  const onPage = {
    ...DEFAULT_CONTENT.onPage,
    ...(raw.onPage ?? {}),
    links: normalizeNonEmptyArray(raw.onPage?.links, DEFAULT_CONTENT.onPage.links),
  };
  const ks3 = {
    ...DEFAULT_CONTENT.ks3,
    ...(raw.ks3 ?? {}),
    subjects: normalizeNonEmptyArray(raw.ks3?.subjects, DEFAULT_CONTENT.ks3.subjects),
    features: normalizeNonEmptyArray(raw.ks3?.features, DEFAULT_CONTENT.ks3.features),
    details: normalizeNonEmptyArray(raw.ks3?.details, DEFAULT_CONTENT.ks3.details),
  };
  const subjects = {
    ...DEFAULT_CONTENT.subjects,
    ...(raw.subjects ?? {}),
    items: normalizeNonEmptyArray(raw.subjects?.items, DEFAULT_CONTENT.subjects.items),
  };
  const support = {
    ...DEFAULT_CONTENT.support,
    ...(raw.support ?? {}),
    cards: normalizeNonEmptyArray(raw.support?.cards, DEFAULT_CONTENT.support.cards),
  };
  const modal = { ...DEFAULT_CONTENT.modal, ...(raw.modal ?? {}) };

  return { hero, onPage, ks3, subjects, support, modal };
}

function isYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function toYoutubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "");
      return `https://www.youtube.com/embed/${id}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      const split = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = split.findIndex((part) => part === "embed");
      if (embedIndex >= 0 && split[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${split[embedIndex + 1]}`;
      }
    }
  } catch {
    return url;
  }

  return url;
}

function getSubjectImage(subject: SubjectCard): string {
  return subject.imageFileUrl || subject.imageUrl || `/images/${subject.id}.webp`;
}

function getSubjectVideo(subject: SubjectCard | null): string {
  if (!subject) return "";
  return subject.videoFileUrl || subject.videoUrl || "";
}

type TeachingLearningPageClientProps = {
  initialContent?: PartialTeachingContent | null;
};

export default function TeachingLearningPageClient({
  initialContent,
}: TeachingLearningPageClientProps) {
  const [content] = useState<TeachingLearningContent>(() =>
    mergeTeachingContent(initialContent)
  );
  const [activeSubject, setActiveSubject] = useState<SubjectCard | null>(null);
  const [libraryExpanded, setLibraryExpanded] = useState(false);
  const [coachingExpanded, setCoachingExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");

  const filteredSubjects = useMemo(() => {
    return content.subjects.items.filter((subject) => {
      const nameMatch = subject.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (!nameMatch) return false;
      if (phaseFilter === "all") return true;
      return (subject.phase || "").toLowerCase().includes(phaseFilter);
    });
  }, [content.subjects.items, phaseFilter, searchQuery]);

  const supportCards = content.support.cards;
  const libraryCard = supportCards[0] ?? DEFAULT_CONTENT.support.cards[0];
  const coachingCard = supportCards[1] ?? DEFAULT_CONTENT.support.cards[1];

  const activeVideo = getSubjectVideo(activeSubject);
  const activeVideoIsYoutube = activeVideo ? isYoutubeUrl(activeVideo) : false;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-slate-900 text-slate-50">
        <HeroVideo src="/video/morpeth-drone-hero.mp4" pageKey="teachingLearning" />

        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-morpeth-light/75">{content.hero.eyebrow}</p>
          <h1 className="mt-5 font-heading text-3xl uppercase tracking-[0.14em] text-morpeth-light sm:text-4xl md:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-morpeth-light/90 md:text-[15px]">{content.hero.description}</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-8 lg:px-8 lg:pb-20 lg:pt-12">
        <section className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">{content.onPage.eyebrow}</p>
          <h2 className="mt-3 font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
            {content.onPage.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-[15px]">{content.onPage.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {content.onPage.links.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section
          id="ks3"
          className="relative -ml-[50vw] -mr-[50vw] left-1/2 right-1/2 mt-8 w-screen overflow-hidden bg-gradient-to-r from-morpeth-navy via-[#12355b] to-[#3b6fb6] text-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:px-8 lg:py-24">
            <div className="relative md:flex md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{content.ks3.eyebrow}</p>
                <h2 className="mt-3 font-heading text-xl uppercase tracking-[0.14em] text-white sm:text-2xl md:text-[1.55rem] md:tracking-[0.18em]">
                  {content.ks3.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sky-100 sm:text-base">{content.ks3.description}</p>
              </div>

              <div className="relative -mx-5 mt-5 overflow-x-auto pl-5 pr-10 no-scrollbar sm:mx-0 sm:mt-6 sm:overflow-visible sm:px-0 md:mt-0">
                <div className="flex w-max gap-2 text-[0.7rem] sm:w-auto sm:flex-wrap sm:text-xs">
                  {content.ks3.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="whitespace-nowrap rounded-full bg-white/10 px-3 py-1 font-medium text-white ring-1 ring-white/15"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <div
                  className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#3b6fb6] via-[#3b6fb6]/60 to-transparent sm:hidden"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="sm:hidden">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">KS3 at a glance</p>
                  <p className="text-[11px] font-medium text-sky-200/80">Swipe →</p>
                </div>

                <div className="relative -mx-5 overflow-x-auto pb-1 pl-5 pr-10 no-scrollbar snap-x snap-mandatory scroll-px-5">
                  <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#3b6fb6] via-[#3b6fb6]/60 to-transparent" />
                  <div className="flex gap-4">
                    {content.ks3.features.map((feature) => {
                      const Icon = icons[feature.icon] ?? IconBook;
                      return (
                        <div
                          key={feature.id}
                          className="group relative min-w-[76vw] max-w-[22rem] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-sm backdrop-blur"
                        >
                          <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                          <div className="relative flex h-full flex-col p-5">
                            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sky-100 ring-1 ring-white/20">
                              <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-semibold tracking-tight text-white">{feature.title}</h3>
                            <p className="mt-2 text-xs leading-relaxed text-sky-100/90">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                {content.ks3.features.map((feature) => {
                  const Icon = icons[feature.icon] ?? IconBook;
                  return (
                    <div
                      key={feature.id}
                      className="group relative overflow-hidden rounded-2xl bg-white/10 shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md"
                    >
                      <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                      <div className="relative flex h-full flex-col p-5">
                        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sky-100 ring-1 ring-white/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-semibold tracking-tight text-white">{feature.title}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-sky-100/90">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm leading-relaxed text-sky-100">
              {content.ks3.details.map((detail) => (
                <details
                  key={detail.title}
                  className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
                    {detail.title}
                    <span className="text-xs text-sky-200 transition group-open:rotate-90">›</span>
                  </summary>
                  <div className="mt-2 space-y-2 text-xs text-sky-100 sm:text-sm">
                    {detail.paragraphs.map((paragraph) => (
                      <p key={`${detail.title}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="subjects" className="mt-14">
          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">{content.subjects.eyebrow}</p>
            <h2 className="mt-3 font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
              {content.subjects.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-[15px]">{content.subjects.description}</p>
          </div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              value={searchQuery}
              placeholder={content.subjects.searchPlaceholder}
              className="w-full max-w-md rounded-2xl bg-morpeth-offwhite px-4 py-2 text-sm text-slate-800 shadow-card ring-1 ring-slate-200/60 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-morpeth-mid"
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
            />
            <select
              value={phaseFilter}
              className="rounded-2xl bg-morpeth-offwhite px-3 py-2 text-sm text-slate-800 shadow-card ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-morpeth-mid"
              onChange={(event) => {
                setPhaseFilter(event.target.value);
              }}
            >
              {phaseFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <motion.div
            className="relative -mx-4 overflow-x-auto px-4 pb-4 no-scrollbar snap-x snap-mandatory scroll-px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex gap-5">
              {filteredSubjects.map((subject) => {
                const imageSrc = getSubjectImage(subject);

                return (
                  <motion.button
                    key={subject.id}
                    type="button"
                    onClick={() => setActiveSubject(subject)}
                    className="group relative w-80 flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-morpeth-mid"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0">
                      <Image src={imageSrc} alt={subject.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-slate-900/70 transition group-hover:bg-slate-900/50" />
                    </div>

                    <div className="relative flex h-full flex-col justify-between p-6 text-white">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-light/80">
                          {subject.phase || "Subject"}
                        </span>
                        <h3 className="mt-3 font-heading text-lg uppercase tracking-[0.14em] text-white">{subject.name}</h3>
                      </div>
                      <span className="mt-5 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light ring-1 ring-white/20 transition group-hover:-translate-y-0.5">
                        Learn more →
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {filteredSubjects.length === 0 && (
            <p className="mt-3 text-sm text-slate-600">{content.subjects.emptyText}</p>
          )}
        </section>

        <section id="support" className="mt-12 space-y-6">
          <motion.article
            className="grid overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60 md:grid-cols-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative aspect-[16/10] md:col-span-2 md:aspect-auto md:h-full">
              <Image
                src={libraryCard.imageFileUrl || libraryCard.imageUrl || "/images/library.webp"}
                alt={libraryCard.imageAlt || "Morpeth School library"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority={true}
              />
            </div>
            <div className="p-5 md:col-span-3 md:p-6">
              <h2 className="font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.3rem]">{libraryCard.title}</h2>

              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>{libraryCard.intro}</p>

                <div className={libraryExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                  {libraryCard.details.map((detail) => (
                    <p key={`${libraryCard.id}-${detail.slice(0, 20)}`}>{detail}</p>
                  ))}
                  {libraryCard.note && <p className="text-xs text-slate-500">{libraryCard.note}</p>}
                </div>

                {!libraryExpanded && (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-morpeth-offwhite sm:hidden" />
                )}

                <button
                  type="button"
                  onClick={() => setLibraryExpanded((value) => !value)}
                  className="mt-4 inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                >
                  {libraryExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            </div>
          </motion.article>

          <motion.article
            className="grid overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60 md:grid-cols-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative order-last aspect-[16/10] md:order-none md:col-span-2 md:aspect-auto md:h-full">
              <Image
                src={coachingCard.imageFileUrl || coachingCard.imageUrl || "/images/academic-coaching.webp"}
                alt={coachingCard.imageAlt || "Academic coaching in action"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="p-5 md:col-span-3 md:p-6">
              <h2 className="font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.3rem]">{coachingCard.title}</h2>

              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>{coachingCard.intro}</p>

                <div className={coachingExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                  {coachingCard.details.map((detail) => (
                    <p key={`${coachingCard.id}-${detail.slice(0, 20)}`}>{detail}</p>
                  ))}
                  {coachingCard.note && <p className="text-xs text-slate-500">{coachingCard.note}</p>}
                </div>

                {!coachingExpanded && (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-morpeth-offwhite sm:hidden" />
                )}

                <button
                  type="button"
                  onClick={() => setCoachingExpanded((value) => !value)}
                  className="mt-4 inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                >
                  {coachingExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            </div>
          </motion.article>
        </section>
      </main>

      {activeSubject && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3 md:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{activeSubject.phase || "Subject"}</p>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">{activeSubject.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubject(null)}
                className="ml-4 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Close
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
                {!activeVideo ? (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">{content.modal.comingSoonText}</div>
                ) : activeVideoIsYoutube ? (
                  <iframe
                    src={toYoutubeEmbedUrl(activeVideo)}
                    title={`${activeSubject.name} video`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster={activeSubject.videoPosterUrl}
                    controlsList="nodownload"
                  >
                    <source src={activeVideo} type="video/mp4" />
                  </video>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-slate-700">
                  {activeSubject.description || content.modal.fallbackDescription}
                </p>

                <p className="text-xs text-slate-500">{content.modal.footerText}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close subject details"
            className="fixed inset-0 -z-10 cursor-default"
            onClick={() => setActiveSubject(null)}
          />
        </div>
      )}
    </div>
  );
}
