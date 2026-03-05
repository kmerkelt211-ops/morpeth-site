import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "../../../sanity/client";

export const revalidate = 300;
export const dynamicParams = true;

type SpotlightPost = {
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
  linkedNewsHref?: string;
};

const SPOTLIGHT_BY_ID_QUERY = `
*[_type == "studentSpotlight" && _id == $id && !(_id in path("drafts.**"))][0]{
  "id": _id,
  title,
  studentName,
  yearGroup,
  achievementTag,
  highlight,
  summary,
  "date": coalesce(publishedAt, _createdAt),
  "imageUrl": coalesce(photo.asset->url, backgroundImage.asset->url),
  "imageAlt": coalesce(photo.alt, backgroundImage.alt, title),
  "linkedNewsHref": select(
    defined(linkedPost->slug.current) => "/news/" + linkedPost->slug.current,
    null
  )
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

export default async function StudentSpotlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const post = await client.fetch<SpotlightPost | null>(SPOTLIGHT_BY_ID_QUERY, { id });

  if (!post) return notFound();

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

        {post.achievementTag ? (
          <p className="text-[11px] uppercase tracking-[0.16em] text-morpeth-mid">{post.achievementTag}</p>
        ) : null}
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{formatDate(post.date)}</p>
        <h1 className="mt-2 text-3xl font-heading uppercase tracking-[0.08em] text-morpeth-navy">{post.title}</h1>

        {post.studentName || post.yearGroup ? (
          <p className="mt-3 text-slate-700">{[post.studentName, post.yearGroup].filter(Boolean).join(" · ")}</p>
        ) : null}

        {post.summary ? <p className="mt-6 text-slate-800">{post.summary}</p> : null}
        {post.highlight ? (
          <blockquote className="mt-6 rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4 text-slate-800">
            “{post.highlight}”
          </blockquote>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/student-spotlights"
            className="inline-flex rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy"
          >
            Back to spotlights
          </Link>
          {post.linkedNewsHref ? (
            <Link
              href={post.linkedNewsHref}
              className="inline-flex rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy"
            >
              Read related news
            </Link>
          ) : null}
        </div>
      </section>
    </article>
  );
}
