/* app/letters-home/page.tsx */
import Link from "next/link";
import { groq } from "next-sanity";
import { client } from "../../sanity/lib/client";

export const metadata = {
  title: "Letters home | Morpeth School",
  description:
    "The latest letters and documents sent to parents and carers at Morpeth School.",
};

// Revalidate every 10 minutes so new letters appear without a full redeploy
export const revalidate = 600;

type Letter = {
  _id: string;
  title: string;
  publishedAt?: string;
  summary?: string;
  audience?: string;           // e.g. "All parents", "Year 10"
  yearGroups?: string[];       // optional array if you tag by year
  url?: string;                // resolved PDF/file URL
};

// GROQ: adjust field names if your schema differs
const LETTERS_QUERY = groq`
  *[_type == "letter" && defined(publishedAt) && (defined(file.asset) || defined(fileUrl))]
  | order(publishedAt desc) {
    _id,
    title,
    summary,
    audience,
    yearGroups,
    publishedAt,
    // resolve a usable URL no matter how you've stored it
    "url": coalesce(file.asset->url, fileUrl)
  }
`;

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

export default async function LettersHomePage() {
  const letters: Letter[] = await client.fetch(LETTERS_QUERY);

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      {/* Page intro / cover text */}
      <section className="relative bg-morpeth-navy text-morpeth-light">
        <div className="relative mx-auto flex min-h-[40vh] max-w-6xl flex-col items-center justify-center px-4 py-12 text-center md:py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
            Parents &amp; Carers
          </p>
          <h1 className="mt-3 font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">
            Letters home
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-morpeth-light/90">
            Find the latest letters and documents sent to parents and carers. We’ll
            keep this page updated throughout the year, and you can download any
            letter as a PDF.
          </p>

          <div className="mt-6">
            <Link
              href="/parents"
              className="rounded-full border border-morpeth-light/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-light hover:bg-morpeth-light/10"
            >
              Back to Parents page
            </Link>
          </div>
        </div>
      </section>

      {/* Letter list */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          {letters.length === 0 ? (
            <p className="text-slate-700">
              There are no letters published yet. Please check back soon.
            </p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {letters.map((l) => (
                <li
                  key={l._id}
                  className="rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70 p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-mid">
                    {formatDate(l.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
                    {l.title}
                  </h2>

                  {l.summary ? (
                    <p className="mt-2 text-sm text-slate-800">{l.summary}</p>
                  ) : null}

                  {/* chips for audience / year groups if present */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {l.audience ? (
                      <span className="rounded-full bg-morpeth-light/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy">
                        {l.audience}
                      </span>
                    ) : null}
                    {Array.isArray(l.yearGroups)
                      ? l.yearGroups.map((yg) => (
                          <span
                            key={yg}
                            className="rounded-full bg-morpeth-light/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy"
                          >
                            {yg}
                          </span>
                        ))
                      : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {l.url ? (
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">
                        No file available
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}