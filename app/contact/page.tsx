import Link from "next/link";

export const metadata = {
  title: "Contact | Morpeth School",
  description:
    "Contact Morpeth School in Bethnal Green, London. Find email and phone details and how to get in touch.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero strip */}
      <section className="relative overflow-hidden bg-gradient-to-r from-morpeth-navy via-[#12355b] to-[#3b6fb6] text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-morpeth-light/75">
            CONTACT
          </p>
          <h1 className="mt-5 font-heading text-3xl uppercase tracking-[0.14em] text-morpeth-light sm:text-4xl md:text-5xl">
            Get in touch
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-morpeth-light/90 md:text-[15px]">
            Whether you’re a parent or carer, a prospective family, or a partner
            organisation, we’re happy to help. Use the details below or send a
            quick message.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#details"
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light ring-1 ring-white/20 transition hover:-translate-y-0.5"
            >
              Contact details
            </a>
            <a
              href="#message"
              className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light ring-1 ring-white/20 transition hover:-translate-y-0.5"
            >
              Send a message
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
        {/* Page intro */}
        <section className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
            ON THIS PAGE
          </p>
          <h2 className="mt-3 font-heading text-xl uppercase tracking-[0.14em] text-morpeth-navy md:text-[1.55rem] md:tracking-[0.18em]">
            Contact Morpeth School
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-[15px]">
            Email or call the school office. You can also open directions in
            Maps, or use the quick message form below.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2" id="details">
          {/* Contact details card */}
          <article className="overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60">
            <div className="p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                CONTACT DETAILS
              </p>
              <h3 className="mt-3 font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">
                School office
              </h3>

              <dl className="mt-5 space-y-4 text-sm text-slate-700">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      className="font-medium text-morpeth-navy underline decoration-slate-300 underline-offset-4 hover:decoration-morpeth-mid"
                      href="mailto:enquiries@morpeth.towerhamlets.sch.uk"
                    >
                      enquiries@morpeth.towerhamlets.sch.uk
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Telephone
                  </dt>
                  <dd className="mt-1">
                    <a
                      className="font-medium text-morpeth-navy underline decoration-slate-300 underline-offset-4 hover:decoration-morpeth-mid"
                      href="tel:+442089810921"
                    >
                      020 8981 0921
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    Bethnal Green, London
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:enquiries@morpeth.towerhamlets.sch.uk"
                  className="inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
                >
                  Email us
                </a>
                <a
                  href="tel:+442089810921"
                  className="inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
                >
                  Call us
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Morpeth%20School%20Bethnal%20Green%20London"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </article>

          {/* Quick message card */}
          <article
            id="message"
            className="overflow-hidden rounded-2xl bg-morpeth-offwhite shadow-card ring-1 ring-slate-200/60"
          >
            <div className="p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
                SEND A MESSAGE
              </p>
              <h3 className="mt-3 font-heading text-lg uppercase tracking-[0.14em] text-morpeth-navy">
                Quick message
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                This opens your email client with the message pre-filled.
              </p>

              <form
                className="mt-5 space-y-4"
                action="mailto:enquiries@morpeth.towerhamlets.sch.uk"
                method="post"
                encType="text/plain"
              >
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Your name
                  </label>
                  <input
                    name="name"
                    className="mt-2 w-full rounded-2xl bg-white px-4 py-2 text-sm text-slate-800 shadow-card ring-1 ring-slate-200/60 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-morpeth-mid"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Your email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="mt-2 w-full rounded-2xl bg-white px-4 py-2 text-sm text-slate-800 shadow-card ring-1 ring-slate-200/60 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-morpeth-mid"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    className="mt-2 w-full rounded-2xl bg-white px-4 py-2 text-sm text-slate-800 shadow-card ring-1 ring-slate-200/60 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-morpeth-mid"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-morpeth-light/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
                  >
                    Open email
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-full bg-morpeth-offwhite px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy shadow-card ring-1 ring-slate-200/60 transition hover:-translate-y-0.5"
                  >
                    Back to home
                  </Link>
                </div>

                <p className="text-xs text-slate-500">
                  If the button doesn’t work on your device, email us directly
                  using the address above.
                </p>
              </form>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}