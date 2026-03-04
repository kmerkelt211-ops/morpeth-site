import Link from "next/link"

export default function MorpethTVPage() {
  return (
    <main className="min-h-[70vh] bg-[#f4f6fb] px-4 py-16 text-[#10264d]">
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#d4deef] bg-white p-8 text-center shadow-[0_24px_50px_-40px_rgba(16,38,77,0.45)] md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4a76c9]">Morpeth TV</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Coming Soon</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#36507a]">
          We are rebuilding this area. New shows, episodes and media content will be published here soon.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex rounded-full border border-[#b9c9e6] px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#10264d] transition hover:bg-[#edf2fb]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}
