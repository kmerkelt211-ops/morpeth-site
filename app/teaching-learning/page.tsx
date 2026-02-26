"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import HeroVideo from "../components/HeroVideo";

type Subject = {
  id: string;
  name: string;
  phase?: string; // e.g. "KS3 & KS4"
  videoUrl?: string; // to be wired to Sanity / YouTube later
  description?: string;
  image?: string; // optional dedicated image path for the subject
};

const SUBJECTS: Subject[] = [
  {
    id: "art-photography",
    name: "Art and Photography",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Art and Photography allow students to explore ideas and develop creative skills across a range of media and digital processes.",
  },
  {
    id: "business-economics",
    name: "Business and Economics",
    phase: "KS4 & KS5",
    videoUrl: "",
    description:
      "Business and Economics help students understand how organisations operate and how economic decisions shape society.",
  },
  {
    id: "careers-programme",
    name: "Careers Programme",
    phase: "Whole school",
    videoUrl: "",
    description:
      "Our careers programme supports students to make informed choices about their future education, training and employment.",
  },
  {
    id: "computing-ict",
    name: "Computing and ICT",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Computing and ICT combine digital literacy, programming and understanding how technology shapes our lives.",
  },
  {
    id: "cpshe",
    name: "CPSHE",
    phase: "Whole school",
    videoUrl: "",
    description:
      "CPSHE helps students stay safe, healthy and prepared for life and work in modern Britain.",
  },
  {
    id: "design-technology",
    name: "Design and Technology",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "At KS3 pupils follow a carousel of Food, Textiles and Product Design, learning to design and make using a wide range of materials, tools and processes.",
  },
  {
    id: "drama",
    name: "Drama",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Drama develops confidence, teamwork and creativity through practical performance work.",
  },
  {
    id: "digital-media",
    name: "Digital Media",
    phase: "KS4 & KS5",
    videoUrl: "",
    description:
      "Digital Media develops creative and technical skills in content creation, production and storytelling across modern platforms.",
  },
  {
    id: "english",
    name: "English",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "English at Morpeth develops confident readers, writers and speakers through a rich and diverse curriculum.",
  },
  {
    id: "film-studies",
    name: "Film Studies",
    phase: "KS4 & KS5",
    videoUrl: "",
    description:
      "Film Studies explores film as an art form, developing analytical, creative and practical production skills.",
  },
  {
    id: "geography",
    name: "Geography",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Geography explores people, places and environments – locally, nationally and globally.",
  },
  {
    id: "gov-politics-citizenship",
    name: "Government, Politics and Citizenship",
    phase: "KS4 & KS5",
    videoUrl: "",
    description:
      "Government, Politics and Citizenship help students understand how political systems work and how citizens can influence change.",
  },
  {
    id: "history",
    name: "History",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "History helps students understand how past events have shaped the world they live in today.",
  },
  {
    id: "humanities",
    name: "Humanities",
    phase: "KS3",
    videoUrl: "",
    description:
      "Humanities brings together elements of History, Geography and RS to help students understand people, places and beliefs.",
  },
  {
    id: "maths",
    name: "Maths",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Mathematics builds problem solving skills and fluency with numbers, algebra, geometry and data.",
  },
  {
    id: "media-studies",
    name: "Media Studies",
    phase: "KS4 & KS5",
    videoUrl: "",
    description:
      "Media Studies develops critical understanding of the media and provides opportunities for creative production.",
  },
  {
    id: "mfl",
    name: "Modern Foreign Languages",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Students develop confidence in communicating in another language and understanding other cultures.",
  },
  {
    id: "music",
    name: "Music",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Music provides opportunities for performance, composition and listening across many styles.",
  },
  {
    id: "pe",
    name: "PE",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "PE promotes fitness, wellbeing and teamwork through a wide range of sports and activities.",
  },
  {
    id: "psychology",
    name: "Psychology",
    phase: "KS5",
    videoUrl: "",
    description:
      "Psychology explores human behaviour and mental processes through scientific study.",
  },
  {
    id: "rs",
    name: "Religious Studies",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Religious Studies supports students to explore beliefs, values and ethics in a respectful and thoughtful way.",
  },
  {
    id: "science",
    name: "Science",
    phase: "KS3 & KS4",
    videoUrl: "",
    description:
      "Our science curriculum encourages curiosity about the world through biology, chemistry and physics.",
  },
  {
    id: "sen",
    name: "SEN",
    phase: "Whole school",
    videoUrl: "",
    description:
      "SEN support ensures that pupils with additional needs can access learning and make strong progress.",
  },
  {
    id: "sociology-health-social-care",
    name: "Sociology, Health and Social Care",
    phase: "KS4 & KS5",
    videoUrl: "",
    description:
      "Sociology, Health and Social Care explore society, social structures and the skills needed for health and care professions.",
  },
];


