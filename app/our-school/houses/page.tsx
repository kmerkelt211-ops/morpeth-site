import Image from "next/image";
import Link from "next/link";
import { fetchHouseSummaries, formatHouseDate, HOUSE_BRAND_STYLES } from "../../../lib/houseSystem";

function pointsText(pointsValue: number | null, pointsLabel: string): string {
  if (typeof pointsValue === "number") return `${pointsValue} points`;
  return pointsLabel;
}

export default async function HousesPage() {
  const houses = await fetchHouseSummaries();
  const standings = [...houses].sort((a, b) => {
    const aScore = typeof a.pointsValue === "number" ? a.pointsValue : -1;
    const bScore = typeof b.pointsValue === "number" ? b.pointsValue : -1;
    if (aScore !== bScore) return bScore - aScore;
    return a.title.localeCompare(b.title);
  });
  const leader = standings[0] ?? null;

  return (
    <main className="bg-morpeth-offwhite">
      <section className="bg-gradient-to-r from-morpeth-navy via-[#143e6d] to-[#2f6ab2] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/90">Our school</p>
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-[0.14em] md:text-4xl">House system</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-sky-50/95 md:text-[15px]">
            Every student belongs to a house community. Houses build identity, leadership and pride through
            points, events, service and friendly competition across the year.
          </p>

          {leader ? (
            <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/95">
              <span>Current leader</span>
              <span className="h-1 w-1 rounded-full bg-white/70" aria-hidden />
              <span>{leader.title}</span>
              <span className="h-1 w-1 rounded-full bg-white/70" aria-hidden />
              <span>{pointsText(leader.pointsValue, leader.pointsLabel)}</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-morpeth-mid">Standings</p>
              <h2 className="mt-2 font-heading text-2xl uppercase tracking-[0.12em] text-morpeth-navy">Latest house points</h2>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">House</th>
                  <th className="px-4 py-3 text-left font-semibold">Points</th>
                  <th className="px-4 py-3 text-left font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {standings.map((house) => (
                  <tr key={house.id}>
                    <td className="px-4 py-3 font-medium text-morpeth-navy">{house.title}</td>
                    <td className="px-4 py-3 text-slate-700">{pointsText(house.pointsValue, house.pointsLabel)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatHouseDate(house.pointsUpdatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 md:pb-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {houses.map((house) => {
            const style = HOUSE_BRAND_STYLES[house.brandColor] ?? HOUSE_BRAND_STYLES.mendoza;
            return (
              <article
                key={house.id}
                className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {house.crestUrl ? (
                    <div className={`relative h-14 w-14 overflow-hidden rounded-full ring-2 ${style.ring}`}>
                      <Image src={house.crestUrl} alt={`${house.title} crest`} fill className="object-cover" sizes="56px" />
                    </div>
                  ) : (
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${style.badge} ring-2 ${style.ring}`}>
                      <span className="text-base font-bold uppercase">{house.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-heading text-xl uppercase tracking-[0.1em] text-morpeth-navy">{house.title}</h3>
                    {house.leadNames.length > 0 ? (
                      <p className="mt-1 text-xs text-slate-500">House lead: {house.leadNames.join(", ")}</p>
                    ) : null}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  {house.summary || "House profile and latest updates available on the full house page."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${style.chip}`}>
                    {pointsText(house.pointsValue, house.pointsLabel)}
                  </span>
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {house.updateCount} updates
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600">
                  {house.nextEvent
                    ? `Next event: ${house.nextEvent.title} (${formatHouseDate(house.nextEvent.date)})`
                    : "Next event: to be announced"}
                </p>

                <div className="mt-5">
                  <Link
                    href={`/our-school/houses/${house.slug}`}
                    className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-morpeth-navy transition hover:border-morpeth-navy hover:bg-morpeth-navy hover:text-white"
                  >
                    View house page
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
