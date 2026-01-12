'use client'

// -- CLIENT-SIDE SANITY WIRING, REMOVING STATIC CRESTS --

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Sanity (client-side, read-only)
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// --- Sanity client setup (uses your existing env vars) ---
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);
const urlFor = (src: any) => builder.image(src).width(256).height(256).fit("crop").url();

// Map your brand keys in Sanity to Tailwind classes used for accents
const colourClassFromBrand = (brand?: string) => {
  switch ((brand || "").toLowerCase()) {
    case "chapman":
      return "bg-red-600";
    case "pankhurst":
      return "bg-violet-600";
    case "tull":
      return "bg-amber-400";
    case "jalal":
      return "bg-blue-600";
    case "mendoza":
    default:
      return "bg-lime-500";
  }
};

// GROQ query to fetch card data
const HOUSES_GROQ = `
*[_type == "house"] | order(order asc){
  "name": coalesce(title, slug.current),
  "short": coalesce(title, slug.current),
  "slug": slug.current,
  leader,
  summary,
  videoUrl,
  brandColor,
  crest
}
`;

type House = {
  name: string;
  short: string;
  slug: string;
  colour: string; // Tailwind class for the accent / badge
  crestUrl?: string; // from Sanity
  text: string; // summary
  leader: string;
  videoUrl?: string;
};

function Mp4Player({ src }: { src: string }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [muted, setMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    setVolume(val);
    if (v.muted && val > 0) {
      v.muted = false;
      setMuted(false);
    }
  };

  const requestFull = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {}
  };

  const requestPiP = async () => {
    try {
      // @ts-ignore: PiP types not in lib yet
      if (document.pictureInPictureElement) {
        // @ts-ignore
        await document.exitPictureInPicture();
      } else if (videoRef.current && "requestPictureInPicture" in videoRef.current) {
        // @ts-ignore
        await videoRef.current.requestPictureInPicture();
      }
    } catch {}
  };

  const requestAirPlay = () => {
    const v: any = videoRef.current;
    if (v && typeof v.webkitShowPlaybackTargetPicker === "function") {
      try {
        v.webkitShowPlaybackTargetPicker();
      } catch {}
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        className="w-full aspect-video rounded-xl bg-black"
        // Enable AirPlay in Safari
        x-webkit-airplay="allow"
        // @ts-ignore
        airplay="allow"
        controlsList="nodownload"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/60 p-3">
        <button
          type="button"
          onClick={toggleMute}
          className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
          aria-pressed={muted}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? "Unmute" : "Mute"}
        </button>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          Volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={onVolume}
            className="h-2 w-36 cursor-pointer appearance-none rounded bg-slate-200"
          />
        </label>

        <button
          type="button"
          onClick={requestPiP}
          className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
          aria-label="Picture in Picture"
          title="Picture in Picture"
        >
          PiP
        </button>

        <button
          type="button"
          onClick={requestAirPlay}
          className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
          aria-label="AirPlay"
          title="AirPlay (Safari)"
        >
          AirPlay
        </button>

        <button
          type="button"
          onClick={requestFull}
          className="ml-auto rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
          aria-label="Toggle fullscreen"
        >
          Full screen
        </button>
      </div>
    </div>
  );
}

