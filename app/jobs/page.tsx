// Lightweight skeleton "filler" card for loading/empty states
const SkeletonCard = () => (
  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card animate-pulse">
    <div className="h-3 w-24 rounded bg-slate-200" />
    <div className="mt-3 h-6 w-3/4 rounded bg-slate-200" />
    <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
    <div className="mt-6 h-8 w-24 rounded-full bg-slate-200" />
  </div>
);
import Link from "next/link";
import { client } from "../../sanity/lib/client";

// Helpers for date formatting and badge colour
const formatGB = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

// Days until a date (rounded up)
const daysUntil = (iso?: string) => {
  if (!iso) return null;
  const msLeft = new Date(iso).getTime() - Date.now();
  return Math.ceil(msLeft / 86_400_000);
};

// Friendly relative message for the badge
const relativeClosing = (iso?: string) => {
  const d = daysUntil(iso);
  if (d === null) return "";
  if (d < 0) return "closed";
  if (d === 0) return "today";
  if (d === 1) return "tomorrow";
  if (d <= 7) return `in ${d} days`;
  return "";
};

// Badge colours
const closingBadgeClass = (iso?: string) => {
  const d = daysUntil(iso);
  if (d === null) return "bg-slate-200 text-slate-700";
  if (d < 0) return "bg-slate-200 text-slate-600"; // past
  if (d <= 2) return "bg-red-100 text-red-800 ring-1 ring-red-200"; // urgent
  if (d <= 7) return "bg-amber-100 text-amber-800 ring-1 ring-amber-200"; // soon
  return "bg-blue-100 text-blue-800 ring-1 ring-blue-200"; // normal
};

// Left accent border colours on the card
const accentBorderClass = (iso?: string) => {
  const d = daysUntil(iso);
  if (d === null || d < 0) return "border-l-4 border-l-slate-300";
  if (d <= 2) return "border-l-4 border-l-red-400";
  if (d <= 7) return "border-l-4 border-l-amber-400";
  return "border-l-4 border-l-blue-400";
};

type JobCard = {
  title: string;
  slug: { current: string } | string;
  jobType?: string;
  department?: string;
  closingDate?: string;
};

const query = `
  *[_type == "jobPost"] | order(coalesce(closingDate, dateTime("2100-01-01")) asc){
    "slug": slug.current,
    title,
    jobType,
    department,
    closingDate
  }
`;

export const revalidate = 60;

export default async function JobsIndexPage() {
  const jobs: JobCard[] = await client.fetch(query);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
        Vacancies
      </p>
      <h1 className="font-heading text-3xl text-morpeth-navy md:text-4xl">
        Current job opportunities
      </h1>
      <p className="mt-3 max-w-3xl text-slate-700">
        We’ll publish all open roles here. Select a vacancy to view the full details and how to apply.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {jobs.length === 0 && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </>
        )}

        {jobs.map((j) => {
          const slug = typeof j.slug === "string" ? j.slug : j.slug?.current;
          const rel = relativeClosing(j.closingDate);
          const closed = (daysUntil(j.closingDate) ?? 1) < 0;

          return (
            <article
              key={slug}
              className={`group relative overflow-hidden rounded-lg border border-slate-300 bg-white p-6 shadow-card transition-all ${accentBorderClass(
                j.closingDate
              )} hover:-translate-y-0.5 hover:shadow-lg focus-within:-translate-y-0.5 focus-within:shadow-lg ${closed ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-xl text-morpeth-navy">{j.title}</h2>

                {j.closingDate && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${closingBadgeClass(
                      j.closingDate
                    )}`}
                    title={`Closes ${formatGB(j.closingDate)}`}
                  >
                    Closes {formatGB(j.closingDate)}
                    {rel && rel !== "closed" && (
                      <span className="ml-1 text-[11px] opacity-80">· {rel}</span>
                    )}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {[j.jobType, j.department].filter(Boolean).join(" · ")}
              </p>

              <div className="mt-4">
                <Link
                  href={`/jobs/${slug}`}
                  className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  aria-label={`View details for ${j.title}`}
                >
                  View details
                  <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}