// app/news/page.tsx
import Image from "next/image";
import Link from "next/link";
import { fetchInstagramNewsPosts } from "../../lib/instagramFeed";

export const revalidate = 300;

function formatDisplayDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default async function NewsIndex() {
  const posts = await fetchInstagramNewsPosts({ limit: 200, revalidateSeconds: revalidate });

  return (
    <main className="bg-white pb-16 md:pb-24">
      <section
        data-reveal-ignore="true"
        className="mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-10 md:pb-28 mb-16 md:mb-24"
      >
        <h1 className="text-lg md:text-2xl font-heading uppercase tracking-[0.18em] text-morpeth-navy">
          Latest News
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Live feed from Instagram.
        </p>

        {posts.length === 0 ? (
          <p className="mt-6 text-slate-600">
            No Instagram posts available right now.
          </p>
        ) : (
          <div className="mt-6 mb-12 md:mb-16 grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-lg bg-morpeth-offwhite shadow-card"
              >
                {p.imageUrl ? (
                  <div className="relative h-36 md:h-44 w-full overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
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
                    {formatDisplayDate(p.date)}
                  </p>

                  <h2 className="mt-1 text-base md:text-lg font-heading uppercase tracking-[0.14em] text-morpeth-navy line-clamp-2">
                    <Link
                      href={`/news/instagram/${encodeURIComponent(p.id)}`}
                      className="hover:underline underline-offset-4"
                    >
                      {p.title}
                    </Link>
                  </h2>

                  {p.excerpt && (
                    <p className="mt-1 md:mt-2 line-clamp-3 text-xs md:text-sm text-slate-800">{p.excerpt}</p>
                  )}

                  <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/news/instagram/${encodeURIComponent(p.id)}`}
                      className="text-xs md:text-sm font-medium text-morpeth-navy underline-offset-4 hover:underline"
                    >
                      Read full post
                    </Link>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs md:text-sm font-medium text-morpeth-navy underline-offset-4 hover:underline"
                    >
                      Open on Instagram →
                    </a>
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
