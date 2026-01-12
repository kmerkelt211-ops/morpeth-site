// app/news/page.tsx
import Link from "next/link";
import { client } from "../../sanity/client";

export const revalidate = 60;

// Query both possible types, ignore drafts, and include a robust image fallback
const QUERY = `
*[_type in ["post","newsPost"] && defined(slug.current) && !(_id in path("drafts.**"))]
| order(coalesce(publishedAt, _createdAt) desc)[0...12]{
  title,
  "slug": slug.current,
  "date": coalesce(publishedAt, _createdAt),
  excerpt,
  // try common image fields and pull direct URLs
  "imageUrl": coalesce(
    mainImage.asset->url,
    heroImage.asset->url,
    coverImage.asset->url,
    featuredImage.asset->url,
    leadImage.asset->url,
    image.asset->url,
    images[0].asset->url,
    gallery[0].asset->url
  )
}
`;

type Post = {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  imageUrl?: string | null;
};

export default async function NewsIndex() {
  const posts = await client.fetch<Post[]>(QUERY);

  return (
    <main className="bg-white pb-16 md:pb-24">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-10 md:pb-28 mb-16 md:mb-24">
        <h1 className="text-lg md:text-2xl font-heading uppercase tracking-[0.18em] text-morpeth-navy">
          Latest News
        </h1>

        {posts.length === 0 ? (
          <p className="mt-6 text-slate-600">No news posts yet.</p>
        ) : (
          <div className="mt-6 mb-12 md:mb-16 grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article
                key={p.slug}
                className="group relative overflow-hidden rounded-lg bg-morpeth-offwhite shadow-card"
              >
                {p.imageUrl ? (
                  <div className="relative h-36 md:h-44 w-full overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 md:h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="h-2 w-full bg-slate-200" />
                )}

                <div className="p-4 md:p-5">
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(p.date))}
                  </p>

                  <h2 className="mt-1 text-base md:text-lg font-heading uppercase tracking-[0.14em] text-morpeth-navy line-clamp-2">
                    <Link href={`/news/${p.slug}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </h2>

                  {p.excerpt && (
                    <p className="mt-1 md:mt-2 line-clamp-3 text-xs md:text-sm text-slate-800">{p.excerpt}</p>
                  )}

                  <div className="mt-3 md:mt-4">
                    <Link
                      href={`/news/${p.slug}`}
                      className="text-xs md:text-sm font-medium text-morpeth-navy underline-offset-4 hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}