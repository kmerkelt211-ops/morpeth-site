import client from '../../../sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'

export default async function StudentWorkPage() {
  const data = await client.fetch(`
    *[_type == "galleryExhibition" && exhibitorType == "student"] 
      | order(startDate desc) {
        _id,
        title,
        subtitle,
        description,
        slug,
        "heroImageUrl": heroImages[0].asset->url
      }
  `)

  return (
    <main className="px-6 py-20 md:px-12 lg:px-20">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/gallery"
            className="font-exhibitions inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-800"
          >
            ← Gallery
          </Link>
        </div>
      </div>

      <h1 className="font-exhibitions text-4xl tracking-[0.14em] mb-10">
        Student Work
      </h1>

      <section className="mb-12 max-w-3xl">
        <p className="font-exhibitions text-xs tracking-[0.35em] text-neutral-500">
          STUDENT WORK
        </p>
        <h2 className="font-exhibitions mt-4 text-xl font-normal tracking-[0.16em]">
          From first sketches to final shows
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-700">
          Work produced across KS3, GCSE and Sixth Form courses, including drawing, painting,
          lens-based media, print and installation. Selected pieces are shown here and in the
          gallery across the year.
        </p>
      </section>

      <div className="grid gap-10 md:grid-cols-3">
        {data.map((ex: any) => (
          <Link key={ex._id} href={`/gallery/${ex.slug.current}`} className="block">
            <div className="relative aspect-[4/5] bg-neutral-200">
              {ex.heroImageUrl && (
                <Image src={ex.heroImageUrl} alt={ex.title} fill className="object-cover" />
              )}
            </div>
            <h3 className="font-exhibitions mt-4 text-lg tracking-[0.12em]">{ex.title}</h3>
            <p className="text-sm text-neutral-700 mt-2">{ex.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}