import Image from "next/image"
import Link from "next/link"

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-morpeth-offwhite">
      {/* HERO */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/images/history-hero.jpg"
            alt="Students at Morpeth School"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/20" />
        </div>

        <div className="relative mx-auto flex min-h-[50vh] max-w-6xl flex-col justify-center px-4 py-16 md:py-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-morpeth-light">
            Our story
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white uppercase tracking-[0.14em] md:text-4xl">
            A History of Morpeth
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100">
            From its beginnings as a London County Council central school to a
            modern, inclusive comprehensive, Morpeth has served the young
            people of East London for more than a century.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-10 md:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row">
          {/* TEXT COLUMN */}
          <div className="md:flex-[3]">
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 md:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-morpeth-navy md:text-sm">
                  OUR STORY
                </p>
                <p className="mt-1 text-sm text-slate-700 md:text-base">
                  More than a century of learning in the heart of East London.
                </p>
              </div>
              <article className="px-5 py-6 text-sm leading-relaxed text-slate-800 space-y-4 md:px-8 md:py-8 md:text-base">
                <h2 className="mt-0 text-sm font-semibold tracking-[0.18em] text-morpeth-navy md:text-base">
                  Beginnings as a central school
                </h2>
                <p>
                  Morpeth School began life in 1910 when the LCC (London County
                  Council) committed to the construction of new “central schools”
                  across the capital. The aim of these schools was to provide a
                  rigorous and academically focused curriculum that would serve the
                  most able pupils living in some of London&apos;s poorest areas.
                </p>
                <p>
                  As such, an entrance exam was set up and the first intake of
                  Morpeth pupils in 1911 (from across a range of age groups) made up
                  the top 5% of the high ability band in the old Metropolitan
                  Borough of Bethnal Green. Thus, Morpeth Street Central School
                  began life in what is now our East Wing (or Maths Block).
                </p>
                <p>
                  In recognition of the LCC&apos;s achievement in getting these new
                  central schools up and running so quickly, Morpeth Street was
                  asked to send two pupils to the coronation of King George V. A
                  wonderful photo exists of Lily Drew and Annie Cherry presenting
                  the new King with bouquets of flowers.
                </p>

                <h2>Growing with the community</h2>
                <p>
                  However, as is perhaps characteristic of a busy London borough, it
                  soon became clear that more school places were needed for older
                  pupils. Just opposite Morpeth Street School sat Portman Place
                  Primary School (now known as our West Wing or English block); the
                  latter school was closed, and the two buildings merged to form an
                  enlarged Morpeth Street School in 1927.
                </p>
                <p>
                  The destruction of the imposing wall that once separated the two
                  buildings brought with it the uprooting of two old mulberry trees
                  on the site. Pupils and staff were very upset, shaken perhaps by
                  the significantly reduced emphasis on planning and preservation
                  that we expect today.
                </p>
                <p>
                  A competition was launched in school to design a badge and tie
                  that would immortalise the two mulberry trees; the winner&apos;s
                  work survives to this day and we retain the same crest and tie
                  design. Our story – one that is overwhelmingly dominated by a
                  passionate commitment to the inclusive education of local children
                  – begins here.
                </p>

                <h2>Conflict and evacuation</h2>
                <p>
                  Given Morpeth&apos;s location in the East End of London, the two
                  great conflicts of the twentieth century were never far away. The
                  First World War brought tragedy to the school gates; many older
                  pupils who had joined in 1911 were killed in the final offensives
                  of 1917–1918.
                </p>
                <p>
                  In 2014, the centenary of the outbreak of hostilities, we carried
                  out extensive research on a former pupil. Walter Alfred Gillings
                  was killed in Belgium in June 1917 on the first day of the Battle
                  of Messines. His body was never found; before 2014, the only
                  reference to him was on the Menin Gate Memorial to the Missing in
                  Ypres.
                </p>
                <p>
                  Of course, the Second World War broke out just 21 years later and
                  Morpeth found itself on the front line after the start of the
                  Blitz in September 1940. The Headmaster was initially reluctant to
                  evacuate; the mass evacuation of children from the area which had
                  started in September 1939 was already a relative failure by 1940
                  and the LCC was obliged to continue the education of the many
                  thousands of children who returned.
                </p>
                <p>
                  However, as bombing intensified throughout the autumn of 1940, the
                  railway line bordering the school and houses on Morpeth Street
                  were badly damaged. The roof of the West Wing was destroyed by
                  incendiaries and it became impossible to operate the site as a
                  school. So, with some reluctance, Morpeth relocated to Bury St
                  Edmunds in Suffolk and made an attempt to continue the education
                  of local children.
                </p>
                <p>
                  The Morpeth site doubled up as a rest centre for the ARP and as HQ
                  for the anti-aircraft crews who operated in Victoria Park.
                  However, many children still chose to stay, as London entered the
                  full throes of war, with many children&apos;s education
                  prematurely stopped to assist with running homes in wartime.
                  Indeed, some pupils who stayed behind were victims of the Bethnal
                  Green Tube disaster in March 1943 which claimed the lives of 178
                  local people.
                </p>

                <h2>Post-war rebuilding and comprehensive education</h2>
                <p>
                  The end of the war opened a new chapter for Morpeth. The 1944
                  Butler Act significantly extended educational requirements for
                  children, and we rose to the challenge. With initially very little
                  funding, the buildings were repaired and the school was back in
                  business.
                </p>
                <p>
                  The post-war years brought huge sporting success, a dramatic rise
                  in the popularity of the Arts as well as unique contacts with
                  local employers who provided thousands of opportunities for
                  Morpeth pupils over the years. Further expansion came during the
                  late 1960s with the construction of a new North Wing, as Morpeth
                  became a flagship for the Wilson government&apos;s new
                  comprehensive school model.
                </p>

                <h2>Morpeth today</h2>
                <p>
                  In the modern educational era, Morpeth continues to expand and
                  innovate; the 1960s North Wing has been replaced by a completely
                  new building. New sports and music facilities, along with superb
                  classrooms and landscaping, have been created as a result.
                </p>
                <p>
                  We continue to offer a huge range of GCSE and A Level courses and
                  still provide an outstanding, and inclusive, education for
                  children living in East London. In this respect, as we move into
                  our 116th year, we proudly uphold the LCC&apos;s original vision
                  for a rigorous curriculum which has high expectations of the young
                  people in our care.
                </p>

                <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-600">
                  <p>
                    If you have memories, photographs or stories about Morpeth&apos;s
                    history that you would be happy to share, please contact the
                    school office – we would love to hear from you.
                  </p>
                </div>
              </article>
            </div>
          </div>

          {/* IMAGE COLUMN */}
          <aside className="space-y-4 md:flex-[2]">
            {/* Annie Cherry & Lily Drew */}
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/morpeth-old-0.jpg"
                  alt="Annie Cherry and Lily Drew representing Morpeth at the coronation of King George V"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-4 text-xs leading-relaxed text-slate-700">
                Annie Cherry and Lily Drew, Morpeth pupils invited to present
                bouquets to King George V at his coronation – a proud moment in
                the school&apos;s early history.
              </div>
            </div>

            {/* Walter Alfred Gillings */}
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/morpeth-old-1.jpg"
                  alt="Walter Alfred Gillings, former Morpeth pupil who served in the First World War"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-4 text-xs leading-relaxed text-slate-700">
                Walter Alfred Gillings, a former Morpeth pupil killed in Belgium
                in June 1917 on the first day of the Battle of Messines. His
                story is one of many that connect the school directly to the
                First World War.
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {/* Image 2 */}
              <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/morpeth-old-2.jpg"
                    alt="Students learning at Morpeth"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-xs leading-relaxed text-slate-700">
                  Morpeth has always placed learning, friendship and respect at
                  the heart of school life.
                </div>
              </div>

              {/* Image 3 – update filename if needed */}
              <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/morpeth-old-3.jpg"
                    alt="Historic and modern Morpeth School"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-xs leading-relaxed text-slate-700">
                  Today&apos;s campus combines historic buildings with modern
                  facilities, reflecting more than a century of change.
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              <Link
                href="/our-school"
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 font-semibold uppercase tracking-[0.16em] hover:bg-slate-100"
              >
                ← Back to Our School
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}