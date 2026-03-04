import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchHouseDetailBySlug, formatHouseDate, HOUSE_BRAND_STYLES } from "../../../../lib/houseSystem";

type HousePageParams = {
  params: Promise<{ slug: string }>;
};

function toYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex((part) => part === "embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function isEmbeddableVideoUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");
}

export default async function HouseDetailPage({ params }: HousePageParams) {
  const { slug } = await params;
  const house = await fetchHouseDetailBySlug(slug);
  if (!house) {
    notFound();
  }

  const style = HOUSE_BRAND_STYLES[house.brandColor] ?? HOUSE_BRAND_STYLES.mendoza;
  const pointsDisplay = typeof house.pointsValue === "number" ? `${house.pointsValue}` : house.pointsLabel;
  const directVideo = house.videoFileUrl || (house.videoUrl?.toLowerCase().endsWith(".mp4") ? house.videoUrl : null);
  const youtubeEmbed = house.videoUrl ? toYoutubeEmbedUrl(house.videoUrl) : null;
  const iframeVideoUrl = !youtubeEmbed && house.videoUrl && isEmbeddableVideoUrl(house.videoUrl) ? house.videoUrl : null;

  return (
    <main className="bg-morpeth-offwhite pb-14 md:pb-16">
      <section className="mx-auto max-w-6xl px-4 pt-8 md:pt-10">
        <Link
          href="/our-school/houses"
          className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-50"
        >
          Back to all houses
        </Link>

        <article className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative grid gap-0 md:grid-cols-5">
            <div className="relative md:col-span-2">
              {house.heroImageUrl ? (
                <div className="relative h-56 md:h-full min-h-[220px]">
                  <Image src={house.heroImageUrl} alt={`${house.title} house`} fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-morpeth-navy/55 via-morpeth-navy/20 to-transparent" />
                </div>
              ) : (
                <div className={`h-56 min-h-[220px] md:h-full ${style.badge}`} />
              )}
            </div>

            <div className="p-5 md:col-span-3 md:p-7">
              <div className="flex flex-wrap items-center gap-3">
                {house.crestUrl ? (
                  <div className={`relative h-14 w-14 overflow-hidden rounded-full ring-2 ${style.ring}`}>
                    <Image src={house.crestUrl} alt={`${house.title} crest`} fill className="object-cover" sizes="56px" />
                  </div>
                ) : (
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${style.badge}`}>
                    <span className="text-base font-bold uppercase">{house.title.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-morpeth-mid">House</p>
                  <h1 className="mt-1 font-heading text-3xl uppercase tracking-[0.12em] text-morpeth-navy md:text-[2.2rem]">{house.title}</h1>
                </div>
              </div>

              {house.summary ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-[15px]">{house.summary}</p> : null}

              {house.leads.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {house.leads.map((lead) => (
                    <span
                      key={`${lead.name}-${lead.role}`}
                      className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700"
                    >
                      {lead.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 lg:grid-cols-[1.45fr,1fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">About {house.title}</h2>
            {house.about.length > 0 ? (
              <div className="prose mt-4 max-w-none prose-slate">
                <PortableText value={house.about} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">House profile information will be published here by the house lead team.</p>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">House notices</h2>
            {house.notices.length > 0 ? (
              <div className="mt-4 space-y-4">
                {house.notices.map((notice) => (
                  <div key={notice.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-morpeth-navy">{notice.title}</h3>
                    <div className="prose mt-2 max-w-none prose-sm prose-slate">
                      <PortableText value={notice.body} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No notices published yet.</p>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-heading text-xl uppercase tracking-[0.12em] text-morpeth-navy">House updates</h2>
            {house.updates.length > 0 ? (
              <div className="mt-4 space-y-3">
                {house.updates.map((update) => (
                  <div key={update.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{formatHouseDate(update.publishedAt)}</p>
                    <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-morpeth-navy">{update.title}</h3>
                    {update.summary ? <p className="mt-2 text-sm text-slate-700">{update.summary}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No updates published yet.</p>
            )}
          </article>
        </div>

        <aside className="space-y-5">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-morpeth-mid">Latest points</p>
            <p className="mt-2 font-heading text-4xl uppercase tracking-[0.1em] text-morpeth-navy">{pointsDisplay}</p>
            <p className="mt-2 text-sm text-slate-600">Updated: {formatHouseDate(house.pointsUpdatedAt)}</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Upcoming events</h2>
            {house.events.length > 0 ? (
              <div className="mt-3 space-y-3">
                {house.events.slice(0, 5).map((event) => (
                  <div key={`${event.title}-${event.date ?? "tbc"}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-morpeth-navy">{event.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{formatHouseDate(event.date)}</p>
                    {event.location ? <p className="mt-1 text-xs text-slate-600">{event.location}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No upcoming events published yet.</p>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Downloads</h2>
            {house.downloads.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                {house.downloads.map((download) => (
                  <a
                    key={`${download.fileUrl}-${download.label}`}
                    href={download.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 hover:bg-slate-50"
                  >
                    <span>{download.label}</span>
                    <span aria-hidden>-&gt;</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No downloads published yet.</p>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Useful links</h2>
            {house.links.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                {house.links.map((link) => (
                  <a
                    key={`${link.url}-${link.label}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 hover:bg-slate-50"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden>-&gt;</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No links published yet.</p>
            )}
          </article>

          {(directVideo || youtubeEmbed || iframeVideoUrl) && (
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">House video</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-black">
                {directVideo ? (
                  <video
                    controls
                    playsInline
                    poster={house.videoPosterUrl ?? undefined}
                    className="aspect-video w-full"
                    src={directVideo}
                  />
                ) : youtubeEmbed ? (
                  <iframe
                    src={youtubeEmbed}
                    title={`${house.title} house video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full"
                  />
                ) : iframeVideoUrl ? (
                  <iframe
                    src={iframeVideoUrl}
                    title={`${house.title} house video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="aspect-video w-full"
                  />
                ) : null}
              </div>
            </article>
          )}
        </aside>
      </section>
    </main>
  );
}
