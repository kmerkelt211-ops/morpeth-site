import Link from "next/link";
import { EXTERNAL_GALLERY_URL } from "../../lib/siteLinks";

const card =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-card";

const chip =
  "inline-flex items-center rounded-full border border-morpeth-navy/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy";

export const metadata = {
  title: "Content Admin | Morpeth School",
  description: "Login and manage website content in Sanity Studio.",
};

export default function ContentAdminPage() {
  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      <section className="bg-morpeth-navy text-morpeth-light">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
            Website Admin
          </p>
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-[0.14em] md:text-4xl">
            Content Management
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-morpeth-light/90 md:text-base">
            Use Sanity Studio to update pages, upload files, and publish content.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/studio"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy"
            >
              Open Studio
            </Link>
            <Link
              href="/"
              className="rounded-full border border-morpeth-light/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light"
            >
              Back to site
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Home</h2>
            <p className="mt-2 text-sm text-slate-700">Hero settings, news, and calendar highlights.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={chip}>Site settings</span>
              <span className={chip}>News posts</span>
              <span className={chip}>Events</span>
            </div>
          </article>

          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Our School</h2>
            <p className="mt-2 text-sm text-slate-700">Results pages, houses, and coaching circles content.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={chip}>GCSE results</span>
              <span className={chip}>Sixth Form results</span>
              <span className={chip}>Houses</span>
            </div>
          </article>

          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Teaching & Learning</h2>
            <p className="mt-2 text-sm text-slate-700">Hero, KS3 section, subject cards, and support card content.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={chip}>Teaching page</span>
              <span className={chip}>Subject videos</span>
            </div>
          </article>

          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Extracurricular</h2>
            <p className="mt-2 text-sm text-slate-700">Hero, enrichment sections, and club video card content.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={chip}>Extracurricular page</span>
              <span className={chip}>Club videos</span>
            </div>
          </article>

          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Parents</h2>
            <p className="mt-2 text-sm text-slate-700">Letters home, school lunch documents, and attendance guidance content.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={chip}>Parents page</span>
              <span className={chip}>Attendance</span>
              <span className={chip}>Letters</span>
              <span className={chip}>School menu</span>
            </div>
          </article>

          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Gallery (External)</h2>
            <p className="mt-2 text-sm text-slate-700">The gallery now runs on a separate site and is not edited in this Sanity Studio.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={EXTERNAL_GALLERY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={chip}
              >
                Open external gallery
              </a>
            </div>
          </article>

          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Staff & Jobs</h2>
            <p className="mt-2 text-sm text-slate-700">Directory entries and vacancy listings.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={chip}>Staff members</span>
              <span className={chip}>Job posts</span>
            </div>
          </article>

          <article className={card}>
            <h2 className="font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">Morpeth TV</h2>
            <p className="mt-2 text-sm text-slate-700">Manage feature videos and news episodes.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={chip}>TV videos</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