const KS3_SUBJECTS = [
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
];

// Small icon components for KS3 feature cards
const IconBook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M6.5 4.75h7a3.75 3.75 0 0 1 3.75 3.75v10.5a.75.75 0 0 1-1.2.6l-.3-.225a5.25 5.25 0 0 0-3.15-1.025H6.5a2 2 0 0 0-2 2V6.75a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6.5 4.75v13.5m0-11.5h7a3.5 3.5 0 0 1 3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M7.5 13.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm9 7a5 5 0 0 0-9 0m13-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-2 11a5 5 0 0 0-4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconLanguage = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M4 5h16M4 12h10M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13.5 5c0 0 0 6.5-6.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconStars = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M6 6l1.5 3L11 10.5 7.5 12 6 15l-1.5-3L1 10.5 4.5 9 6 6Zm10 2 2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Feature cards shown under the KS3 curriculum intro
const KS3_FEATURES = [
  {
    id: "subjects",
    title: "What pupils study",
    description:
      "A broad range across Art, Drama, DT, English, Humanities, MFL, Music, PE and Science gives a strong foundation.",
    Icon: IconBook,
  },
  {
    id: "grouping",
    title: "How classes are organised",
    description:
      "Mixed prior‑attainment classes in most subjects. Maths uses setting from the beginning of Year 8.",
    Icon: IconUsers,
  },
  {
    id: "dt-mfl",
    title: "DT carousel & MFL options",
    description:
      "DT rotates Food, Product and Resistant Materials. MFL starts with Spanish or French, with additional options later.",
    Icon: IconLanguage,
  },
  {
    id: "beyond",
    title: "Beyond the classroom",
    description:
      "Clubs, trips and competitions extend learning and build confidence, curiosity and cultural capital.",
    Icon: IconStars,
  },
] as const;