function HousesPageInner() {
  const [houses, setHouses] = useState<House[]>([]);

  // Placeholder points from houses list (until you add a points field in Sanity)
  const points = useMemo(
    () => houses.map((h) => ({ house: h.name, total: 0 })),
    [houses]
  );

  // Modal state + routing helpers for deep-linking (?house=slug, ?video=slug)
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("house");
  const videoSlug = searchParams.get("video");

  const [open, setOpen] = useState<House | null>(null);
  const [watch, setWatch] = useState<House | null>(null);

  // Fetch houses from Sanity on mount
  useEffect(() => {
    let cancelled = false;
    sanityClient.fetch(HOUSES_GROQ).then((rows: any[]) => {
      if (cancelled) return;
      const mapped: House[] = rows.map((r) => ({
        name: r.name || r.short || r.slug,
        short: r.short || r.name || r.slug,
        slug: r.slug,
        colour: colourClassFromBrand(r.brandColor),
        crestUrl: r.crest ? urlFor(r.crest) : undefined,
        text: r.summary || "",
        leader: r.leader || "",
        videoUrl: r.videoUrl || "",
      }));
      setHouses(mapped);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Open from the link (deep-link support for house)
  useEffect(() => {
    if (initialSlug && !open && houses.length) {
      const match = houses.find((h) => h.slug === initialSlug);
      if (match) setOpen(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug, houses]);

  // Open from the link (deep-link support for video)
  useEffect(() => {
    if (videoSlug && !watch && houses.length) {
      const match = houses.find((h) => h.slug === videoSlug);
      if (match) setWatch(match);
    }
    if (!videoSlug && watch) {
      setWatch(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSlug, houses]);

  // When opening, push a shallow URL with ?house=slug so it’s shareable
  const openHouse = (h: House) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("house", h.slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(h);
  };

  // When opening video, push a shallow URL with ?video=slug
  const openVideo = (h: House) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("video", h.slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setWatch(h);
  };

  // Close the modal and clean the URL
  const closeHouse = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("house");
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
    setOpen(null);
  };

  // Close the video modal and clean the URL
  const closeVideo = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("video");
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname, { scroll: false });
    setWatch(null);
  };

  // A tiny util to build a soft, readable accent from the house colour class
  const accentRing = (colourClass: string) => `ring-2 ring-offset-2 ring-offset-white ${colourClass}/40`;

  return (
    <main className="min-h-screen bg-morpeth-offwhite">
      {/* Page header */}
      <section className="relative mx-auto max-w-6xl px-4 pt-10 md:pt-14">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Our School</p>
        <h1 className="mt-1 font-heading text-3xl md:text-4xl text-morpeth-navy uppercase tracking-[0.12em]">
          House System
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-700">
          Morpeth’s House System builds identity, friendship and leadership. Every student belongs to a
          House and contributes points through sports, arts, academic achievement and community service.
          Over the year, Houses celebrate successes together and support one another through healthy,
          friendly competition.
        </p>
      </section>

      {/* House cards */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-8 md:pt-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {houses.map((h) => (
            <article
              key={h.slug}
              className="group rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Crest / badge from Sanity */}
                {h.crestUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={h.crestUrl}
                    alt={`${h.short} crest`}
                    className={`h-14 w-14 shrink-0 rounded-full object-cover ${accentRing(h.colour)}`}
                  />
                ) : (
                  <div
                    className={`h-14 w-14 shrink-0 rounded-full ${h.colour} shadow-inner shadow-black/10 ring-1 ring-black/10`}
                    aria-hidden
                  />
                )}
                <div>
                  <h3 className="font-heading text-xl text-morpeth-navy tracking-[0.06em]">{h.short}</h3>
                  {h.leader && <p className="mt-1 text-[13px] text-slate-500">{h.leader}</p>}
                </div>
              </div>

              {h.text && <p className="mt-4 text-slate-700">{h.text}</p>}

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => openHouse(h)}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-morpeth-navy transition hover:border-morpeth-navy hover:bg-morpeth-navy hover:text-white"
                >
                  View house
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => openVideo(h)}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  disabled={!h.videoUrl}
                >
                  Watch video
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Points table */}
      <section className="mx-auto max-w-6xl px-4 pb-6 md:pb-10">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-5 md:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Scores</p>
              <h2 className="font-heading text-2xl text-morpeth-navy tracking-[0.08em]">Latest House Points</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                We’ll import live totals from Sanity. For now these are placeholders.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">House</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {points.map((row) => (
                  <tr key={row.house}>
                    <td className="px-4 py-3">{row.house}</td>
                    <td className="px-4 py-3">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal overlay – opens over this page */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${open.short} house details`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeHouse} />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 md:px-6">
              <div className="flex items-center gap-3">
                {open.crestUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={open.crestUrl} alt="crest" className={`h-10 w-10 rounded-full object-cover ${accentRing(open.colour)}`} />
                ) : (
                  <div className={`h-10 w-10 rounded-full ${open.colour}`} />
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">House</p>
                  <h3 className="font-heading text-xl text-morpeth-navy tracking-[0.06em]">{open.name}</h3>
                </div>
              </div>
              <button
                onClick={closeHouse}
                className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-6 px-5 py-5 md:grid-cols-5 md:px-6 md:py-6">
              {/* Left column */}
              <div className="md:col-span-3">
                {open.leader && <p className="text-sm text-slate-600">{open.leader}</p>}
                {open.text && <p className="mt-3 leading-relaxed text-slate-700">{open.text}</p>}

                {/* Placeholder blocks to wire later */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Notices</p>
                    <p className="mt-2 text-sm text-slate-500">Add notices in Sanity (to be wired).</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Downloads</p>
                    <p className="mt-2 text-sm text-slate-500">Add downloads in Sanity (to be wired).</p>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="md:col-span-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Latest points</p>
                  <p className="mt-2 text-3xl font-semibold text-morpeth-navy">—</p>
                  <p className="text-sm text-slate-600">Updated weekly</p>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Upcoming events</p>
                  <p className="mt-2 text-sm text-slate-500">Add events in Sanity (to be wired).</p>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Links</p>
                  <p className="mt-2 text-sm text-slate-500">Add links in Sanity (to be wired).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video modal overlay */}
      {watch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${watch.short} house video`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeVideo} />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white shadow-xl ring-1 ring-black/5 flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 md:px-6">
              <div className="flex items-center gap-3">
                {watch.crestUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={watch.crestUrl} alt="crest" className={`h-10 w-10 rounded-full object-cover ${accentRing(watch.colour)}`} />
                ) : (
                  <div className={`h-10 w-10 rounded-full ${watch.colour}`} />
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">House</p>
                  <h3 className="font-heading text-xl text-morpeth-navy tracking-[0.06em]">{watch.name}</h3>
                </div>
              </div>
              <button
                onClick={closeVideo}
                className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            {/* Video player area */}
            <div className="flex flex-col items-center px-5 py-6 md:px-8">
              <div className="w-full max-w-2xl">
                {!watch.videoUrl ? (
                  <div className="flex flex-col items-center justify-center w-full aspect-video rounded-xl bg-slate-100 text-slate-500 text-lg font-medium">
                    Video coming soon
                  </div>
                ) : watch.videoUrl.trim().toLowerCase().endsWith(".mp4") ? (
                  <Mp4Player src={watch.videoUrl} />
                ) : (
                  <iframe
                    src={watch.videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share; airplay"
                    allowFullScreen
                    className="w-full aspect-video rounded-xl"
                    title={`${watch.name} video`}
                  />
                )}
              </div>
              <p className="mt-3 text-xs text-slate-500 text-center max-w-md">
                If the video doesn’t play, please try again later.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function HousesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-morpeth-offwhite">
          <div className="mx-auto max-w-6xl px-4 pt-10 text-slate-600">Loading…</div>
        </main>
      }
    >
      <HousesPageInner />
    </Suspense>
  );
}