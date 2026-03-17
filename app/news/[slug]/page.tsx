// app/news/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import { client } from "../../../sanity/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { Metadata } from "next";
import { publicEnv } from "../../../lib/env";

const builder = imageUrlBuilder(client);
const urlFor = (source: Record<string, unknown>) => builder.image(source);

export const revalidate = 60;
export const dynamicParams = true;
const SITE_URL = publicEnv.siteUrl;

const QUERY = `
*[_type in ["post", "newsPost"] && slug.current == $slug && !(_id in path("drafts.**"))][0]{
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
  body?: TypedObject[];
  hero?: {
    alt?: string;
    asset?: { _ref?: string; url?: string };
  };
};

function normaliseSlug(rawSlug: string | string[] | undefined) {
  return decodeURIComponent((Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || "").trim();
}

async function getPostBySlug(slug: string) {
  let post = await client.fetch<Post | null>(QUERY, { slug });

  // Guard against accidental case mismatches.
  if (!post && slug && slug !== slug.toLowerCase()) {
    post = await client.fetch<Post | null>(QUERY, { slug: slug.toLowerCase() });
  }

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normaliseSlug(rawSlug);
  const post = slug ? await getPostBySlug(slug) : null;

  if (!post) {
    return {
      title: "News | Morpeth School",
      description: "Latest updates, stories and achievements from Morpeth School.",
    };
  }

  const storyPath = `/news/${slug}`;
  const imageUrl = `${SITE_URL}${storyPath}/opengraph-image`;

  return {
    title: `${post.title} | Morpeth School`,
    description: post.excerpt || "Latest updates and stories from Morpeth School.",
    openGraph: {
      type: "article",
      url: `${SITE_URL}${storyPath}`,
      title: post.title,
      description: post.excerpt || "Latest updates and stories from Morpeth School.",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} - Morpeth School`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Latest updates and stories from Morpeth School.",
      images: [imageUrl],
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const resolvedSlug = normaliseSlug(rawSlug);
  const post = await getPostBySlug(resolvedSlug);

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
    `*[_type in ["post", "newsPost"] && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`
  );
  return slugs.map((s) => ({ slug: s.slug }));
}