export default function TeachingLearningPage() {
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [filteredSubjects, setFilteredSubjects] = useState(SUBJECTS);
  const [libraryExpanded, setLibraryExpanded] = useState(false);
  const [coachingExpanded, setCoachingExpanded] = useState(false);

  return (
    <div className="bg-white">
      {/* Full-width hero matching other pages */}
      <section className="relative overflow-hidden bg-slate-900 text-slate-50">
        <HeroVideo src="/video/morpeth-drone-hero.mp4" pageKey="teachingLearning" />

        {/* Centered text content */}
        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-morpeth-light/75">
            TEACHING &amp; LEARNING
          </p>
          <h1 className="mt-5 font-heading text-3xl uppercase tracking-[0.14em] text-morpeth-light sm:text-4xl md:text-5xl">
            Subjects at Morpeth
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-morpeth-light/90 md:text-[15px]">
            Explore each subject to find out more about what students study,
            how learning is organised across the year groups, and what support
            is available. Each subject page will include a short video from
            staff and further information about the course.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pt-8 pb-14 lg:px-8 lg:pt-12 lg:pb-20">

        <section className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
            ON THIS PAGE
          </p>
          <h2 className="mt-3 font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
            Teaching & learning at Morpeth
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-[15px]">
            An overview of our curriculum from Key Stage 3 through to Sixth Form, with a quick way to explore subjects and the support we provide to help every student thrive.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#ks3"
              className="inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
            >
              KS3 overview
            </a>
            <a
              href="#subjects"
              className="inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
            >
              Explore subjects
            </a>
            <a
              href="#support"
              className="inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
            >
              Support & guidance
            </a>
          </div>
        </section>

        {/* KS3 curriculum overview (interactive) */}
        <section
          id="ks3"
          className="relative mt-8 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-gradient-to-r from-morpeth-navy via-[#12355b] to-[#3b6fb6] text-white"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:px-8 lg:py-24">
            <div className="relative md:flex md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  KEY STAGE 3
                </p>
                <h2 className="mt-3 font-heading text-xl uppercase tracking-[0.14em] text-white sm:text-2xl md:text-[1.55rem] md:tracking-[0.18em]">
                  A broad, balanced foundation for Years 7–9
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sky-100 sm:text-base">
                  KS3 at Morpeth builds strong subject knowledge, confidence and curiosity.
                  Pupils study a wide range of subjects so they can discover interests, develop core skills
                  and be well prepared for Key Stage 4.
                </p>
              </div>

              {/* KS3 subjects pill strip */}
              <div className="relative mt-5 -mx-5 overflow-x-auto pl-5 pr-10 no-scrollbar sm:mx-0 sm:mt-6 sm:overflow-visible sm:px-0 md:mt-0">
                <div className="flex w-max gap-2 text-[0.7rem] sm:w-auto sm:flex-wrap sm:text-xs">
                  {KS3_SUBJECTS.map((subject) => (
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

            {/* Feature cards */}
            <div className="mt-6">
            {/* Mobile: swipeable cards */}
            <div className="sm:hidden">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                  KS3 at a glance
                </p>
                <p className="text-[11px] font-medium text-sky-200/80">Swipe →</p>
              </div>

              <div className="relative -mx-5 overflow-x-auto pl-5 pr-10 pb-1 no-scrollbar snap-x snap-mandatory scroll-px-5">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#3b6fb6] via-[#3b6fb6]/60 to-transparent" />
                <div className="flex gap-4">
                  {KS3_FEATURES.map(({ id, title, description, Icon }) => (
                    <div
                      key={id}
                    className="group relative min-w-[76vw] max-w-[22rem] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-sm backdrop-blur"
                    >
                      <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                      <div className="relative flex h-full flex-col p-5">
                        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sky-100 ring-1 ring-white/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-semibold tracking-tight text-white">
                          {title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-sky-100/90">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: keep the existing grid */}
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {KS3_FEATURES.map(({ id, title, description, Icon }) => (
                <div
                  key={id}
                  className="group relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md backdrop-blur"
                >
                  <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex h-full flex-col p-5">
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sky-100 ring-1 ring-white/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold tracking-tight text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-sky-100/90">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra detail (kept for those who like to read more) */}
          <div className="mt-6 space-y-3 text-sm leading-relaxed text-sky-100">
            <details className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
                Subjects studied at KS3
                <span className="text-xs text-sky-200 transition group-open:rotate-90">›</span>
              </summary>
              <div className="mt-2 text-xs text-sky-100 sm:text-sm">
                <p>
                  Pupils build their knowledge and skills in Art, Drama, Design &amp; Technology (DT),
                  English, Geography, History, Computing &amp; ICT, Maths, Modern Foreign Languages (MFL),
                  Music, Physical Education (PE), Religious Studies (RS) and Science.
                </p>
              </div>
            </details>
            <details className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
                How classes are organised
                <span className="text-xs text-sky-200 transition group-open:rotate-90">›</span>
              </summary>
              <div className="mt-2 text-xs text-sky-100 sm:text-sm">
                <p>
                  Pupils in Year 7 have a lesson a fortnight focusing on oracy. Pupils are taught in mixed
                  prior‑attainment groupings in all subjects apart from Maths, which operates a setting system
                  from the beginning of Year 8.
                </p>
              </div>
            </details>
            <details className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
                Design &amp; Technology and Modern Foreign Languages
                <span className="text-xs text-sky-200 transition group-open:rotate-90">›</span>
              </summary>
              <div className="mt-2 space-y-2 text-xs text-sky-100 sm:text-sm">
                <p>
                  In DT, pupils study Food Technology, Product Design and Resistant Materials on a carousel basis
                  each year so that they experience all three disciplines.
                </p>
                <p>
                  In MFL, pupils study either Spanish or French in Year 7 for two sessions a week, which they continue
                  into Year 8. In Year 8, there is also the option for students who are very keen on languages to pick up
                  a second language in the dual‑language option, and Bengali is introduced as a single‑language option.
                </p>
              </div>
            </details>
            <details className="group rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
                Beyond the classroom &amp; further information
                <span className="text-xs text-sky-200 transition group-open:rotate-90">›</span>
              </summary>
              <div className="mt-2 text-xs text-sky-100 sm:text-sm">
                <p>
                  There is a wide range of extra‑curricular activities on offer in many subject areas to support pupils’
                  learning beyond the classroom.
                </p>
                <p className="mt-2 text-[0.7rem] text-sky-200/70">
                  If you require further information about the curriculum, please contact us by phone on 020 8981 0921,
                  or email enquiries@morpeth.towerhamlets.sch.uk.
                </p>
              </div>
            </details>
          </div>

          </div>
        </section>

        {/* Subject cards carousel with search and filter */}
        <section id="subjects" className="mt-14">
          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
              SUBJECTS
            </p>
            <h2 className="mt-3 font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
              Explore our curriculum
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-[15px]">
              Search and filter to find a subject. Each card will link to a short video and key information as we build out the curriculum pages.
            </p>
          </div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full max-w-md rounded-2xl bg-morpeth-offwhite px-4 py-2 text-sm text-slate-800 shadow-card ring-1 ring-slate-200/60 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-morpeth-mid"
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setFilteredSubjects(
                  SUBJECTS.filter((s) =>
                    s.name.toLowerCase().includes(value)
                  )
                );
              }}
            />
            <select
              className="rounded-2xl bg-morpeth-offwhite px-3 py-2 text-sm text-slate-800 shadow-card ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-morpeth-mid"
              onChange={(e) => {
                const value = e.target.value;
                setFilteredSubjects(
                  value === "all"
                    ? SUBJECTS
                    : SUBJECTS.filter((s) =>
                        (s.phase || "").toLowerCase().includes(value)
                      )
                );
              }}
            >
              <option value="all">All phases</option>
              <option value="ks3">KS3</option>
              <option value="ks4">KS4</option>
              <option value="ks5">KS5</option>
              <option value="whole">Whole school</option>
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
                const imageSrc = subject.image || `/images/${subject.id}.webp`;

                return (
                  <motion.button
                    key={subject.id}
                    type="button"
                    onClick={() => setActiveSubject(subject)}
                    className="group relative w-80 flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-morpeth-mid"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={imageSrc}
                        alt={subject.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/70 transition group-hover:bg-slate-900/50" />
                    </div>

                    <div className="relative flex flex-col justify-between h-full p-6 text-white">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-light/80">
                          {subject.phase || "Subject"}
                        </span>
                        <h3 className="mt-3 font-heading text-lg uppercase tracking-[0.14em] text-white">
                          {subject.name}
                        </h3>
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
        </section>

        {/* Library and academic coaching */}
        <section id="support" className="mt-12 space-y-6">
          {/* Library card with image */}
          <motion.article
            className="grid overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60 md:grid-cols-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative aspect-[16/10] md:col-span-2 md:aspect-auto md:h-full">
              <Image
                src="/images/library.webp"
                alt="Morpeth School library"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority={true}
              />
            </div>
            <div className="p-5 md:col-span-3 md:p-6">
              <h2 className="font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.3rem]">Library</h2>

              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  Our library, led by Librarian James Nash with support from Kim Cunningham, holds around
                  10,500 books, including a large fiction collection, bilingual books and a wide range of
                  dictionaries and special collections.
                </p>

                {/* Extra detail: collapsed on mobile until expanded */}
                <div className={libraryExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                  <p>
                    The library supports pupils with special educational needs by sourcing accessible formats
                    such as large print, Braille and reader‑friendly texts, as well as bilingual dictionaries
                    and dual‑language resources for newly arrived pupils.
                  </p>
                  <p>
                    Alongside book stock there are digital resources, computers and printing facilities, plus
                    a dedicated A‑level and GCSE area with revision guides, textbooks, past papers and study
                    skills materials.
                  </p>
                  <p className="text-xs text-slate-500">
                    Students are encouraged to help develop the library by suggesting new books and can also
                    apply to become Student Librarians, gaining leadership experience and rewards for their contribution.
                  </p>
                </div>

                {/* Mobile fade + toggle */}
                {!libraryExpanded && (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-morpeth-offwhite sm:hidden" />
                )}

                <button
                  type="button"
                  onClick={() => setLibraryExpanded((v) => !v)}
                  className="mt-4 inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                >
                  {libraryExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            </div>
          </motion.article>

          {/* Academic coaching card with image */}
          <motion.article
            className="grid overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60 md:grid-cols-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative order-last aspect-[16/10] md:order-none md:col-span-2 md:aspect-auto md:h-full">
              <Image
                src="/images/academic-coaching.webp"
                alt="Academic coaching in action"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="p-5 md:col-span-3 md:p-6">
              <h2 className="font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.3rem]">Academic coaching</h2>

              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  Our academic coaching programme supports students to achieve at, or above, their target grades
                  through focused small‑group and one‑to‑one work in English and Maths. Coaches work closely with
                  class teachers to reinforce key skills and build confidence.
                </p>

                {/* Extra detail: collapsed on mobile until expanded */}
                <div className={coachingExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                  <p>
                    Targeted Year 11 pupils typically work with a coach twice a week during the school day, followed
                    by small‑group sessions before or after school. Coaches also support groups in Years 7 and 8 with
                    reading, writing and mathematical understanding.
                  </p>
                  <p>
                    The programme runs across the year and may include sessions in half term and on Saturdays. We also
                    work with external partners, including the National Tutoring Programme, to supplement the in‑school offer.
                  </p>
                  <p className="text-xs text-slate-500">
                    Academic coaching is an important part of our strategy to support students and ensure that all pupils
                    can reach their full potential.
                  </p>
                </div>

                {/* Mobile fade + toggle */}
                {!coachingExpanded && (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-morpeth-offwhite sm:hidden" />
                )}

                <button
                  type="button"
                  onClick={() => setCoachingExpanded((v) => !v)}
                  className="mt-4 inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                >
                  {coachingExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            </div>
          </motion.article>
        </section>
      </main>

      {/* Overlay / modal for subject details */}
      {activeSubject && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3 md:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                  {activeSubject?.phase || "Subject"}
                </p>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                  {activeSubject?.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubject(null)}
                className="ml-4 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Close
              </button>
            </header>

            {/* Content area */}
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              {/* Video placeholder / embed */}
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
                {activeSubject.videoUrl ? (
                  <iframe
                    src={activeSubject.videoUrl}
                    title={`${activeSubject?.name || "Subject"} video`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    Subject video coming soon
                  </div>
                )}
              </div>

              {/* Course info */}
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-slate-700">
                  {activeSubject?.description ||
                    "Information about this course, including topics studied, assessment and how families can support learning at home, will be added here soon."}
                </p>

                <p className="text-xs text-slate-500">
                  In future this section will be powered by content from our
                  curriculum pages in Sanity, so that subject teams can keep
                  information up to date.
                </p>
              </div>
            </div>
          </div>

          {/* Clickable backdrop to close */}
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
