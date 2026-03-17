import Image from "next/image"
import Link from "next/link"
import { EXTERNAL_GALLERY_URL, EXTERNAL_MUSIC_URL } from "../../../lib/siteLinks"
import type { RecruitmentMedia } from "../../../lib/siteMediaLoaders"
import HeroVideo from "../HeroVideo"
import RecruitmentVideoCard from "./RecruitmentVideoCard"
import ResultsDeck from "./ResultsDeck"
import { ValuesCarousel, ValuesGrid } from "./ValuesCarousel"

type OurSchoolPageContentProps = {
  initialRecruitmentMedia?: RecruitmentMedia | null
}

export default function OurSchoolPageContent({
  initialRecruitmentMedia,
}: OurSchoolPageContentProps) {
  return (
    <main className="min-h-screen">
      <section className="relative bg-morpeth-navy text-morpeth-light">
        <HeroVideo
          src="/video/morpeth-drone-hero.mp4"
          pageKey="ourSchool"
          preload="auto"
        />
        <div className="relative mx-auto flex min-h-[60vh] md:min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-14 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
            Morpeth School · Our School
          </p>
          <h1 className="mt-4 font-heading text-2xl leading-tight md:text-4xl lg:text-5xl">
            A community where everyone is valued.
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-morpeth-light/90">
            Learn more about our values, curriculum, results and the people who make Morpeth a place where everyone
            belongs.
          </p>
          <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="#welcome"
              className="w-full text-center rounded-full bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:py-2 sm:text-xs sm:tracking-[0.18em]"
            >
              Welcome &amp; values
            </Link>
            <Link
              href="#results"
              className="w-full text-center rounded-full border border-morpeth-light/70 bg-transparent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light hover:bg-morpeth-light/10 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto sm:py-2 sm:text-xs sm:tracking-[0.18em]"
            >
              Results &amp; exams
            </Link>
            <Link
              href="/policies"
              className="w-full text-center rounded-full border border-morpeth-light/50 bg-transparent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light/80 hover:bg-morpeth-light/10 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto sm:py-2 sm:text-xs sm:tracking-[0.18em]"
            >
              Policies
            </Link>
          </div>
        </div>
      </section>

      <section id="welcome" className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-7 md:py-14">
          <article className="group relative grid overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-5">
            <div className="relative aspect-[16/10] md:col-span-2 md:aspect-auto md:h-full">
              <Image
                src="/images/welcome.webp"
                alt="Welcome to Morpeth School"
                fill
                className="object-cover object-[50%_15%] md:object-center"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
            </div>
            <div className="p-4 md:col-span-3 md:p-6">
              <h2 className="font-heading text-2xl text-morpeth-navy uppercase tracking-[0.12em]">
                Welcome to Morpeth School
              </h2>
              <div className="mt-3">
                <details className="group md:hidden rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-sm font-semibold text-morpeth-navy [&::-webkit-details-marker]:hidden">
                    <span className="flex flex-col">
                      <span>Read the Headteacher&apos;s welcome</span>
                      <span className="mt-0.5 text-xs font-normal text-slate-600">Tap to expand</span>
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-6 w-6 text-sky-700 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                    <p>
                      Morpeth is a mixed school for pupils aged 11 to 18 in Bethnal Green, Tower Hamlets. We are a
                      school that reflects our community. We value diversity and strive to ensure we are inclusive in
                      all we do.
                    </p>
                    <p>
                      We see the positive relationships between different groups of pupils, and between pupils and
                      staff, as a strength of the school. We believe those strong relationships lead to great learning.
                      By getting to know children as individuals, we can better support them.
                    </p>
                    <p>
                      We have a broad and ambitious curriculum for all our pupils in every year group. Our unique KS4
                      curriculum model means pupils continue to have a flexible, rich and rigorous offer with almost
                      all pupils studying a language and humanities subject in addition to the core.
                    </p>
                    <p>
                      However, learning at Morpeth is about much more than the subjects we teach. We explicitly promote
                      respect, responsibility and &lsquo;Morpeth values&rsquo; in all that we do, and we expect pupils
                      to participate in our extensive extra-curricular offer and be engaged in wider community and
                      global issues.
                    </p>
                    <p>
                      We believe our success is built upon the professionalism and commitment of all our staff -
                      teaching and support - and a shared set of values. We are proud of our school community and are
                      always willing to provide families and visitors with any further information they need.
                    </p>
                    <p className="pt-1 font-medium text-morpeth-navy">Headteacher, John Pickett</p>
                  </div>
                </details>

                <div className="hidden md:block space-y-3 text-sm leading-relaxed text-slate-700">
                  <p>
                    Morpeth is a mixed school for pupils aged 11 to 18 in Bethnal Green, Tower Hamlets. We are a
                    school that reflects our community. We value diversity and strive to ensure we are inclusive in all
                    we do.
                  </p>
                  <p>
                    We see the positive relationships between different groups of pupils, and between pupils and staff,
                    as a strength of the school. We believe those strong relationships lead to great learning. By
                    getting to know children as individuals, we can better support them.
                  </p>
                  <p>
                    We have a broad and ambitious curriculum for all our pupils in every year group. Our unique KS4
                    curriculum model means pupils continue to have a flexible, rich and rigorous offer with almost all
                    pupils studying a language and humanities subject in addition to the core.
                  </p>
                  <p>
                    However, learning at Morpeth is about much more than the subjects we teach. We explicitly promote
                    respect, responsibility and &lsquo;Morpeth values&rsquo; in all that we do, and we expect pupils to
                    participate in our extensive extra-curricular offer and be engaged in wider community and global
                    issues.
                  </p>
                  <p>
                    We believe our success is built upon the professionalism and commitment of all our staff - teaching
                    and support - and a shared set of values. We are proud of our school community and are always
                    willing to provide families and visitors with any further information they need.
                  </p>
                  <p className="pt-1 font-medium text-morpeth-navy">Headteacher, John Pickett</p>
                </div>
              </div>
            </div>
          </article>

          <div className="mt-5 md:mt-6">
            <ValuesCarousel />
            <ValuesGrid />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 pt-7 pb-10 md:py-12">
          <div className="grid gap-6 md:grid-cols-5">
            <article className="group relative overflow-hidden rounded-3xl bg-white p-5 md:p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:col-span-3">
              <p className="uppercase text-xs tracking-[0.22em] text-sky-700">Admissions 2026</p>
              <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em]">
                Starting secondary in 2026
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  If you live in Tower Hamlets and your child is currently in Year 5, you&rsquo;ll be thinking about
                  transition to secondary school in September 2026. We know this is a big decision and we&rsquo;re
                  here to help.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://www.towerhamlets.gov.uk/lgnl/education_and_learning/schools/school_admissions/secondary_school_admissions.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  Tower Hamlets Admissions
                </a>
                <a
                  href="/contact#message"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  Ask about open events
                </a>
              </div>
            </article>

            <RecruitmentVideoCard initialRecruitmentMedia={initialRecruitmentMedia} />
          </div>
        </div>
      </section>

      <section id="results" className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 md:py-12 space-y-6">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Results &amp; exams
            </p>
            <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              Ambition, support and outstanding outcomes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Our students go on to sixth forms, apprenticeships and top universities across the country. Explore our
              latest GCSE and Sixth Form results, as well as key information about exams and performance measures.
            </p>
          </header>

          <ResultsDeck />

          <div className="hidden md:block space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <article className="group relative overflow-hidden rounded-3xl bg-morpeth-navy p-6 text-white shadow-sm ring-1 ring-morpeth-navy/20 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-sky-500/25 blur-3xl" />
                <h3 className="text-sm font-semibold tracking-[0.18em] uppercase">Results &amp; destinations</h3>
                <p className="mt-3 text-sm leading-relaxed text-morpeth-light">
                  Headline GCSE and Sixth Form outcomes, progress measures and recent destinations including
                  university, apprenticeships and employment.
                </p>
                <div className="mt-4 space-y-2 text-xs uppercase tracking-[0.16em] text-morpeth-light/80">
                  <p>GCSE &bull; Sixth Form &bull; Progress 8 &bull; Destinations</p>
                </div>
                <Link
                  href="/our-school/results"
                  className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  View results &amp; destinations
                </Link>
              </article>

              <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-base font-semibold tracking-tight text-slate-900">Exams &amp; assessment</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Key information for students and families about exam timetables, revision support and how we manage
                  assessments at Morpeth.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  <li>&bull; GCSE and Sixth Form exam timetables</li>
                  <li>&bull; Guidance on exam conduct and preparation</li>
                  <li>&bull; Support for access arrangements and special consideration</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/our-school/exams"
                    className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Exam information
                  </Link>
                  <a
                    href="/our-school/exams"
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                  >
                    Assessment guidance
                  </a>
                </div>
              </article>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-base font-semibold tracking-tight text-slate-900">Prospectus</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Find out more about our wide curriculum and opportunities at Morpeth.
                </p>
                <a
                  href="/Documents/prospectus.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  Download prospectus
                </a>
              </article>

              <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-base font-semibold tracking-tight text-slate-900">Pupil Premium</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Pupil Premium funding supports improved outcomes for disadvantaged pupils. Read our current strategy.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/policies"
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                  >
                    Policy hub
                  </a>
                  <a
                    href="/policies"
                    className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:-translate-y-0.5 hover:shadow-lg transition"
                  >
                    Pupil Premium information
                  </a>
                </div>
              </article>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-base font-semibold tracking-tight text-slate-900">Ofsted</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Morpeth School has been judged to be <strong>Good</strong> in its last Ofsted inspection.
                </p>
                <a
                  href="https://reports.ofsted.gov.uk/provider/23/100967"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  View full report
                </a>
              </article>

              <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-base font-semibold tracking-tight text-slate-900">Policies</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Read our statutory policies and documents, including safeguarding, behaviour and curriculum
                  information.
                </p>
                <a
                  href="/policies"
                  className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  View policies
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 md:py-12">
          <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em]">
              House System &amp; Coaching Circles
            </h2>
            <div className="mt-3 grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  Our house system builds identity, friendly competition and leadership. Throughout the year, students
                  contribute to house points through sports, arts and academic events.
                </p>
                <p>
                  Coaching Circles provide regular, structured time with a trusted adult to reflect on learning and
                  wellbeing, set goals and build the habits that lead to success.
                </p>
                <a
                  href="/our-school/coaching-circles"
                  className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  Coaching Circles guide
                </a>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/our-school/houses"
                    className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Explore House System
                  </Link>
                  <Link
                    href="/our-school/coaching-circles"
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                  >
                    About Coaching Circles
                  </Link>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                  <Image
                    src="/images/houses.webp"
                    alt="Morpeth House crests"
                    width={1600}
                    height={900}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12 space-y-6">
          <article className="group relative grid overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-5">
            <div className="relative aspect-[16/10] md:col-span-2 md:aspect-auto md:h-full">
              <Image
                src="/images/history-hero.jpg"
                alt="Morpeth history"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="p-5 md:col-span-3 md:p-6">
              <h2 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.1em]">
                A History of Morpeth
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Our school has served generations in East London. Explore the stories and milestones that shaped
                Morpeth.
              </p>
              <Link
                href="/our-school/history"
                className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Explore our history
              </Link>
            </div>
          </article>

          <article className="group relative grid overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-5">
            <div className="p-5 md:col-span-3 md:p-6">
              <h2 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.1em]">Morpeth Music</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Discover performances, ensembles, recordings and music opportunities on the dedicated Morpeth Music
                site.
              </p>
              <a
                href={EXTERNAL_MUSIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Visit Morpeth Music
              </a>
            </div>
            <div className="relative aspect-[16/10] md:col-span-2 md:aspect-auto md:h-full">
              <Image
                src="/images/music.webp"
                alt="Morpeth music department"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </article>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-morpeth-light text-morpeth-navy ring-1 ring-morpeth-navy/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M7 14l2.5-2.5L12 14l3-3 2 2" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.1em]">
                    Art &amp; Photography Gallery
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    We celebrate creative work across the school year. Visit our gallery to see recent exhibitions and
                    student projects.
                  </p>
                  <a
                    href={EXTERNAL_GALLERY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                  >
                    Visit the gallery
                  </a>
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-morpeth-light text-morpeth-navy ring-1 ring-morpeth-navy/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <path d="M9 10l6 3-6 3z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.1em]">Morpeth TV</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Our students produce regular films and features. Watch the latest episodes and behind-the-scenes
                    clips.
                  </p>
                  <Link
                    href="/morpeth-tv"
                    className="mt-3 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                  >
                    Watch Morpeth TV
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Governing body</p>
            <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              Governance that supports every student
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              The school&rsquo;s governing board sets the vision and makes strategic decisions to ensure the school
              achieves its aims. Governors play a vital role in ensuring every child receives the best possible
              education by holding school leaders to account.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <details open={false} className="group rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-900">
                  Full Governing Body
                  <span className="text-xs text-sky-700 transition group-open:rotate-90">›</span>
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {[
                    "Allen Zimbler (Chair of Governors)",
                    "Rob Crothers",
                    "John Pickett (ex-officio, Headteacher)",
                    "Maria Lewington",
                    "Vicky Wadge",
                    "Vivek Sadhwani",
                    "Shakila Ali",
                    "Laura Polazzi",
                    "Lhipon Miah",
                    "Zaynab Khanom",
                    "Scott Newton",
                    "Michelle Lockley",
                    "Justine Fox",
                    "Lotifa Begum",
                  ].map((name) => (
                    <li key={name}>&bull; {name}</li>
                  ))}
                </ul>
              </details>

              <details open={false} className="group rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-900">
                  Staffing Committee
                  <span className="text-xs text-sky-700 transition group-open:rotate-90">›</span>
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {[
                    "Maria Lewington (Chair)",
                    "John Pickett",
                    "Shakila Ali",
                    "Craig Griffiths",
                    "Laura Polazzi",
                    "Scott Newton",
                    "Michelle Lockley",
                  ].map((name) => (
                    <li key={name}>&bull; {name}</li>
                  ))}
                </ul>
              </details>

              <details open={false} className="group rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-900">
                  Finance Committee
                  <span className="text-xs text-sky-700 transition group-open:rotate-90">›</span>
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {[
                    "Rob Crothers (Chair)",
                    "John Pickett",
                    "Allen Zimbler",
                    "Vivek Sadhwani",
                    "Lipon Miah",
                    "Vicky Wadge",
                    "Zaynab Khan",
                  ].map((name) => (
                    <li key={name}>&bull; {name}</li>
                  ))}
                </ul>
              </details>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50/60 p-4 text-sm text-slate-700 ring-1 ring-slate-100">
              <p>
                Governors can be contacted in writing, to the school. Please address correspondence to{" "}
                <strong>Chris McCallum</strong>, Clerk to the Governors. Email:{" "}
                <a className="text-sky-700 hover:underline" href="mailto:enquiries@morpeth.towerhamlets.sch.uk">
                  enquiries@morpeth.towerhamlets.sch.uk
                </a>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="/policies#governance"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  Governors&apos; Code of Conduct
                </a>
                <a
                  href="/policies#governance"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  Meeting calendar
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
