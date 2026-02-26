"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import HeroVideo from "../components/HeroVideo"

export default function SixthFormPage() {
  const [welcomeExpanded, setWelcomeExpanded] = useState(false)
  const [whyJoinExpanded, setWhyJoinExpanded] = useState(false)
  const [coursesExpanded, setCoursesExpanded] = useState(false)
  const [supportExpanded, setSupportExpanded] = useState(false)
  const [lifeExpanded, setLifeExpanded] = useState(false)
  const [applyExpanded, setApplyExpanded] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO – matches main site hero pattern */}
      <section className="relative bg-morpeth-navy text-morpeth-light">
        <HeroVideo src="/video/morpeth-drone-hero.mp4" pageKey="sixthForm" />

        {/* Content layer */}
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
            Morpeth School · Sixth Form
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">
            Morpeth Sixth Form
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-morpeth-light/90">
            A friendly, ambitious Sixth Form where you are known, supported and challenged to aim high.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="#courses"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Courses &amp; pathways
            </Link>
            <Link
              href="#apply"
              className="rounded-full border border-morpeth-light/70 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light hover:bg-morpeth-light/10 hover:-translate-y-0.5 hover:shadow-lg"
            >
              How to apply
            </Link>
            <Link
              href="#destinations"
              className="rounded-full border border-morpeth-light/50 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light/80 hover:bg-morpeth-light/10 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Results &amp; destinations
            </Link>
          </div>
        </div>
      </section>

      {/* ON THIS PAGE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            On this page
          </p>
          <h2 className="mt-2 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
            Sixth Form at a glance
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
            A quick overview of Sixth Form life, courses and support — with jump links so you can get to what you need fast.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#why-join"
              className="rounded-full bg-morpeth-offwhite px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-morpeth-navy ring-1 ring-slate-200/60 shadow-sm transition hover:-translate-y-0.5"
            >
              Why join
            </a>
            <a
              href="#courses"
              className="rounded-full bg-morpeth-offwhite px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-morpeth-navy ring-1 ring-slate-200/60 shadow-sm transition hover:-translate-y-0.5"
            >
              Courses
            </a>
            <a
              href="#support"
              className="rounded-full bg-morpeth-offwhite px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-morpeth-navy ring-1 ring-slate-200/60 shadow-sm transition hover:-translate-y-0.5"
            >
              Support
            </a>
            <a
              href="#destinations"
              className="rounded-full bg-morpeth-offwhite px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-morpeth-navy ring-1 ring-slate-200/60 shadow-sm transition hover:-translate-y-0.5"
            >
              Results
            </a>
            <a
              href="#apply"
              className="rounded-full bg-morpeth-offwhite px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-morpeth-navy ring-1 ring-slate-200/60 shadow-sm transition hover:-translate-y-0.5"
            >
              How to apply
            </a>
          </div>
        </div>
      </section>

      {/* WELCOME TO MORPETH SIXTH FORM */}
      <section className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <article className="group relative grid overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-5">
            <div className="p-5 md:col-span-3 md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Welcome
              </p>
              <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
                A Sixth Form where you belong
              </h2>
              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  Morpeth Sixth Form is a warm, inclusive community where you are known as an individual.
                  We offer a broad curriculum, excellent teaching and strong support so that every student can
                  progress to the next stage of education, training or employment with confidence.
                </p>

                <div className={welcomeExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                  <p>
                    As a Sixth Form student, you will be treated as a young adult: trusted, challenged and supported.
                    We expect you to work hard, take responsibility for your learning and contribute positively to the life of the school.
                  </p>
                  <p>
                    Our staff are experienced, approachable and committed to helping you succeed — whether your goal is university,
                    an apprenticeship or straight into the world of work.
                  </p>
                </div>

                {!welcomeExpanded && (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-morpeth-offwhite sm:hidden" />
                )}

                <button
                  type="button"
                  onClick={() => setWelcomeExpanded((v) => !v)}
                  className="mt-4 inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                >
                  {welcomeExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            </div>
            <div className="relative aspect-[4/3] md:col-span-2 md:h-full">
              <Image
                src="/images/sixth-form-study.webp"
                alt="Students studying in Morpeth Sixth Form"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </article>
        </div>
      </section>

      {/* WHY JOIN MORPETH SIXTH FORM */}
      <section
        id="why-join"
        className="bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid items-center gap-6 md:grid-cols-2">
            {/* Video panel */}
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-sm ring-1 ring-slate-900/10">
              <video
                className="h-full w-full object-cover rounded-3xl"
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
                poster="/images/sixth-form-why-join-poster.webp"
              >
                <source src="/video/sixth-form-why-join.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
            </div>

            {/* Text content */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Why join Morpeth Sixth Form?
              </p>
              <h2 className="mt-2 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
                Ambitious for you, and alongside you
              </h2>
              <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  Choosing where to study after Year 11 is a big decision. At Morpeth, you don&apos;t just get a timetable of lessons –
                  you join a community where staff know you well, notice when you are doing brilliantly and step in quickly if you
                  need support.
                </p>

                <div className={whyJoinExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                  <p>
                    We combine high expectations with kindness. You will be challenged academically, but also treated as a young adult,
                    trusted to use your study time well and to play a full part in Sixth Form life.
                  </p>
                  <p>
                    Whether you are aiming for university, an apprenticeship or straight into employment, we will work with you to plan
                    a route that makes sense for your goals.
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    <li>• Small class sizes in many subjects</li>
                    <li>• Teachers who know your strengths and gaps</li>
                    <li>• Regular one-to-one guidance and support</li>
                    <li>• A friendly, inclusive atmosphere where everyone is welcome</li>
                  </ul>
                </div>

                {!whyJoinExpanded && (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-slate-50 sm:hidden" />
                )}

                <button
                  type="button"
                  onClick={() => setWhyJoinExpanded((v) => !v)}
                  className="mt-4 inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                >
                  {whyJoinExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES & PATHWAYS */}
      <section
        id="courses"
        className="bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-6">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Courses &amp; pathways
            </p>
            <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              A broad range of A levels and vocational courses
            </h2>
            <div className="relative mt-3 text-sm leading-relaxed text-slate-700">
              <p>
                We offer a range of A level and vocational programmes so you can build a timetable that fits your interests,
                strengths and future plans.
              </p>
              <div className={coursesExpanded ? "mt-3" : "hidden mt-3 sm:block"}>
                <p>
                  You can choose a purely academic route, a more applied pathway or a blend of both.
                </p>
              </div>
              {!coursesExpanded && (
                <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-slate-50 sm:hidden" />
              )}
              <button
                type="button"
                onClick={() => setCoursesExpanded((v) => !v)}
                className="mt-4 inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
              >
                {coursesExpanded ? "Show less" : "Read more"}
              </button>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                A Level pathway
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                For students aiming for university, especially competitive courses. Typically three A levels over two years.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>• Traditional academic subjects</li>
                <li>• Strong emphasis on extended writing and independent study</li>
                <li>• Preparation for university-level learning</li>
              </ul>
              <Link
                href="/sixth-form/courses"
                className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                View course list
              </Link>
            </article>

            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Vocational &amp; applied pathway
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Courses with a more practical or applied focus, often assessed through a mixture of coursework and exams.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>• BTEC / vocational qualifications</li>
                <li>• Real-world projects and assignments</li>
                <li>• Progression to university, apprenticeships or work</li>
              </ul>
              <Link
                href="/sixth-form/courses"
                className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                View course list
              </Link>
            </article>

            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Mixed pathway
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Combine A level and vocational qualifications to build a programme that matches your strengths and plans.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>• Flexible combinations</li>
                <li>• Keeps options open for future choices</li>
                <li>• Support to choose the right mix</li>
              </ul>
              <Link
                href="/sixth-form/courses"
                className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                View course list
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* SUPPORT & GUIDANCE */}
      <section
        id="support"
        className="bg-morpeth-offwhite"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              Support, guidance and wellbeing
            </h2>
            <div className="mt-3 grid gap-6 md:grid-cols-3">
              <div className="relative space-y-3 text-sm leading-relaxed text-slate-700 md:col-span-2">
                <p>
                  At Morpeth Sixth Form you will have a dedicated tutor who you see regularly, as well as access to our
                  Sixth Form leadership team, learning mentors and safeguarding staff.
                </p>

                <div className={supportExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                  <p>
                    We take wellbeing seriously. You&apos;ll get help balancing workload, planning revision and looking after your
                    mental health so you can perform at your best.
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    <li>• Personal tutor and regular one-to-one check-ins</li>
                    <li>• Study skills and revision support</li>
                    <li>• SEND and additional needs support where required</li>
                    <li>• Access to counselling and wider wellbeing services</li>
                  </ul>
                </div>

                {!supportExpanded && (
                  <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-morpeth-offwhite sm:hidden" />
                )}

                <button
                  type="button"
                  onClick={() => setSupportExpanded((v) => !v)}
                  className="mt-4 inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
                >
                  {supportExpanded ? "Show less" : "Read more"}
                </button>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                <h3 className="font-semibold text-slate-900">Careers &amp; next steps</h3>
                <p>
                  You will receive impartial advice about university, apprenticeships and employment, plus support with
                  applications, personal statements and interviews.
                </p>
                <Link
                  href="/sixth-form/support"
                  className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  Support &amp; guidance
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* LIFE IN SIXTH FORM */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-6">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Beyond the classroom
            </p>
            <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              Life in Morpeth Sixth Form
            </h2>
            <div className="relative mt-3 text-sm leading-relaxed text-slate-700">
              <p>
                Sixth Form is about more than lessons. You&apos;ll build friendships, grow in confidence and take on new
                experiences and responsibilities.
              </p>
              <div className={lifeExpanded ? "mt-3" : "hidden mt-3 sm:block"}>
                <p>
                  Enrichment, leadership and great facilities help you develop as a student and as a person.
                </p>
              </div>
              {!lifeExpanded && (
                <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-slate-50 sm:hidden" />
              )}
              <button
                type="button"
                onClick={() => setLifeExpanded((v) => !v)}
                className="mt-4 inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
              >
                {lifeExpanded ? "Show less" : "Read more"}
              </button>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Enrichment &amp; leadership
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Join clubs and societies, take part in trips and visits, and get involved in student leadership.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>• Subject clubs and competitions</li>
                <li>• Sports, arts and performance</li>
                <li>• Student leadership and mentoring</li>
              </ul>
              <Link
                href="/sixth-form/enrichment"
                className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Enrichment in Sixth Form
              </Link>
            </article>

            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Study spaces &amp; facilities
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Dedicated Sixth Form spaces for quiet study, group work and social time, plus access to specialist facilities.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>• Silent and quiet study areas</li>
                <li>• Group work rooms and ICT access</li>
                <li>• Specialist facilities for arts, sciences and technology</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* RESULTS & DESTINATIONS */}
      <section
        id="destinations"
        className="bg-morpeth-offwhite"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-6">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Results &amp; destinations
            </p>
            <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              High aspirations, strong outcomes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Our students move on to a wide range of destinations including university, apprenticeships and employment.
              We are proud of their achievements and the progress they make during their time with us.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl bg-morpeth-navy p-6 text-morpeth-light shadow-sm ring-1 ring-morpeth-navy/20 transition hover:-translate-y-0.5 hover:shadow-lg">
              <h3 className="text-sm font-semibold tracking-[0.18em] uppercase">
                Results &amp; performance
              </h3>
              <p className="mt-3 text-sm leading-relaxed">
                Headline Sixth Form results and performance measures are published each year and shared with students and families.
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                We use this information to continually evaluate and improve our provision so that every cohort is as successful as possible.
              </p>
              <Link
                href="/our-school/results"
                className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                View whole-school results
              </Link>
            </article>

            <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Destinations after Sixth Form
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Students progress to a range of universities, apprenticeships and employment routes across London and beyond.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>• University courses across a wide range of subjects</li>
                <li>• Higher and degree-level apprenticeships</li>
                <li>• Employment with training</li>
              </ul>
              <Link
                href="/sixth-form/destinations"
                className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Destinations overview
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* HOW TO APPLY */}
      <section
        id="apply"
        className="bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              How to apply
            </p>
            <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              Joining Morpeth Sixth Form
            </h2>
            <div className="relative mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                Applications for Morpeth Sixth Form usually open in the autumn term. We welcome applications from Morpeth
                students and from young people at other schools.
              </p>

              <div className={applyExpanded ? "space-y-3" : "hidden space-y-3 sm:block"}>
                <p>
                  You will be invited to a guidance meeting to discuss your course choices and ensure your programme is right for you.
                </p>
                <p>
                  Final offers are subject to GCSE results and entry requirements for individual courses.
                </p>
              </div>

              {!applyExpanded && (
                <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-slate-50 sm:hidden" />
              )}

              <button
                type="button"
                onClick={() => setApplyExpanded((v) => !v)}
                className="mt-4 inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 sm:hidden"
              >
                {applyExpanded ? "Show less" : "Read more"}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/sixth-form/apply"
                className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Apply online
              </Link>
              <a
                href="/Documents/sixth-form-prospectus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Sixth Form prospectus (PDF)
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
              >
                Contact Sixth Form team
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
