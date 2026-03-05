import Image from "next/image";
import Link from "next/link";
import { client } from "../../sanity/client";

export const revalidate = 300;

type SpotlightListItem = {
  id: string;
  title: string;
  studentName?: string;
  yearGroup?: string;
  achievementTag?: string;
  highlight?: string;
  summary?: string;
  date: string;
  imageUrl?: string;
  imageAlt?: string;
};

const SPOTLIGHTS_QUERY = `
*[_type == "studentSpotlight" && coalesce(publishedAt, _createdAt) <= now() && !(_id in path("drafts.**"))]
| order(coalesce(publishedAt, _createdAt) desc)[0...100]{
  "id": _id,
  title,
  studentName,
  yearGroup,
  achievementTag,
  highlight,
  summary,
  "date": coalesce(publishedAt, _createdAt),
  "imageUrl": coalesce(photo.asset->url, backgroundImage.asset->url),
  "imageAlt": coalesce(photo.alt, backgroundImage.alt, title)
}
`;

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function StudentSpotlightsPage() {
  const posts = await client.fetch<SpotlightListItem[]>(SPOTLIGHTS_QUERY);

  return (
    <main className="bg-white pb-16 md:pb-24">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-10 md:pb-28 mb-16 md:mb-24">
        <h1 className="text-lg md:text-2xl font-heading uppercase tracking-[0.18em] text-morpeth-navy">
          Student Spotlights
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Achievement stories from our students.
        </p>

        {posts.length === 0 ? (
          <p className="mt-6 text-slate-600">No spotlights available right now.</p>
        ) : (
          <div className="mt-6 mb-12 md:mb-16 grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/student-spotlights/${encodeURIComponent(post.id)}`}
                className="group relative overflow-hidden rounded-lg bg-morpeth-offwhite shadow-card"
              >
                {post.imageUrl ? (
                  <div className="relative h-36 md:h-44 w-full overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 md:h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="h-2 w-full bg-slate-200" />
                )}

                <div className="p-4 md:p-5">
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {formatDate(post.date)}
                  </p>
                  <h2 className="mt-1 text-base md:text-lg font-heading uppercase tracking-[0.14em] text-morpeth-navy line-clamp-2">
                    {post.title}
                  </h2>

                  {post.studentName || post.yearGroup ? (
                    <p className="mt-1 text-xs md:text-sm text-slate-700">
                      {[post.studentName, post.yearGroup].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}

                  <p className="mt-2 line-clamp-3 text-xs md:text-sm text-slate-800">
                    {post.summary || post.highlight || "Read the full spotlight."}
                  </p>

                  <p className="mt-3 md:mt-4 text-xs md:text-sm font-medium text-morpeth-navy underline-offset-4 group-hover:underline">
                    Read spotlight
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
