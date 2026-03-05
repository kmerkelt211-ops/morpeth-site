import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchInstagramNewsPosts } from "../../../../lib/instagramFeed";

export const revalidate = 300;
export const dynamicParams = true;

function formatDisplayDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function splitCaption(caption?: string): string[] {
  if (!caption) return [];
  return caption
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function InstagramNewsPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posts = await fetchInstagramNewsPosts({ limit: 200, revalidateSeconds: revalidate });
  const post = posts.find((entry) => entry.id === id);

  if (!post) return notFound();

  const captionLines = splitCaption(post.excerpt);

  return (
    <article className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-12">
        {post.imageUrl ? (
          <div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={post.imageUrl}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {formatDisplayDate(post.date)}
        </p>
        <h1 className="mt-2 text-3xl font-heading uppercase tracking-[0.08em] text-morpeth-navy">
          {post.title}
        </h1>

        {captionLines.length > 0 ? (
          <div className="mt-6 space-y-4 text-slate-800">
            {captionLines.map((line, index) => (
              <p key={`${post.id}-${index}`}>{line}</p>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-slate-700">No caption text was provided for this post.</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/news"
            className="inline-flex rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy"
          >
            Back to news
          </Link>
          <a
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy"
          >
            Open on Instagram
          </a>
        </div>
      </section>
    </article>
  );
}
