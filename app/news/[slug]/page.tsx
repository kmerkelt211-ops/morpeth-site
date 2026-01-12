// app/news/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "../../../sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

export const revalidate = 60;
export const dynamicParams = true;

const QUERY = `
*[_type == "post" && slug.current == $slug][0]{
  title,
  "date": coalesce(publishedAt, _createdAt),
  excerpt,
  body,
  // Normalised hero image (first non-null of many possible field names)
  "hero": coalesce(
    mainImage{alt, asset->{_ref, url}},
    heroImage{alt, asset->{_ref, url}},
    coverImage{alt, asset->{_ref, url}},
    featuredImage{alt, asset->{_ref, url}},
    leadImage{alt, asset->{_ref, url}},
    image{alt, asset->{_ref, url}},
    images[0]{alt, asset->{_ref, url}},
    gallery[0]{alt, asset->{_ref, url}}
  )
}
`;

type Post = {
  title: string;
  date: string;
  excerpt?: string;
  body?: any;
  hero?: {
    alt?: string;
    asset?: { _ref?: string; url?: string };
  };
};

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap Next.js 16 promise-based params and normalise the slug
  const { slug: rawSlug } = await params;
  const resolvedSlug = decodeURIComponent(
    (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || ""
  ).trim();

  // Try exact match first
  let post = await client.fetch<Post>(QUERY, { slug: resolvedSlug });

  // Fallback: try lower-cased slug (guards against accidental case differences)
  if (!post && resolvedSlug && resolvedSlug !== resolvedSlug.toLowerCase()) {
    post = await client.fetch<Post>(QUERY, { slug: resolvedSlug.toLowerCase() });
  }

  if (!post) return notFound();

  const hero = post.hero;
  const heroSrc = hero?.asset?.url
    ? hero.asset.url
    : hero?.asset?._ref
      ? urlFor(hero).width(1600).height(900).fit("crop").url()
      : null;
  const heroAlt = hero?.alt || post.title;

  return (
    <article className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-12">
        {heroSrc && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(post.date))}
        </p>
        <h1 className="mt-2 text-3xl font-heading text-morpeth-navy">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-4 text-slate-700">{post.excerpt}</p>}
        {post.body && (
          <div className="prose prose-slate mt-6">
            <PortableText value={post.body} />
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/news"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy underline underline-offset-4 hover:opacity-80"
          >
            ← Back to news
          </Link>
        </div>
      </section>
    </article>
  );
}

// (Optional) prebuild slugs for SSG
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
  );
  return slugs.map((s) => ({ slug: s.slug }));
}