import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../../sanity/client";

type FaqItem = {
  question?: string;
  answer?: PortableTextBlock[];
};

type CoachingCirclesRow = {
  introTitle?: string;
  introBody?: PortableTextBlock[];
  parentGuideUrl?: string;
  faq?: FaqItem[];
  images?: Array<{ url?: string }>;
};

const QUERY = `*[_type == "coachingCircles"] | order(_updatedAt desc)[0]{
  introTitle,
  introBody,
  "parentGuideUrl": parentGuide.asset->url,
  faq[]{
    question,
    answer
  },
  "images": images[]{
    "url": asset->url
  }
}`;

const FALLBACK = {
  introTitle: "Coaching Circles",
  introBody: [
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "Coaching Circles provide regular, structured time with a trusted adult to reflect on learning, wellbeing and next steps.",
        },
      ],
    },
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "This page is now ready for your final content in Sanity, including FAQs, images and a downloadable parent guide.",
        },
      ],
    },
  ] as PortableTextBlock[],
  faq: [] as FaqItem[],
  images: [] as Array<{ url?: string }>,
  parentGuideUrl: "",
};

export const metadata = {
  title: "Coaching Circles | Morpeth School",
  description:
    "How Coaching Circles support reflection, wellbeing and progress for students at Morpeth School.",
};

export default async function CoachingCirclesPage() {
  let data: CoachingCirclesRow = FALLBACK;

  try {
    const result = await client.fetch<CoachingCirclesRow | null>(QUERY);
    if (result) {
      data = {
        introTitle: result.introTitle || FALLBACK.introTitle,
        introBody: Array.isArray(result.introBody) && result.introBody.length > 0 ? result.introBody : FALLBACK.introBody,
        parentGuideUrl: result.parentGuideUrl || "",
        faq: Array.isArray(result.faq) ? result.faq : [],
        images: Array.isArray(result.images) ? result.images.filter((item) => Boolean(item?.url)) : [],
      };
    }
  } catch {
    data = FALLBACK;
  }

  return (
    <main className="min-h-screen bg-morpeth-offwhite text-slate-900">
      <section className="bg-morpeth-navy text-morpeth-light">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/90">Our School</p>
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-[0.14em] md:text-4xl">
            {data.introTitle || "Coaching Circles"}
          </h1>
          <div className="prose prose-invert mt-4 max-w-3xl prose-sm md:prose-base">
            <PortableText value={data.introBody || []} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/our-school"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy"
            >
              Back to Our School
            </Link>
            {data.parentGuideUrl ? (
              <a
                href={data.parentGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-morpeth-light/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light"
              >
                Parent Guide (PDF)
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {data.images && data.images.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {data.images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={`Coaching Circles image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
        <article className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-sm md:p-6">
          <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">Frequently asked questions</h2>
          {data.faq && data.faq.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.faq.map((item, index) => (
                <details key={`${item.question}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-morpeth-navy">
                    {item.question || "Question"}
                  </summary>
                  <div className="prose mt-2 max-w-none prose-sm prose-slate">
                    <PortableText value={Array.isArray(item.answer) ? item.answer : []} />
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-700">
              FAQs can be added in Sanity under the Coaching Circles document.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}
