"use client";
// app/school-lunches/page.tsx
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@sanity/client";

export default function SchoolLunchesPage() {
  const chip =
    "inline-flex items-center rounded-full bg-morpeth-light/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy transition hover:-translate-y-0.5 hover:shadow-md hover:bg-morpeth-light/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-morpeth-mid";
  const docsChip =
    "inline-flex min-w-[260px] justify-center items-center rounded-full bg-morpeth-light/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light transition hover:-translate-y-0.5 hover:bg-morpeth-light/20 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-morpeth-navy focus-visible:ring-morpeth-light";

  const card =
    "rounded-2xl bg-white/90 p-5 shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:hover:scale-[1.01] will-change-transform border border-morpeth-navy/10";

  type MenuDoc = {
    title?: string;
    month?: string;
    menuPdfUrl?: string;
    allergensPdfUrl?: string;
    specialMenuPdfUrl?: string;
    specialMenuLabel?: string;
    images?: { url: string; alt?: string }[];
  };

  const sanity = useMemo(() => {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const apiVersion =
      process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

    if (!projectId || !dataset) return null;

    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    });
  }, []);

  const [menu, setMenu] = useState<MenuDoc | null>(null);
  const [menuError, setMenuError] = useState<string | null>(null);
  const sanityEnv = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!sanity) {
        setMenuError(
          "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local."
        );
        return;
      }

      setMenuError(null);

      // Fetch the latest published monthly menu (by month field)
      const query = `*[_type == "schoolMenu"] | order(month desc, _updatedAt desc)[0]{
        title,
        month,
        "menuPdfUrl": menuPdf.asset->url,
        "allergensPdfUrl": allergensPdf.asset->url,
        "specialMenuPdfUrl": specialMenuPdf.asset->url,
        specialMenuLabel,
        "images": images[]{"url": asset->url, alt}
      }`;

      try {
        const data = await sanity.fetch(query);

        if (!cancelled && data) {
          setMenu({
            title: data.title,
            month: data.month,
            menuPdfUrl: data.menuPdfUrl,
            allergensPdfUrl: data.allergensPdfUrl,
            specialMenuPdfUrl: data.specialMenuPdfUrl,
            specialMenuLabel: data.specialMenuLabel,
            images: Array.isArray(data.images)
              ? data.images.filter((i: any) => i?.url)
              : [],
          });
          setMenuError(null);
        } else if (!cancelled) {
          setMenu(null);
          setMenuError(
            'No published School menu found. Create a School menu in Studio, upload the PDF + images, and publish it.'
          );
        }
      } catch (e: any) {
        console.error("Failed to load school menu from Sanity", e);
        if (!cancelled) {
          setMenu(null);
          setMenuError(
            `Error loading menu from Sanity: ${e?.message || "Load failed"}. Check the browser console for details.`
          );
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [sanity]);

  const [activeImage, setActiveImage] = useState(0);

  const menuImages = menu?.images ?? [];
  const activeMenuImage = menuImages[activeImage];

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      <header className="mx-auto max-w-6xl px-4 pt-14 pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-mid">
          For parents & carers
        </p>
        <h1 className="mt-3 font-heading text-3xl uppercase tracking-[0.18em] text-morpeth-navy md:text-4xl">
          School lunches
        </h1>
        <p className="mt-4 max-w-3xl text-sm md:text-[15px] text-slate-800">
          Information about meal options, payments, Free School Meals (FSM), and
          dietary requirements.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/parents" className={chip}>
            Back to Parents
          </Link>
          <Link href="/payments" className={chip}>
            Payments
          </Link>
          <Link href="/contact" className={chip}>
            Contact the school
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <article className={card}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-morpeth-navy">
              What’s available
            </h2>
            <p className="mt-3 text-sm md:text-[15px] text-slate-800">
              Students can purchase a range of hot meals, grab-and-go options and
              drinks at lunchtime.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-800">
              <li>• Hot meal option (daily)</li>
              <li>• Vegetarian option available</li>
              <li>• Halal options (where available)</li>
              <li>• Grab-and-go items</li>
            </ul>
            <p className="mt-3 text-[11px] text-slate-500">
              Menus can change during the year — we’ll keep this page updated.
            </p>
          </article>

          <article className={card}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-morpeth-navy">
              Payments & accounts
            </h2>
            <p className="mt-3 text-sm md:text-[15px] text-slate-800">
              We use <span className="font-semibold">iPayimpact</span> for online payments for school meals, trips and other items.
            </p>
            <p className="mt-3 text-sm md:text-[15px] text-slate-800">
              You’ll receive login details when your child joins Morpeth. Please keep your account topped up so your child can use the canteen.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://www.ipayimpact.co.uk/IPI/Account/LogOn"
                target="_blank"
                rel="noopener noreferrer"
                className={chip}
              >
                Log in to iPayimpact
              </a>
              <Link href="/edulink" className={chip}>
                Edulink
              </Link>
            </div>

            <div className="mt-5 rounded-xl border border-morpeth-navy/10 bg-morpeth-offwhite/60 p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-morpeth-navy">
                Biometrics
              </p>
              <p className="mt-2 text-sm md:text-[15px] text-slate-800">
                At Morpeth we operate a cashless meals system. We use biometrics for this purpose and you will be asked to opt in to this when your child joins us.
              </p>
              <p className="mt-2 text-sm md:text-[15px] text-slate-800">
                The same system is also used in our library for the purpose of loaning books.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="https://www.crbcunninghams.co.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={chip}
                >
                  Learn about biometrics (CRB Cunninghams)
                </a>
                <a
                  href="/Documents/Biometrics-Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={chip}
                >
                  View Morpeth’s biometrics policy
                </a>
              </div>
            </div>
          </article>

          <article className={card}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-morpeth-navy">
              Free School Meals
            </h2>
            <p className="mt-3 text-sm md:text-[15px] text-slate-800">
              If you think your child may be eligible for Free School Meals (FSM)
              please contact the school — we can help you with the process and
              keep everything confidential.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://benefitforms.towerhamlets.gov.uk/VictoriaForms/Viewer-VicForms.asp?user=anon&Form=Free%20School%20Meals%20(1.1).wdf"
                target="_blank"
                rel="noopener noreferrer"
                className={chip}
              >
                Apply online (Tower Hamlets)
              </a>
              <Link href="/contact" className={chip}>
                Contact us
              </Link>
            </div>
          </article>

          <article className={card}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-morpeth-navy">
              Allergies & dietary needs
            </h2>
            <p className="mt-3 text-sm md:text-[15px] text-slate-800">
              Please tell us about any allergies, intolerances or dietary
              requirements. We’ll work with families and catering staff to make
              reasonable adjustments.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/contact" className={chip}>
                Report dietary needs
              </Link>
            </div>
          </article>
        </div>

        <div className="relative mt-8 rounded-2xl bg-morpeth-navy p-6 text-morpeth-light shadow-card md:min-h-[740px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-morpeth-light/80">
            Documents
          </p>
          <h2 className="mt-2 font-heading text-lg uppercase tracking-[0.18em]">
            Menus & information
          </h2>
          <div className="max-w-xl">
            <p className="mt-3 text-sm leading-relaxed text-morpeth-light/90 max-w-3xl">
              Our school meals are provided by{" "}
              <a
                href="https://olivedining.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4 hover:text-white"
              >
                Olive Dining
              </a>
              .
            </p>
            <p className="mt-2 text-sm leading-relaxed text-morpeth-light/90 max-w-3xl">
              Olive Dining offer a bespoke service entirely dedicated to the education sector. We are full of like-minded people who are committed to providing healthy and delicious meals, serving both primary and secondary schools around the South East of London. Our menus are full of variety and flavours to cater for everyone’s taste and dietary requirements.
            </p>
          </div>

          <div className="mt-4 max-w-xl md:pr-[420px]">
            <div className="flex flex-wrap gap-2">
              <a
                href={menu?.menuPdfUrl || "/Documents/lunch-menu.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className={docsChip}
              >
                Download lunch menu (PDF)
              </a>
              <a
                href={menu?.allergensPdfUrl || "/Documents/allergens-information.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className={docsChip}
              >
                Allergens information (PDF)
              </a>
              {menu?.specialMenuPdfUrl ? (
                <a
                  href={menu.specialMenuPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={docsChip}
                >
                  {menu.specialMenuLabel || "Download special menu (PDF)"}
                </a>
              ) : null}
            </div>

            {menuError ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm text-morpeth-light/90">{menuError}</p>
                <p className="mt-2 text-[11px] text-morpeth-light/70">
                  Env: projectId={sanityEnv.projectId ? "set" : "missing"}, dataset={sanityEnv.dataset ? "set" : "missing"}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 self-start rounded-2xl border border-white/10 bg-white/5 p-3 md:mt-0 md:absolute md:top-6 md:right-6 md:w-[360px]">
            {activeMenuImage ? (
              <div>
                <a
                  href={activeMenuImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-xl"
                  aria-label="Open menu image"
                >
                  <div className="flex h-[520px] w-full items-center justify-center rounded-xl bg-white/5">
                    <img
                      src={activeMenuImage.url}
                      alt={activeMenuImage.alt || "Menu"}
                      className="h-full w-full rounded-xl object-contain"
                      loading="lazy"
                    />
                  </div>
                </a>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage((i) =>
                        menuImages.length ? (i - 1 + menuImages.length) % menuImages.length : 0
                      )
                    }
                    className="rounded-full bg-morpeth-light/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light hover:bg-morpeth-light/20"
                  >
                    Prev
                  </button>
                  <p className="text-[11px] text-morpeth-light/70">
                    {menuImages.length ? activeImage + 1 : 0} / {menuImages.length}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage((i) =>
                        menuImages.length ? (i + 1) % menuImages.length : 0
                      )
                    }
                    className="rounded-full bg-morpeth-light/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-light hover:bg-morpeth-light/20"
                  >
                    Next
                  </button>
                </div>

                {menuImages.length > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {menuImages.map((img, idx) => (
                      <button
                        key={img.url + idx}
                        type="button"
                        onClick={() => setActiveImage(idx)}
                        className={
                          "relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border " +
                          (idx === activeImage
                            ? "border-morpeth-light/70"
                            : "border-white/10 hover:border-white/20")
                        }
                        aria-label={`View menu image ${idx + 1}`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `Menu ${idx + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-[520px] items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-morpeth-light/70">
                Add menu images in Sanity to show a preview carousel here.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}