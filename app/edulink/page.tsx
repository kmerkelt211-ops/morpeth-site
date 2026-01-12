// app/edulink/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edulink One — Parents",
  description:
    "Edulink One is the parent portal and communication app we use to keep you informed about your child’s learning and progress.",
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-4 py-6 md:py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
          Parents &amp; carers
        </p>
        <h1 className="mt-3 font-heading text-[1.65rem] uppercase tracking-[0.18em] text-morpeth-navy">
          Edulink One
        </h1>
        <p className="mt-3 text-[15px] text-slate-800">
          Edulink One is our parent portal and communication app. It keeps your
          child’s key information in one place so you can stay up to date with
          their learning and progress.
        </p>

        {/* Video */}
        <div className="mt-5 overflow-hidden rounded-xl ring-1 ring-slate-200/70">
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/d99kiS3BLWw"
              title="Edulink One — Parent Overview"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* What is it / Access / What you’ll see */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70">
            <h2 className="font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
              What is Edulink One?
            </h2>
            <p className="mt-2 text-sm text-slate-800">
              Edulink One is a parent portal and communication app that keeps
              your child’s school information in one place and keeps you more
              informed about their learning and progress.
            </p>
            <p className="mt-2 text-sm text-slate-800">
              You can watch a short video overview above or read the brief
              summary guide for parents on the Edulink website.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70">
            <h2 className="font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
              How do I access it?
            </h2>
            <p className="mt-2 text-sm text-slate-800">
              It’s simple to use and available via the{" "}
              <strong>Android</strong> and <strong>iOS</strong> apps, or any
              modern web browser. You will have received login details from us.
              If you have any difficulty:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-800">
              <li>
                <Link
                  href="https://www.morpethschool.org.uk/6/contact"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  contact the school
                </Link>{" "}
                or call <a href="tel:02089810921">020 8981 0921</a>
              </li>
              <li>
                Download the app from{" "}
                <Link
                  href="https://play.google.com/store/apps/details?id=com.overnetdata.edulinkone"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  Google Play
                </Link>{" "}
                or{" "}
                <Link
                  href="https://apps.apple.com/gb/app/edulink-one/id1188809029"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  the App Store
                </Link>
              </li>
              <li>
                Or use the web version at{" "}
                <Link
                  href="https://www.edulinkone.com"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  www.edulinkone.com
                </Link>
              </li>
            </ul>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 md:col-span-2">
            <h2 className="font-heading text-lg uppercase tracking-[0.16em] text-morpeth-navy">
              What information will I see?
            </h2>
            <p className="mt-2 text-sm text-slate-800">
              Depending on your child’s year group and permissions, you may see:
            </p>
            <ul className="mt-2 grid gap-2 text-sm text-slate-800 md:grid-cols-2">
              <li className="rounded-lg bg-morpeth-light/30 px-3 py-2 ring-1 ring-slate-200/70">
                Your contact details (and how to update them)
              </li>
              <li className="rounded-lg bg-morpeth-light/30 px-3 py-2 ring-1 ring-slate-200/70">
                School reports and documents
              </li>
              <li className="rounded-lg bg-morpeth-light/30 px-3 py-2 ring-1 ring-slate-200/70">
                Homework
              </li>
            </ul>

            {/* CTAs */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="https://www.edulinkone.com"
                target="_blank"
                className="rounded-full bg-morpeth-light/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy transition hover:-translate-y-0.5 hover:bg-morpeth-light/70"
              >
                Open Edulink (web)
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.overnetdata.edulinkone"
                target="_blank"
                className="rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:bg-morpeth-light/30"
              >
                Google Play
              </Link>
              <Link
                href="https://apps.apple.com/gb/app/edulink-one/id1188809029"
                target="_blank"
                className="rounded-full border border-morpeth-navy/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-morpeth-navy hover:bg-morpeth-light/30"
              >
                App Store
              </Link>
            </div>
          </article>
        </div>

        {/* Direct login link for clarity */}
        <div className="mt-6 rounded-2xl bg-morpeth-light/25 p-4 ring-1 ring-slate-200/70">
          <p className="text-sm text-slate-800">
            Already have your login details?{" "}
            <Link
              href="https://www.edulinkone.com"
              target="_blank"
              className="font-semibold text-morpeth-navy underline underline-offset-2"
            >
              Click here to log in
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}