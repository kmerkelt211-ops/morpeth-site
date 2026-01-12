import Link from 'next/link'

export default function GalleryAboutPage() {
  return (
    <main className="relative min-h-screen bg-white px-6 py-16 text-neutral-900 md:px-10 lg:px-20">
      {/* halftone background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 halftone-soft opacity-20"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Top back link + label */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/gallery"
            className="font-exhibitions inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-800"
          >
            ← Back to gallery
          </Link>
          <span className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
            Portman Gallery • About
          </span>
        </div>

        {/* Hero band */}
        <section className="mb-16 border border-neutral-200 bg-[#88B4A8] text-white">
          <div className="px-8 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
            <p className="font-exhibitions text-xs tracking-[0.35em]">
              PORTMAN GALLERY
            </p>

            <h1 className="font-exhibitions mt-4 text-3xl tracking-[0.16em] md:text-4xl lg:text-5xl">
              A world of student art
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed md:text-base">
              Regular shows of work from across Morpeth School. A working gallery where students,
              staff and collaborators experiment, exhibit and share what they&apos;re making.
            </p>
          </div>
        </section>

        {/* Main body – Tate-style two-column layout */}
        <section
          id="stories"
          className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
        >
          {/* Left: narrative content */}
          <article className="space-y-10">
            <div>
              <h2 className="font-exhibitions text-xs tracking-[0.35em] text-neutral-700">
                ABOUT THE SPACE
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-800">
                The Portman Gallery is Morpeth School&apos;s dedicated exhibition space. It sits at
                the centre of the art &amp; photography department and is used as a working studio,
                project room and public-facing gallery.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                Shows change throughout the year. Some exhibitions are curated by staff, others are
                built in collaboration with students, visiting artists and community partners. The
                space is designed to feel flexible: part classroom, part studio, part white cube.
              </p>
            </div>

            <div>
              <h3 className="font-exhibitions text-sm tracking-[0.26em] text-neutral-900">
                History &amp; stories
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                Placeholder copy — swap this with a short history of the gallery: when it opened,
                key projects, and any moments that feel important to your students. You might mention
                early darkroom projects, the first whole-school exhibition, or collaborations with
                local organisations.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                Use this section to capture how the space is used day-to-day: classes visiting to
                research, GCSE and A level groups testing ideas, or younger year groups seeing older
                students&apos; work for the first time.
              </p>
            </div>

            <div>
              <h3 className="font-exhibitions text-sm tracking-[0.26em] text-neutral-900">
                Working with students
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                Placeholder: describe how students curate their own shows, write wall text, design
                posters and help install work. You can also note how the gallery links to clubs,
                enrichment and coursework.
              </p>
            </div>

            <div>
              <h3 className="font-exhibitions text-sm tracking-[0.26em] text-neutral-900">
                Community &amp; visitors
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                Placeholder: add information about who is welcome to visit (families, local schools,
                partners), how groups usually book, and any special events like private views or
                evening openings.
              </p>
            </div>
          </article>

          {/* Right: info column – like Tate artwork meta */}
          <aside className="space-y-8">
            <div className="border border-neutral-200 bg-white p-6">
              <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                QUICK FACTS
              </h2>
              <dl className="mt-4 space-y-3 text-sm text-neutral-800">
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <dt className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                    Location
                  </dt>
                  <dd>Portman Gallery, Morpeth School, Bethnal Green</dd>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <dt className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                    Open
                  </dt>
                  <dd>School days, by arrangement with the Art &amp; Photography department</dd>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <dt className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                    Focus
                  </dt>
                  <dd>Student work, staff practice, visiting artists and community projects</dd>
                </div>
              </dl>
            </div>

            <div className="border border-neutral-200 bg-white p-6">
              <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                PAST EXHIBITIONS
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-neutral-800">
                <li>Placeholder: &quot;Bethnal Green in 35mm&quot; – Year 11 photography project</li>
                <li>Placeholder: &quot;Between Lessons&quot; – staff exhibition</li>
                <li>Placeholder: &quot;City Lines&quot; – KS3 &amp; KS4 mixed-media show</li>
              </ul>
              <p className="mt-3 text-xs text-neutral-600">
                Swap these for real titles and years when you have them.
              </p>
            </div>

            <div className="border border-neutral-200 bg-white p-6">
              <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                FUTURE / IN DEVELOPMENT
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-neutral-800">
                <li>Placeholder: Digital-only shows curated from clubs and coursework</li>
                <li>Placeholder: Joint projects with local galleries or universities</li>
                <li>Placeholder: Annual &quot;best-of&quot; show across all year groups</li>
              </ul>
            </div>

            <div className="border border-neutral-200 bg-white p-6">
              <h2 className="font-exhibitions text-[10px] uppercase tracking-[0.26em] text-neutral-600">
                COMMUNITY LINKS
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-neutral-800">
                <li>
                  Placeholder link – add local gallery / museum{' '}
                  <span className="text-neutral-500">(e.g. &quot;Link to partner gallery&quot;)</span>
                </li>
                <li>Placeholder – art organisations, workshops, festival partners</li>
                <li>Placeholder – any online resources you want students / families to visit</li>
              </ul>
            </div>
          </aside>
        </section>

        {/* Image strip / gallery snapshots */}
        <section className="mt-16 border-t border-neutral-200 pt-12">
          <h2 className="font-exhibitions text-xs tracking-[0.35em] text-neutral-700">
            GALLERY SNAPSHOTS
          </h2>
          <p className="mt-3 text-sm text-neutral-800">
            Swap these blocks for real installation photographs, student close-ups or project
            details.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="aspect-[4/3] border border-neutral-200 bg-neutral-100" />
            <div className="aspect-[4/3] border border-neutral-200 bg-neutral-100" />
            <div className="aspect-[4/3] border border-neutral-200 bg-neutral-100" />
          </div>
        </section>

        {/* Bottom back link */}
        <div className="mt-16">
          <Link
            href="/gallery"
            className="font-exhibitions inline-flex items-center gap-2 border border-neutral-900 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-neutral-900"
          >
            ← Back to gallery
          </Link>
        </div>
      </div>
    </main>
  )
}