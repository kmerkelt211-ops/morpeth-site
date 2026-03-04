import Link from "next/link";

export const metadata = {
  title: "Exams & Assessment | Morpeth School",
  description:
    "Exam and assessment guidance for students and families, including revision support and key contact routes.",
};

const card =
  "rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-sm md:p-6";

export default function ExamsPage() {
  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      <section className="bg-morpeth-navy text-morpeth-light">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/90">
            Our School
          </p>
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-[0.14em] md:text-4xl">
            Exams & Assessment
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-morpeth-light/90 md:text-base">
            Key information for students and families about exam periods, preparation and support.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/our-school"
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-navy"
            >
              Back to Our School
            </Link>
            <Link
              href="/calendar"
              className="rounded-full border border-morpeth-light/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-morpeth-light"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <article className={card}>
            <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">
              During exam periods
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
              <li>• Students receive an exam timetable and room information through school channels.</li>
              <li>• Morning and afternoon sessions start promptly; late arrival can affect entry.</li>
              <li>• Students should bring required equipment and follow JCQ conduct expectations.</li>
            </ul>
          </article>

          <article className={card}>
            <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">
              Revision support
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
              <li>• Departments provide revision guidance, topic checklists and intervention sessions.</li>
              <li>• Students are encouraged to use planners and regular retrieval practice.</li>
              <li>• Contact the school if your child needs additional support or access arrangements guidance.</li>
            </ul>
          </article>
        </div>

        <article className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-sm md:p-6">
          <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">
            Related links
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/our-school/results"
              className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
            >
              Results & Destinations
            </Link>
            <Link
              href="/term-dates"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
            >
              Term Dates
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
            >
              Contact the School
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
