import { notFound } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";

type RouteParams = { params: Promise<{ slug: string }> };

// Build Sanity image URLs
const builder = imageUrlBuilder(client as any);
const urlFor = (src: any) => builder.image(src);

// Portable Text renderers (images, links, etc.)
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      // Accept either assetRef (preferred) or an image object with asset._ref
      const ref =
        value?.assetRef ||
        value?.asset?._ref ||
        (typeof value?._ref === "string" ? value._ref : null);

      if (!ref) return null;

      const src = urlFor(ref).width(1200).fit("max").url();

      return (
        <figure className="my-6">
          <img src={src} alt={value?.alt || ""} className="rounded-xl" />
          {value?.caption ? (
            <figcaption className="mt-2 text-sm text-slate-500">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-slate-400 hover:decoration-slate-700"
      >
        {children}
      </a>
    ),
  },
};

// Fetch the job + its rich body content
const query = `
  *[_type == "jobPost" && slug.current == $slug][0]{
    title,
    department,
    jobType,
    contractType,
    salary,
    location,
    closingDate,
    summary,
    howToApply,

    // NEW
    contactEmail,
    attachments[]{
      _key,
      title,
      // support either {file} wrapper objects or bare file types
      "url": coalesce(file.asset->url, asset->url),
      "name": coalesce(title, asset->originalFilename, file.asset->originalFilename),
      "size": coalesce(asset->size, file.asset->size)
    },

    body[]{
      ...,
      // expose the image ref explicitly for the URL builder
      _type == "image" => {
        ...,
        "assetRef": asset._ref
      }
    }
  }
`;

export const revalidate = 60;

// Metadata (Next 16: params is a Promise)
export async function generateMetadata({ params }: RouteParams) {
  const { slug } = await params;
  const job = await client.fetch(query, { slug });
  return {
    title: job?.title
      ? `${job.title} | Vacancies | Morpeth School`
      : "Vacancy | Morpeth School",
  };
}

// Prebuild static paths for existing job slugs
// (use a simpler projection to avoid the GROQ parse quirk)
export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(
    `*[_type == "jobPost" && defined(slug.current)].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export default async function JobPage({ params }: RouteParams) {
  const { slug } = await params;
  const job: any = await client.fetch(query, { slug });

  if (!job) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
        Vacancy
      </p>
      <h1 className="font-heading text-3xl text-morpeth-navy md:text-4xl">
        {job.title}
      </h1>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        {job.jobType && <li>{job.jobType}</li>}
        {job.department && <li>• {job.department}</li>}
        {job.contractType && <li>• {job.contractType}</li>}
        {job.location && <li>• {job.location}</li>}
        {job.salary && <li>• {job.salary}</li>}
        {job.closingDate && (
          <li className="font-medium text-slate-800">
            • Closes{" "}
            {new Date(job.closingDate).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </li>
        )}
      </ul>

      {job.summary && <p className="mt-6 text-slate-700">{job.summary}</p>}

      {/* Rich body from Sanity */}
      {Array.isArray(job.body) && job.body.length > 0 && (
        <section className="prose prose-slate mt-8 max-w-none">
          <PortableText value={job.body} components={ptComponents} />
        </section>
      )}

      {/* Optional legacy HTML "howToApply" fallback */}
      {(!Array.isArray(job.body) || job.body.length === 0) && job.howToApply && (
        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="font-heading text-xl">How to apply</h2>
          <div
            className="prose prose-slate mt-3"
            dangerouslySetInnerHTML={{ __html: job.howToApply }}
          />
        </section>
      )}

      {/* Documents */}
      {Array.isArray(job.attachments) && job.attachments.length > 0 && (
        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="font-heading text-xl">Documents</h2>
          <ul className="mt-3 space-y-2">
            {job.attachments.map((doc: any) => (
              <li key={doc._key}>
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-slate-400 hover:decoration-slate-700"
                  >
                    {doc.name || "Download"}
                  </a>
                ) : (
                  <span className="text-slate-500">{doc.name || "Untitled file"}</span>
                )}
                {typeof doc.size === "number" && (
                  <span className="ml-2 text-slate-500">
                    ({Math.round(doc.size / 1024)} KB)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contact */}
      {job.contactEmail && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="font-heading text-xl">Contact</h2>
          <p className="mt-2">
            Questions? Email{" "}
            <a
              href={`mailto:${job.contactEmail}`}
              className="underline decoration-slate-400 hover:decoration-slate-700"
            >
              {job.contactEmail}
            </a>
            .
          </p>
        </section>
      )}
    </main>
  );
}