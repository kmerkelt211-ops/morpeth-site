import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getCurrentStaffSession,
  isStaffAuthConfigured,
  sanitizeReturnTo,
} from "../../../lib/staffAuth";

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

const errorMessages: Record<string, string> = {
  configuration:
    "Staff sign-in is not fully configured yet. Please ask the website administrator to set the staff auth environment variables.",
  state_mismatch: "Sign-in session expired. Please try again.",
  access_denied: "Google sign-in was cancelled.",
  token_exchange_failed: "Unable to complete sign-in with Google. Please try again.",
  token_missing: "Google sign-in did not return a valid token. Please try again.",
  profile_lookup_failed: "We could not confirm your Google account profile. Please try again.",
  email_unverified: "Your Google account email must be verified before you can access staff resources.",
  not_allowed: "Only approved Morpeth staff Google accounts can access this area.",
};

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const returnTo = sanitizeReturnTo(firstParam(params.returnTo));
  const error = firstParam(params.error);
  const signedOut = firstParam(params.signedOut) === "1";

  const session = await getCurrentStaffSession();
  if (session) redirect(returnTo);

  const configured = isStaffAuthConfigured();
  const loginHref = `/api/staff-auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  const message = error ? errorMessages[error] || "Unable to sign in. Please try again." : "";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-morpeth-offwhite text-slate-900">
      <section className="relative overflow-hidden bg-morpeth-navy text-morpeth-light">
        <div className="absolute inset-0 opacity-30 halftone-morpeth" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-morpeth-light/80">Staff Area</p>
          <h1 className="mt-4 font-heading text-3xl md:text-5xl uppercase tracking-[0.1em]">
            Secure Staff Login
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base text-morpeth-light/90 leading-7">
            Sign in with your Morpeth Google account to access staff tools, remote services, and the
            internal directory.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-4xl px-4 pb-16 md:pb-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-10">
          {signedOut ? (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              You have signed out of staff access.
            </div>
          ) : null}

          {message ? (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {message}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
            <div>
              <h2 className="font-heading text-2xl uppercase tracking-[0.09em] text-morpeth-navy">
                Sign In With Google
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Access is restricted to approved staff domains. Use your school Google account only.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {configured ? (
                  <a
                    href={loginHref}
                    className="inline-flex items-center justify-center rounded-full bg-morpeth-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Continue With Google
                  </a>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-slate-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Sign-in Not Ready
                  </span>
                )}
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 hover:bg-slate-100"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Security</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 leading-6">
                <li>Google account authentication</li>
                <li>Domain-restricted staff access</li>
                <li>Secure, expiring session cookie</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
