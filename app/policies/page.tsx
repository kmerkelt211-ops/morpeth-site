import Link from "next/link";
import { client } from "../../sanity/client";

type PolicyCategory =
  | "safeguarding"
  | "attendance"
  | "behaviour"
  | "curriculum"
  | "data"
  | "governance"
  | "admissions"
  | "sen"
  | "other";

type PolicyCard = {
  id: string;
  title: string;
  category: PolicyCategory;
  summary: string;
  href: string;
  publishedAt: string | null;
};

type PolicyRow = {
  _id?: string;
  title?: string;
  category?: PolicyCategory;
  summary?: string;
  publishedAt?: string;
  fileUrl?: string;
  externalUrl?: string;
};

const CATEGORY_ORDER: PolicyCategory[] = [
  "safeguarding",
  "attendance",
  "behaviour",
  "curriculum",
  "data",
  "governance",
  "admissions",
  "sen",
  "other",
];

const CATEGORY_LABELS: Record<PolicyCategory, string> = {
  safeguarding: "Safeguarding",
  attendance: "Attendance",
  behaviour: "Behaviour",
  curriculum: "Curriculum",
  data: "Data Protection",
  governance: "Governance",
  admissions: "Admissions",
  sen: "SEN / Inclusion",
  other: "Other",
};

const FALLBACK_POLICIES: PolicyCard[] = [
  {
    id: "attendance-policy",
    title: "Attendance and Punctuality Policy",
    category: "attendance",
    summary: "How Morpeth monitors attendance, supports pupils and works with families.",
    href: "/Documents/Morpeth-School-Attendance-and-Punctuality-Policy-2024-25.pdf",
    publishedAt: null,
  },
  {
    id: "uniform-list",
    title: "Uniform List",
    category: "behaviour",
    summary: "Core uniform and equipment expectations for pupils.",
    href: "/Documents/7.-Uniform-List-2025.pdf",
    publishedAt: null,
  },
  {
    id: "safeguarding-cctv",
    title: "CCTV Policy",
    category: "safeguarding",
    summary: "How CCTV is used in school and managed securely.",
    href: "/Documents/Safeguarding/CCTV-Policy.pdf",
    publishedAt: null,
  },
  {
    id: "data-protection",
    title: "Data Protection Policy",
    category: "data",
    summary: "How we process personal data lawfully and fairly.",
    href: "/Documents/Safeguarding/Data-Protection-Policy.pdf",
    publishedAt: null,
  },
  {
    id: "data-retention",
    title: "Data Retention Policy",
    category: "data",
    summary: "How long records are kept and when they are disposed of.",
    href: "/Documents/Safeguarding/Data-Retention-Policy-1.pdf",
    publishedAt: null,
  },
  {
    id: "data-disposal",
    title: "Data Disposal Policy",
    category: "data",
    summary: "How data and records are securely destroyed when no longer needed.",
    href: "/Documents/Safeguarding/Data-Disposal-Policy.pdf",
    publishedAt: null,
  },
  {
    id: "data-breach",
    title: "Data Breach Policy",
    category: "data",
    summary: "How data incidents are identified, managed and reported.",
    href: "/Documents/Safeguarding/Data-Breach-Policy.pdf",
    publishedAt: null,
  },
];

const QUERY = `*[_type == "policyDocument"] | order(coalesce(order, 999) asc, title asc){
  _id,
  title,
  category,
  summary,
  publishedAt,
  "fileUrl": file.asset->url,
  externalUrl
}`;

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function fetchPolicies(): Promise<PolicyCard[]> {
  try {
    const rows = await client.fetch<PolicyRow[]>(QUERY);
    if (!Array.isArray(rows)) return FALLBACK_POLICIES;

    const mapped = rows
      .map((row) => {
        const href = row.externalUrl?.trim() || row.fileUrl?.trim() || "";
        const category = row.category && CATEGORY_ORDER.includes(row.category) ? row.category : "other";

        if (!row._id || !row.title || !href) return null;

        return {
          id: row._id,
          title: row.title,
          category,
          summary: row.summary?.trim() || "Policy document",
          href,
          publishedAt: row.publishedAt || null,
        } satisfies PolicyCard;
      })
      .filter((row): row is PolicyCard => Boolean(row));

    return mapped.length > 0 ? mapped : FALLBACK_POLICIES;
  } catch {
    return FALLBACK_POLICIES;
  }
}

export const metadata = {
  title: "Policies | Morpeth School",
  description:
    "Statutory policies and key documents for Morpeth School, including safeguarding, attendance and data protection.",
};

export default async function PoliciesPage() {
  const policies = await fetchPolicies();
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: policies.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      <section className="bg-morpeth-navy text-morpeth-light">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/90">
            Our School
          </p>
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-[0.14em] md:text-4xl">
            Policies
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-morpeth-light/90 md:text-base">
            Read statutory policies and supporting documents, including safeguarding, attendance and
            data protection.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/our-school"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy"
            >
              Back to Our School
            </Link>
            <Link
              href="/parents"
              className="rounded-full border border-morpeth-light/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light"
            >
              Parents Hub
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="space-y-7">
          {grouped.map((group) => (
            <article key={group.category} id={group.category} className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-sm md:p-6">
              <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">
                {group.label}
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {group.items.map((item) => {
                  const publishedLabel = formatDate(item.publishedAt);
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:-translate-y-0.5 hover:border-morpeth-mid hover:bg-slate-50"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-morpeth-navy">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.summary}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>{publishedLabel ? `Updated ${publishedLabel}` : "View document"}</span>
                        <span aria-hidden>-&gt;</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
