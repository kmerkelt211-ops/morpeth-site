import { client } from "../../sanity/lib/client";
import DirectoryClient from "./DirectoryClient";

export const revalidate = 60;

export type StaffMember = {
  _id: string;
  name: string;
  role?: string;
  department?: string;
  email?: string;
  phone?: string;
  team?: string;
  photo?: string;
};

// --- name normalisation & initial helpers (server-side) ---
function normaliseWords(name: string): string[] {
  return (
    (name || "")
      .normalize("NFKD") // split diacritics
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/\u00A0/g, " ") // nbsp -> space
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero‑width
      .trim()
      .match(/[A-Za-z]+/g) || []
  );
}

function getAllInitials(name: string): string[] {
  const words = normaliseWords(name);
  return words.map((w) => (w[0] || "").toUpperCase()).filter(Boolean);
}

async function getStaff(): Promise<StaffMember[]> {
  const query = `*[_type == "staffMember"] | order(department asc, name asc){
    _id,
    name,
    role,
    department,
    team,
    email,
    phone,
    "photo": photo.asset->url
  }`;
  return await client.fetch(query);
}

export default async function StaffPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const staff = await getStaff();

  // --- search & filtering from URL params (server-side, no JS needed) ---
  const params = await searchParams;
  const qParam = params["q"];
  const letterParam = params["letter"];
  const q = (Array.isArray(qParam) ? qParam[0] : qParam || "").toLowerCase().trim();
  const letter = (Array.isArray(letterParam) ? letterParam[0] : letterParam || "").toUpperCase();

  const matchesQuery = (m: StaffMember) => {
    if (!q) return true;
    const hay = `${m.name} ${m.role || ""} ${m.department || ""}`.toLowerCase();
    return hay.includes(q);
  };
  const matchesLetter = (m: StaffMember) => {
    if (!letter) return true;
    const initials = getAllInitials(m.name);
    return initials.includes(letter);
  };

  // --- grouping helpers (teaching vs support), and sorting ---
  const supportHints = [
    "support",
    "admin",
    "administration",
    "site",
    "technician",
    "finance",
    "attendance",
    "data",
    "hr",
    "pastoral",
    "it",
    "ict",
    "business",
    "library",
  ];
  const inferGroup = (m: StaffMember): "teaching" | "support" => {
    const dept = (m.department || "").toLowerCase();
    const role = (m.role || "").toLowerCase();
    if (supportHints.some((h) => dept.includes(h) || role.includes(h))) return "support";
    return "teaching";
  };
  const byName = (a: StaffMember, b: StaffMember) => a.name.localeCompare(b.name);

  const filtered = staff.filter((m) => matchesQuery(m) && matchesLetter(m));

  const sltKeywords = [
    "headteacher",
    "deputy",
    "assistant head",
    "associate head",
    "executive head",
    "head of school",
    "senior leadership",
    "slt",
    "principal",
    "vice principal",
  ];
  const isSLT = (m: StaffMember) => {
    const probe = `${m.role || ""} ${m.department || ""}`.toLowerCase();
    return sltKeywords.some((k) => probe.includes(k));
  };

  // prefer explicit team from Sanity if present
  const explicit = (m: StaffMember) => (m.team || "").toLowerCase();

  const slt = filtered
    .filter((m) => (explicit(m) ? explicit(m) === "slt" : isSLT(m)))
    .sort(byName);
  const teaching = filtered
    .filter((m) => (explicit(m) ? explicit(m) === "teaching" : inferGroup(m) === "teaching" && !isSLT(m)))
    .sort(byName);
  const support = filtered
    .filter((m) => (explicit(m) ? explicit(m) === "support" : inferGroup(m) === "support" && !isSLT(m)))
    .sort(byName);

  // --- helpers to build A–Z links preserving query ---
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const withParam = (key: "letter" | "q", value: string) => {
    const params = new URLSearchParams();
    if (key !== "q" && q) params.set("q", q);
    if (key !== "letter" && letter) params.set("letter", letter);
    if (value) params.set(key, value);
    const s = params.toString();
    return s ? `/staff?${s}` : "/staff";
  };

  return (
    <main className="bg-morpeth-offwhite text-slate-900">
      {/* HERO — matches the site hero pattern */}
      <section className="relative bg-morpeth-navy text-morpeth-light">
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/hero-staff.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-morpeth-navy/65 to-morpeth-navy/85" />
        </div>

        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.25em] text-morpeth-light/80">
            Our Staff
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight md:text-4xl lg:text-5xl">
            Our Staff
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-morpeth-light/90">
            Meet the dedicated team who make Morpeth School a thriving and supportive community for every student.
          </p>
        </div>
      </section>

      {/* QUICK ACCESS — Email & Remote Access */}
      <section className="bg-morpeth-offwhite">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <p className="uppercase text-xs tracking-[0.22em] text-sky-700 mb-2">Quick Access</p>
            <h2 className="font-heading text-2xl md:text-3xl text-morpeth-navy uppercase tracking-[0.12em]">
              Staff Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Email card */}
            <div className="group rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-morpeth-navy/20 p-6 md:p-8">
              <div className="flex items-start gap-4">
                {/* icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-morpeth-light text-morpeth-navy ring-1 ring-morpeth-navy/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                    <path d="M4 7.5 12 13l8-5.5"/>
                    <rect x="3" y="5" width="18" height="14" rx="3"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.1em]">Staff Email</h3>
                  <p className="mt-2 text-slate-700 text-sm leading-6">
                    Access your school email from any device. Use your Morpeth login details. If you’re off‑site, you may be prompted for multi‑factor authentication.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={process.env.NEXT_PUBLIC_EMAIL_URL || 'https://mail.lgflmail.org/owa/auth/logon.aspx?replaceCurrent=1&url=https%3a%2f%2fmail.lgflmail.org%2fowa%2f%23authRedirect%3dtrue'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Open Email
                    </a>
                    <a
                      href={process.env.NEXT_PUBLIC_EMAIL_HELP_URL || '#'}
                      target={process.env.NEXT_PUBLIC_EMAIL_HELP_URL ? '_blank' : undefined}
                      rel={process.env.NEXT_PUBLIC_EMAIL_HELP_URL ? 'noopener noreferrer' : undefined}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                    >
                      How to use
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Remote Access card */}
            <div className="group rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-morpeth-navy/20 p-6 md:p-8">
              <div className="flex items-start gap-4">
                {/* icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-morpeth-light text-morpeth-navy ring-1 ring-morpeth-navy/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                    <path d="M4 17h16M6 17a6 6 0 1 1 12 0"/>
                    <rect x="3" y="5" width="18" height="10" rx="2"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-xl text-morpeth-navy uppercase tracking-[0.1em]">Remote Access</h3>
                  <p className="mt-2 text-slate-700 text-sm leading-6">
                    Securely connect to school systems from home. Use your staff username and password. If you need setup help, see the guide below.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={process.env.NEXT_PUBLIC_REMOTE_ACCESS_URL || 'https://remote.morpeth.towerhamlets.sch.uk/rdweb/webclient/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-morpeth-navy px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Open Remote Access
                    </a>
                    <a
                      href={"/Documents/Accessing%20Morpeth%20Network%20from%20Outside%20-%20Windows%20V2.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="Morpeth-Remote-Access-Windows.pdf"
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100"
                    >
                      How to use
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTORY (Search + A–Z + grouped lists with modal cards) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="text-center mb-8">
            <p className="uppercase text-xs tracking-[0.22em] text-sky-700 mb-2">Directory</p>
            <h2 className="font-heading text-2xl md:text-3xl text-morpeth-navy uppercase tracking-[0.12em]">
              Staff Directory
            </h2>
          </div>

          {/* Search form (GET) */}
          <form method="GET" className="w-full max-w-5xl mx-auto flex items-center gap-4 mb-4 md:mb-6">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, role or department…"
              className="w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 md:py-4 text-base shadow-sm transition-all duration-200 hover:shadow-md hover:border-sky-300 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            {q ? (
              <a
                href={withParam("q", "")}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                Clear
              </a>
            ) : null}
            <button
              type="submit"
              className="rounded-full bg-morpeth-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-morpeth-navy/90 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              Search
            </button>
          </form>

          {/* A–Z jump */}
          <nav className="w-full max-w-5xl mx-auto mt-3 md:mt-4 mb-10 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.16em]">
            <a
              href={withParam("letter", "")}
              className={`rounded-full px-4 py-1.5 border ${!letter ? "border-morpeth-navy text-morpeth-navy" : "border-slate-300 text-slate-600"} hover:bg-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-sky-300`}
            >
              All
            </a>
            {letters.map((L) => (
              <a
                key={L}
                href={withParam("letter", L)}
                className={`inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-full border font-semibold ${
                  letter === L ? "border-morpeth-navy text-morpeth-navy" : "border-slate-300 text-slate-600"
                } hover:bg-slate-100 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-sky-300`}
              >
                {L}
              </a>
            ))}
          </nav>

          {/* Results: delegate interactive behaviour to client component */}
          <DirectoryClient slt={slt} teaching={teaching} support={support} />
        </div>
      </section>
    </main>
  );
}