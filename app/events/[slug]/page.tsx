import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import { client } from "../../../sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
const urlFor = (source: Record<string, unknown>) => builder.image(source);

export const revalidate = 60;
export const dynamicParams = true;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://morpeth-site.vercel.app";

const QUERY = `
*[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  "date": start,
  start,
  end,
  location,
  audience,
  body,
  "hero": image{asset->{_ref, url}}
}
`;

type EventPost = {
  title: string;
  date: string;
  start?: string;
  end?: string;
  location?: string;
  audience?: string;
  body?: TypedObject[];
  hero?: {
    asset?: { _ref?: string; url?: string };
  };
};

function normaliseSlug(rawSlug: string | string[] | undefined) {
  return decodeURIComponent((Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || "").trim();
}

async function getEventBySlug(slug: string) {
  let event = await client.fetch<EventPost | null>(QUERY, { slug });
  if (!event && slug && slug !== slug.toLowerCase()) {
    event = await client.fetch<EventPost | null>(QUERY, { slug: slug.toLowerCase() });
  }
  return event;
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return "";
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  const startLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: startDate.getHours() === 0 && startDate.getMinutes() === 0 ? undefined : "2-digit",
    minute: startDate.getHours() === 0 && startDate.getMinutes() === 0 ? undefined : "2-digit",
  }).format(startDate);

  if (!endDate) return startLabel;

  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  if (!sameDay) {
    return `${startLabel} - ${new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(endDate)}`;
  }

  const hasTime = !(startDate.getHours() === 0 && startDate.getMinutes() === 0);
  if (!hasTime) return startLabel;

  return `${startLabel} - ${new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(endDate)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normaliseSlug(rawSlug);
  const event = slug ? await getEventBySlug(slug) : null;

  if (!event) {
    return {
      title: "Events | Morpeth School",
      description: "Upcoming events and key dates from Morpeth School.",
    };
  }

  const eventPath = `/events/${slug}`;
  const imageUrl = `${SITE_URL}${eventPath}/opengraph-image`;

  return {
    title: `${event.title} | Morpeth School`,
    description: `Event details for ${event.title}.`,
    openGraph: {
      type: "article",
      url: `${SITE_URL}${eventPath}`,
      title: event.title,
      description: `Event details for ${event.title}.`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${event.title} - Morpeth School`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: `Event details for ${event.title}.`,
      images: [imageUrl],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = normaliseSlug(rawSlug);
  const event = await getEventBySlug(slug);
  if (!event) return notFound();

  const heroSrc = event.hero?.asset?.url
    ? event.hero.asset.url
    : event.hero?.asset?._ref
      ? urlFor(event.hero).width(1600).height(900).fit("crop").url()
      : null;

  const dateRange = formatDateRange(event.start, event.end);

  return (
    <article className="bg-white pb-16">
      <section className="mx-auto max-w-3xl px-4 py-12">
        {heroSrc ? (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image src={heroSrc} alt={event.title} fill className="object-cover" priority />
          </div>
        ) : null}

        <p className="text-[11px] uppercase tracking-[0.18em] text-morpeth-mid">Event</p>
        <h1 className="mt-2 text-3xl font-heading uppercase tracking-[0.08em] text-morpeth-navy">{event.title}</h1>

        <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-morpeth-offwhite p-4 text-sm text-slate-700">
          {dateRange ? (
            <p>
              <span className="font-semibold text-morpeth-navy">Date:</span> {dateRange}
            </p>
          ) : null}
          {event.location ? (
            <p>
              <span className="font-semibold text-morpeth-navy">Location:</span> {event.location}
            </p>
          ) : null}
          {event.audience ? (
            <p>
              <span className="font-semibold text-morpeth-navy">Audience:</span> {event.audience}
            </p>
          ) : null}
        </div>

        {event.body && event.body.length > 0 ? (
          <div className="prose prose-slate mt-8">
            <PortableText value={event.body} />
          </div>
        ) : (
          <p className="mt-8 text-slate-700">
            More details for this event will be shared soon. Check back shortly or see the full calendar.
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/calendar"
            className="inline-flex rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy"
          >
            View full calendar
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy"
          >
            Back to home
          </Link>
        </div>
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "event" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`
  );
  return slugs.map((s) => ({ slug: s.slug }));
}
