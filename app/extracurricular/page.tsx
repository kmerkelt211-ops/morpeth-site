"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ExtracurricularPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO – matches main site hero pattern */}
      <section className="relative bg-morpeth-navy text-morpeth-light">
        {/* Background media (optional video; falls back to solid colour if file missing) */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/extracurricular-hero-poster.jpg"
          >
            <source src="/video/extracurricular-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-morpeth-navy/65 to-morpeth-navy/85" />
        </div>

        {/* Content layer */}
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
            Morpeth School · Enrichment
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">
            Extracurricular &amp; Flexible Learning Timetable
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-morpeth-light/90">
            Our enrichment programme and Flexible Learning Timetable give every student the chance to try new
            things, discover talents and build confidence beyond the classroom.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="#why-enrichment"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Why enrichment matters
            </a>
            <a
              href="#flexible-timetable"
              className="inline-flex items-center justify-center rounded-full border border-morpeth-light/70 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light hover:bg-morpeth-light/10 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Flexible Learning Timetable
            </a>
            <a
              href="#life-beyond-lessons"
              className="inline-flex items-center justify-center rounded-full border border-morpeth-light/50 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light/80 hover:bg-morpeth-light/10 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Life beyond lessons
            </a>
          </div>
        </div>
      </section>

      {/* WHY ENRICHMENT MATTERS */}
      <section
        id="why-enrichment"
        className="bg-morpeth-offwhite"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <article className="group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Why enrichment matters
                </p>
                <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
                  Learning doesn&apos;t stop when lessons finish
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                  <p>
                    At Morpeth, we believe that what happens before school, at lunchtime and after the bell is just as
                    important as what happens in the classroom. Our enrichment programme helps students develop
                    confidence, independence and a sense of belonging.
                  </p>
                  <p>
                    Taking part in extracurricular activities gives students the chance to discover new interests, deepen
                    existing passions and work with staff and peers in different ways. It&apos;s often where friendships are
                    made, leadership skills are practised and future pathways begin to take shape.
                  </p>
                  <p>
                    We encourage every student to take part in at least one regular activity. Our aim is that participation
                    in enrichment becomes a normal, expected part of Morpeth life – not an optional extra for a small group.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                  Enrichment helps students to:
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>• Build confidence and resilience</li>
                  <li>• Work with others and lead projects</li>
                  <li>• Develop talents in sport, arts and academic areas</li>
                  <li>• Strengthen applications for Sixth Form, college and university</li>
                  <li>• Contribute to the wider life and culture of the school</li>
                </ul>
                <p className="mt-3 text-xs text-slate-500">
                  We will publish a full overview of enrichment opportunities later in the year, so families can see what&apos;s
                  on offer across each term.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ENRICHMENT IN ACTION – VIDEO */}
      <section className="bg-slate-50">
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
                poster="/images/extracurricular-enrichment-poster.webp"
              >
                <source src="/video/extracurricular-enrichment.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
            </div>

            {/* Text content */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Enrichment in action
              </p>
              <h2 className="mt-2 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
                What enrichment looks like at Morpeth
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  This short film gives a flavour of Morpeth&apos;s enrichment programme: clubs, rehearsals, fixtures and
                  projects taking place before school, at lunchtime and after lessons finish.
                </p>
                <p>
                  Students talk about why they chose particular activities, what they&apos;ve learned and how taking part has
                  helped them feel more confident and connected to the school.
                </p>
                <p>
                  We regularly refresh the Flexible Learning Timetable so that there is a mix of long-running opportunities
                  and new experiences for students to try across the year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLUB VIDEOS */}
      <section
        id="club-videos"
        className="bg-morpeth-offwhite"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-6">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Club videos
            </p>
            <h2 className="mt-1 font-heading text-2xl text-morpeth-navy uppercase tracking-[0.12em] md:text-3xl">
              A closer look at some of our clubs
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              We are building a library of short club videos so you can see what different activities look and feel like at
              Morpeth. These clips can be shared with students and families when they are choosing how to use the Flexible
              Learning Timetable.
            </p>
          </header>

          <div className="-mx-4 overflow-x-auto pb-2">
            <div className="flex gap-4 px-4 snap-x snap-mandatory">
              {/* Example club video 1 */}
              <article className="flex min-w-[320px] max-w-sm flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-100 shadow-sm snap-center">
                <button
                  type="button"
                  onClick={() => setActiveVideo("/video/club-music.mp4")}
                  className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <video
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    playsInline
                    muted
                    preload="metadata"
                    poster="/images/club-music-poster.webp"
                  >
                    <source src="/video/club-music.mp4" type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                      Play
                    </span>
                  </div>
                </button>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">
                  Music &amp; bands
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  Rehearsals, performances and practice sessions in our music spaces. Students talk about why they enjoy
                  making music together.
                </p>
              </article>

              {/* Example club video 2 */}
              <article className="flex min-w-[320px] max-w-sm flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-100 shadow-sm snap-center">
                <button
                  type="button"
                  onClick={() => setActiveVideo("/video/club-sport.mp4")}
                  className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <video
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    playsInline
                    muted
                    preload="metadata"
                    poster="/images/club-sport-poster.webp"
                  >
                    <source src="/video/club-sport.mp4" type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                      Play
                    </span>
                  </div>
                </button>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">
                  Sport &amp; teams
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  Training sessions, matches and fixtures that show how students represent Morpeth and support one another on
                  and off the pitch.
                </p>
              </article>

              {/* Example club video 3 */}
              <article className="flex min-w-[320px] max-w-sm flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-100 shadow-sm snap-center">
                <button
                  type="button"
                  onClick={() => setActiveVideo("/video/club-creative.mp4")}
                  className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <video
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    playsInline
                    muted
                    preload="metadata"
                    poster="/images/club-creative-poster.webp"
                  >
                    <source src="/video/club-creative.mp4" type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                      Play
                    </span>
                  </div>
                </button>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">
                  Creative &amp; academic clubs
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  From art and drama to STEM, debate and languages, these clips will highlight the range of clubs on offer
                  across the year.
                </p>
              </article>

              {/* Example club video 4 */}
              <article className="flex min-w-[320px] max-w-sm flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-100 shadow-sm snap-center">
                <button
                  type="button"
                  onClick={() => setActiveVideo("/video/club-drama.mp4")}
                  className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <video
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    playsInline
                    muted
                    preload="metadata"
                    poster="/images/club-drama-poster.webp"
                  >
                    <source src="/video/club-drama.mp4" type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                      Play
                    </span>
                  </div>
                </button>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">
                  Drama &amp; performance
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  Work in progress from drama clubs and performance projects, including rehearsals and short showcases.
                </p>
              </article>

              {/* Example club video 5 */}
              <article className="flex min-w-[320px] max-w-sm flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-100 shadow-sm snap-center">
                <button
                  type="button"
                  onClick={() => setActiveVideo("/video/club-stem.mp4")}
                  className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <video
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    playsInline
                    muted
                    preload="metadata"
                    poster="/images/club-stem-poster.webp"
                  >
                    <source src="/video/club-stem.mp4" type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                      Play
                    </span>
                  </div>
                </button>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">
                  STEM &amp; robotics
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  Clips from science, computing and robotics clubs, highlighting problem-solving and teamwork in action.
                </p>
              </article>

              {/* Example club video 6 */}
              <article className="flex min-w-[320px] max-w-sm flex-col rounded-3xl bg-white p-5 ring-1 ring-slate-100 shadow-sm snap-center">
                <button
                  type="button"
                  onClick={() => setActiveVideo("/video/club-reading.mp4")}
                  className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <video
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    playsInline
                    muted
                    preload="metadata"
                    poster="/images/club-reading-poster.webp"
                  >
                    <source src="/video/club-reading.mp4" type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                      Play
                    </span>
                  </div>
                </button>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">
                  Reading &amp; study support
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  A look inside reading groups, homework clubs and quiet study spaces that support learning beyond lessons.
                </p>
              </article>
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            We will continue to add club videos over time so that this section reflects the full range of opportunities
            available through the Flexible Learning Timetable.
          </p>
        </div>
      </section>

      {/* FLEXIBLE LEARNING TIMETABLE */}
      <section
        id="flexible-timetable"
        className="bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-5">
            {/* Left column: explanation */}
            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
                Flexible Learning Timetable
              </p>
              <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
                Morpeth&apos;s programme for extracurricular learning
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                <p>
                  Our Flexible Learning Timetable is the name we give to Morpeth&apos;s extracurricular programme. It brings
                  together after-school clubs, lunchtime activities, rehearsals, fixtures and extended learning sessions into
                  one coherent offer for students.
                </p>
                <p>
                  The timetable is designed so that students can balance homework, family commitments and enrichment. On
                  different days of the week, departments and year teams run activities ranging from sports teams and music
                  groups to subject clinics, homework clubs and creative projects.
                </p>
                <p>
                  Students are encouraged to plan a personalised &quot;flexible timetable&quot; that works for them – mixing
                  physical activity, creative opportunities and additional academic support where needed.
                </p>
              </div>
            </div>

            {/* Right column: how it works + links */}
            <div className="md:col-span-2 space-y-4 text-sm leading-relaxed text-slate-700">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                How it works
              </h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• A published timetable shows what&apos;s on each day of the week</li>
                <li>• Activities are open to different year groups, with clear guidance on who can attend</li>
                <li>• Many activities are free; some trips or specialist opportunities may have a small cost</li>
                <li>• Staff encourage students to build a routine that they can sustain</li>
              </ul>
              <p className="mt-2 text-sm text-slate-700">
                We will share the latest Flexible Learning Timetable with families via letters home and the school website.
                Students also see it in form time and around the school site.
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/Documents/flexible-learning-timetable.pdf"
                  className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  Download example timetable (PDF)
                </Link>
                <a
                  href="https://app.involveeducation.com/involve/display/641ae27ce56da4240591b65b/internal?fullscreen=true&view=week&token=11d9293f15d6d396216369bddacf9b12:d1b9f1fafe5d3d56c857e7fb26351eb5cd0f4e464dd30d4d90d536a5bca66847b2402f2243f6a01ef815e4d92239f364"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                >
                  Peripatetic instrumental lessons timetable
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIFE BEYOND LESSONS */}
      <section
        id="life-beyond-lessons"
        className="bg-morpeth-offwhite"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-6">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Life beyond lessons
            </p>
            <h2 className="mt-1 font-heading text-xl text-morpeth-navy uppercase tracking-[0.12em] md:text-2xl">
              Belonging, participation and pride
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              The Flexible Learning Timetable is about more than fitting in clubs. It is part of how we build a strong
              school community, where every student can find something they enjoy and feel proud of.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Character &amp; confidence
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Activities help students step outside their comfort zone in a safe, supportive environment – whether
                that&apos;s performing on stage, speaking in public, representing the school in a match or leading a project.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Community &amp; culture
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Enrichment brings together students from different year groups and backgrounds. Shared experiences –
                rehearsals, performances, competitions, trips – help to build the sense that Morpeth is a community, not
                just a building.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Ready for next steps
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                When students apply for Sixth Form, college, apprenticeships or university, their experiences through the
                Flexible Learning Timetable give them real examples to talk about – not just grades on a page.
              </p>
            </article>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            We are currently working on a new way to showcase our full enrichment offer on this page. In the meantime,
            families will continue to receive details of activities through letters, newsletters and in-school displays.
          </p>
        </div>
      </section>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-4xl">
            <div className="aspect-video overflow-hidden rounded-2xl bg-black">
              <video
                key={activeVideo}
                className="h-full w-full object-contain"
                controls
                autoPlay
                playsInline
              >
                <source src={activeVideo} type="video/mp4" />
              </video>
            </div>
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute -right-2 -top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow-md"
              aria-label="Close video"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}