import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ContinuousImprovementTracker from "./components/ContinuousImprovementTracker";
import { publicEnv } from "../lib/env";

const metadataBase = (() => {
  try {
    return new URL(publicEnv.siteUrl);
  } catch {
    return new URL("https://morpeth-site.vercel.app");
  }
})();

export const metadata: Metadata = {
  metadataBase,
  title: "Morpeth School | Bethnal Green, London",
  description:
    "Morpeth School is a vibrant, creative secondary school and sixth form in Bethnal Green, London.",

  // Keep root fallbacks for browser conventions, but point everything else at the tidy folder.
  manifest: "/morpeth-icon-pack/site.webmanifest",

  icons: {
    // Browsers often look for /favicon.ico automatically; we also provide explicit PNG icons.
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/morpeth-icon-pack/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/morpeth-icon-pack/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    // iOS often looks for /apple-touch-icon.png by default, so keep it at the root.
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  other: {
    "msapplication-config": "/morpeth-icon-pack/browserconfig.xml",
    "msapplication-TileColor": "#0d2a45",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d2a45",
};

const parentQuickLinks = [
  { href: "/term-dates", label: "Term dates" },
  { href: "/parents#essentials", label: "Uniform" },
  { href: "/letters-home", label: "Letters home" },
  { href: "/edulink", label: "Edulink" },
  { href: "/school-lunches", label: "School lunches" },
];

const mainNav = [
  { href: "/", label: "Home" },
  { href: "/our-school", label: "Our School" },
  { href: "/news", label: "News" },
  { href: "/teaching-learning", label: "Teaching & Learning" },
  { href: "/sixth-form", label: "Sixth Form" },
  { href: "/extracurricular", label: "Extracurricular" },
  { href: "/parents", label: "Parents" },
  { href: "/staff", label: "Staff" },
  { href: "/#ask-morpeth", label: "Ask Morpeth" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/morpethschool/" },
  { label: "Twitter", href: "https://x.com/MorpethSch" },
  { label: "YouTube", href: "https://www.youtube.com/@MorpethSch" },
];

const clarityProjectId = publicEnv.clarityProjectId;
const hotjarSiteId = publicEnv.hotjarSiteId;
const hotjarSnippetVersion = publicEnv.hotjarSnippetVersion;

export default function RootLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <body className="bg-morpeth-offwhite text-morpeth-navy">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          {/* Global header / navigation */}
          <header
            className="site-header sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur transition-transform duration-300 will-change-transform"
            data-header
          >
            <div className="site-header-inner mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 md:px-6">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/morpeth-logo.png"
                  alt="Morpeth School logo"
                  width={42}
                  height={42}
                  className="h-10 w-auto md:h-11"
                  priority
                />
                <div className="leading-tight">
                  <div className="font-heading text-xs uppercase tracking-[0.18em] text-morpeth-navy md:text-sm">
                    Morpeth School
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Bethnal Green, London
                  </div>
                </div>
              </Link>

              <nav className="hidden items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-700 lg:flex xl:gap-6">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-nav-link
                    data-href={item.href}
                    className="nav-link relative whitespace-nowrap pb-1 hover:text-morpeth-navy"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-800 shadow-sm transition hover:bg-white lg:hidden touch-manipulation"
                aria-label="Open menu"
                aria-controls="mobile-drawer"
                aria-expanded="false"
                data-menu-open
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile slide-out drawer */}
          <div id="mobile-drawer" className="mobile-drawer" aria-hidden="true">
            {/* IMPORTANT: make overlay a button for reliable taps on iOS */}
            <button
              type="button"
              className="mobile-drawer__overlay"
              aria-label="Close menu"
              data-menu-close
            />
            <aside
              className="mobile-drawer__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Menu
                </p>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 touch-manipulation"
                  aria-label="Close menu"
                  data-menu-close
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <nav className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Main navigation
                </p>
                <ul className="mt-2 space-y-1">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="mobile-drawer__link"
                        data-menu-link
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Parent quick links
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {parentQuickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="mobile-drawer__chip"
                      data-menu-link
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Accessibility
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="site-pref-toggle" data-pref-toggle="lowBandwidth" data-label-on="Low-bandwidth: On" data-label-off="Low-bandwidth: Off">
                    Low-bandwidth: Off
                  </button>
                  <button type="button" className="site-pref-toggle" data-pref-toggle="readableText" data-label-on="Readable text: On" data-label-off="Readable text: Off">
                    Readable text: Off
                  </button>
                  <button type="button" className="site-pref-toggle" data-pref-toggle="highContrast" data-label-on="High contrast: On" data-label-off="High contrast: Off">
                    High contrast: Off
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Translate this page
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="mobile-drawer__chip" data-translate-lang="bn">
                    Bengali
                  </button>
                  <button type="button" className="mobile-drawer__chip" data-translate-lang="so">
                    Somali
                  </button>
                  <button type="button" className="mobile-drawer__chip" data-translate-lang="ar">
                    Arabic
                  </button>
                  <button type="button" className="mobile-drawer__chip" data-translate-lang="tr">
                    Turkish
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Main page content */}
          <div id="main-content" className="flex-1">
            {children}
          </div>

          {/* Global footer */}
          <footer className="mt-16 bg-morpeth-offwhite text-morpeth-navy md:mt-24">
            <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 text-sm">
              <div className="grid items-start gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr,1.5fr]">
                <div>
                  <div className="flex items-start gap-4">
                    <Image
                      src="/morpeth-logo.png"
                      alt="Morpeth School crest"
                      width={64}
                      height={64}
                      className="h-14 w-auto md:h-16"
                    />
                    <div>
                      <h2 className="font-heading text-lg uppercase tracking-[0.25em] text-morpeth-navy">
                        Morpeth School
                      </h2>
                      <p className="mt-1 max-w-sm text-xs text-slate-600">
                        We are a community committed to learning and achievement,
                        based on friendship and respect — where everyone is
                        valued.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                      About Morpeth
                    </h3>
                    <ul className="mt-3 space-y-1 text-sm">
                      <li>Portman Place, Bethnal Green</li>
                      <li>London E2 0PX</li>
                      <li className="mt-2">Tel: 020 8981 0921</li>
                      <li>Email: info@morpeth.towerhamlets.sch.uk</li>
                    </ul>
                  </div>
                </div>

                <div className="md:pl-4">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Find us
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Interactive map and quick directions to the school.
                  </p>

                  <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                    <div className="relative h-64 sm:h-72 md:h-[22rem] lg:h-[24rem]">
                      <iframe
                        data-low-bandwidth-map="true"
                        title="Map showing Morpeth School location"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-0.052694%2C51.521544%2C-0.042694%2C51.531544&layer=mapnik&marker=51.526544%2C-0.047694"
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                      <div
                        data-low-bandwidth-map-fallback="true"
                        className="hidden h-full w-full items-center justify-center bg-slate-100 px-6 text-center"
                      >
                        <p className="text-sm text-slate-700">
                          Low-bandwidth mode is on, so the embedded map is hidden to save data.
                        </p>
                      </div>
                      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-morpeth-navy shadow-sm">
                        Morpeth School, E2 0PX
                      </div>
                    </div>

                    <div className="border-t border-slate-200/70 p-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Link
                          href="https://www.google.com/maps?q=51.526544,-0.047694"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-morpeth-navy/25 bg-morpeth-light/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-morpeth-navy transition hover:bg-morpeth-light/55"
                        >
                          Open in Google Maps
                        </Link>
                        <Link
                          href="https://maps.apple.com/?q=Morpeth%20School&ll=51.526544,-0.047694"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-morpeth-navy/25 bg-morpeth-light/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-morpeth-navy transition hover:bg-morpeth-light/55"
                        >
                          Open in Apple Maps
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center gap-6 text-slate-600">
                {socialLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex items-center gap-2 hover:text-morpeth-navy"
                  >
                    {label === "Instagram" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 transition-colors group-hover:fill-morpeth-navy"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .2 2.7.5.7.3 1.3.7 1.9 1.3.6.6 1 .12 1.3 1.9.3.7.4 1.5.5 2.7.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 2-.5 2.7a4.7 4.7 0 0 1-1.3 1.9 4.7 4.7 0 0 1-1.9 1.3c-.7.3-1.5.4-2.7.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.2-2.7-.5a4.7 4.7 0 0 1-1.9-1.3 4.7 4.7 0 0 1-1.3-1.9c-.3-.7-.4-1.5-.5-2.7C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-2 .5-2.7.3-.7.7-1.3 1.3-1.9.6-.6 1.2-1 1.9-1.3.7-.3 1.5-.4 2.7-.5C8.4 2.2 8.8 2.2 12 2.2Zm0 2c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-2 .4-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.4 1-.4 2C2.8 10.5 2.8 10.9 2.8 12s0 1.5.1 2.7c0 1 .2 1.6.4 2 .2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.2 1 .4 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 2-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.4-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.4-2-.2-.5-.4-.8-.8-1.2a3 3 0 0 0-1.2-.8c-.4-.2-1-.4-2-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.5a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm5.9-2.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
                      </svg>
                    )}
                    {label === "Twitter" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 transition-colors group-hover:fill-morpeth-navy"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M3 3h4.5l4.1 5.6L16.8 3H21l-7.1 8.4L21 21h-4.5l-4.4-6L7.2 21H3l7.3-8.6L3 3zm3.1 1.5 4.3 6-4.3 5.1H6l4.5-5.3L6.2 4.5h-.1zm8.9 0-4.4 5.2 4.4 5.8h.1l-4.6-6 4.6-5h-.1z" />
                      </svg>
                    )}
                    {label === "YouTube" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 transition-colors group-hover:fill-morpeth-navy"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M23.5 7.5a4 4 0 0 0-.8-1.8c-.7-.8-1.7-.9-2.2-1C17.9 4.4 12 4.4 12 4.4s-5.9 0-8.5.3c-.5.1-1.5.2-2.2 1a4 4 0 0 0-.8 1.8C0 9.1 0 12 0 12s0 2.9.5 4.5a4 4 0 0 0 .8 1.8c.7.8 1.7.9 2.2 1C6.1 19.6 12 19.6 12 19.6s5.9 0 8.5-.3c.5-.1 1.5-.2 2.2-1 .4-.5.7-1.1.8-1.8.5-1.6.5-4.5.5-4.5s0-2.9-.5-4.5ZM9.6 15.4V8.6l6.4 3.4-6.4 3.4Z" />
                      </svg>
                    )}
                    <span className="text-sm">{label}</span>
                  </Link>
                ))}
              </div>

              <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white/85 p-4">
                <h3 className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Accessibility & Language
                </h3>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <button type="button" className="site-pref-toggle" data-pref-toggle="lowBandwidth" data-label-on="Low-bandwidth: On" data-label-off="Low-bandwidth: Off">
                    Low-bandwidth: Off
                  </button>
                  <button type="button" className="site-pref-toggle" data-pref-toggle="readableText" data-label-on="Readable text: On" data-label-off="Readable text: Off">
                    Readable text: Off
                  </button>
                  <button type="button" className="site-pref-toggle" data-pref-toggle="highContrast" data-label-on="High contrast: On" data-label-off="High contrast: Off">
                    High contrast: Off
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <button type="button" className="site-pref-toggle" data-translate-lang="bn">
                    Translate: Bengali
                  </button>
                  <button type="button" className="site-pref-toggle" data-translate-lang="so">
                    Translate: Somali
                  </button>
                  <button type="button" className="site-pref-toggle" data-translate-lang="ar">
                    Translate: Arabic
                  </button>
                  <button type="button" className="site-pref-toggle" data-translate-lang="tr">
                    Translate: Turkish
                  </button>
                </div>
                <p className="mt-3 text-center text-xs text-slate-600">
                  Need support in another language? Call school reception and we will arrange interpreter support.
                </p>
              </div>

              <div className="mt-5 text-center">
                <Link
                  href="/content"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 underline underline-offset-4 hover:text-morpeth-navy"
                >
                  Content admin
                </Link>
              </div>

              <div className="mt-10 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
                © {currentYear} Morpeth School. All rights reserved.
              </div>
            </div>
          </footer>

          <ContinuousImprovementTracker />
          <Analytics />
          <SpeedInsights />
          {clarityProjectId ? (
            <Script id="morpeth-clarity" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityProjectId}");
              `}
            </Script>
          ) : null}
          {hotjarSiteId ? (
            <Script id="morpeth-hotjar" strategy="afterInteractive">
              {`
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:${Number.parseInt(hotjarSiteId, 10) || 0},hjsv:${Number.parseInt(hotjarSnippetVersion, 10) || 6}};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `}
            </Script>
          ) : null}
          <Script id="morpeth-ui" strategy="afterInteractive">
            {`
(function(){
  // Prevent double init in dev/hot reload
  if (window.__morpethUIInit) return;
  window.__morpethUIInit = true;

  const root = document.documentElement;
  const PREFS = {
    lowBandwidth: { storage: 'morpeth_pref_low_bandwidth', dataset: 'lowBandwidth' },
    readableText: { storage: 'morpeth_pref_readable_text', dataset: 'readableText' },
    highContrast: { storage: 'morpeth_pref_high_contrast', dataset: 'highContrast' }
  };

  const getPref = (name) => {
    const config = PREFS[name];
    if (!config) return false;
    try {
      return window.localStorage.getItem(config.storage) === '1';
    } catch {
      return false;
    }
  };

  const setPref = (name, value) => {
    const config = PREFS[name];
    if (!config) return;
    try {
      window.localStorage.setItem(config.storage, value ? '1' : '0');
    } catch {}
  };

  const syncPrefButtons = (name, value) => {
    document.querySelectorAll('[data-pref-toggle="' + name + '"]').forEach((button) => {
      button.setAttribute('aria-pressed', value ? 'true' : 'false');
      button.setAttribute('data-active', value ? 'true' : 'false');
      const onLabel = button.getAttribute('data-label-on');
      const offLabel = button.getAttribute('data-label-off');
      if (onLabel && offLabel) button.textContent = value ? onLabel : offLabel;
    });
  };

  const applyPrefs = () => {
    Object.keys(PREFS).forEach((name) => {
      const value = getPref(name);
      const config = PREFS[name];
      if (value) root.dataset[config.dataset] = 'true';
      else delete root.dataset[config.dataset];
      syncPrefButtons(name, value);
    });
    window.dispatchEvent(new Event('morpeth:preferences-changed'));
  };

  const bindPrefButtons = () => {
    document.querySelectorAll('[data-pref-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('data-pref-toggle');
        if (!name || !PREFS[name]) return;
        const nextValue = !getPref(name);
        setPref(name, nextValue);
        applyPrefs();
      });
    });
  };

  const bindTranslateButtons = () => {
    document.querySelectorAll('[data-translate-lang]').forEach((button) => {
      button.addEventListener('click', () => {
        const lang = button.getAttribute('data-translate-lang');
        if (!lang) return;
        const currentUrl = window.location.href;
        const target = 'https://translate.google.com/translate?sl=auto&tl=' + encodeURIComponent(lang) + '&u=' + encodeURIComponent(currentUrl);
        window.open(target, '_blank', 'noopener,noreferrer');
      });
    });
  };

  applyPrefs();
  bindPrefButtons();
  bindTranslateButtons();

  // Sticky header scroll-state and hide-on-scroll
  let lastScroll = window.scrollY;
  const header = document.querySelector('[data-header]');
  const onScroll = () => {
    const current = window.scrollY;

    if (current > 8) root.dataset.scrolled = 'true';
    else delete root.dataset.scrolled;

    if (header) {
      if (current > lastScroll && current > 80) header.style.transform = 'translateY(-100%)';
      else header.style.transform = 'translateY(0)';
    }

    lastScroll = current;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active underline in desktop nav
  const setActive = () => {
    const path = window.location.pathname.replace(/\\/$/, '') || '/';
    document.querySelectorAll('[data-nav-link]').forEach((el) => {
      const href = (el.getAttribute('data-href') || '').replace(/\\/$/, '') || '/';
      const isActive = href === '/' ? path === '/' : path.startsWith(href);
      el.classList.toggle('is-active', isActive);
    });
  };

  // Mobile drawer open/close
  const drawer = document.getElementById('mobile-drawer');
  let lastOpener = null;

  const syncAria = (isOpen) => {
    document.querySelectorAll('[data-menu-open]').forEach((btn) => {
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    if (drawer) drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  };

  const openMenu = (opener) => {
    if (opener) lastOpener = opener;
    root.dataset.menuOpen = 'true';
    syncAria(true);

    // Prevent background scroll while the drawer is open (mobile)
    try {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } catch {}

    const first = drawer && drawer.querySelector('[data-menu-link]');
    if (first && typeof first.focus === 'function') {
      try { first.focus(); } catch {}
    }
  };

  const closeMenu = () => {
    delete root.dataset.menuOpen;
    syncAria(false);

    // Restore scrolling
    try {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    } catch {}

    if (lastOpener && typeof lastOpener.focus === 'function') {
      try { lastOpener.focus(); } catch {}
    }
    lastOpener = null;
  };

  const bindMenuEvents = () => {
    const openButtons = document.querySelectorAll('[data-menu-open]');
    const closeButtons = document.querySelectorAll('[data-menu-close]');
    const menuLinks = document.querySelectorAll('[data-menu-link]');

    openButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openMenu(btn);
      });
    });

    closeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    });

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('/') && !href.includes('#')) {
          try {
            window.sessionStorage.setItem('morpethForceTopNextNav', '1');
          } catch {}
        }
        // Allow Next.js navigation to proceed; just close the menu UI
        closeMenu();
      });
    });
  };

  bindMenuEvents();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.dataset.menuOpen === 'true') closeMenu();
  }, true);

  // Site-wide scroll reveal
  let revealObserver = null;
  let revealMutationObserver = null;
  let pendingRevealScan = false;

  const revealSelector = 'main > section, main > article, [data-reveal]';

  const prepareRevealNode = (node, reset = false) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.dataset.revealIgnore === 'true') return;
    if (!node.dataset.reveal) node.dataset.reveal = 'up';
    if (reset || !node.dataset.revealVisible) node.dataset.revealVisible = 'false';
    if (revealObserver) revealObserver.observe(node);
  };

  const scanRevealNodes = (reset = false) => {
    const targets = [];
    document.querySelectorAll(revealSelector).forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      targets.push(node);
    });

    if (targets.length === 0) {
      delete root.dataset.revealReady;
      return;
    }

    root.dataset.revealReady = 'true';
    targets.forEach((node) => prepareRevealNode(node, reset));
  };

  const queueRevealScan = (reset = false) => {
    if (pendingRevealScan) return;
    pendingRevealScan = true;
    window.requestAnimationFrame(() => {
      pendingRevealScan = false;
      scanRevealNodes(reset);
    });
  };

  const initReveals = () => {
    if (revealObserver) revealObserver.disconnect();
    if (revealMutationObserver) revealMutationObserver.disconnect();

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (!(el instanceof HTMLElement)) return;

          if (entry.isIntersecting) {
            el.dataset.revealVisible = 'true';
            if (el.dataset.revealOnce !== 'false' && revealObserver) {
              revealObserver.unobserve(el);
            }
          } else if (el.dataset.revealOnce === 'false') {
            el.dataset.revealVisible = 'false';
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -10% 0px' }
    );

    scanRevealNodes(true);

    revealMutationObserver = new MutationObserver((mutations) => {
      let foundRevealCandidates = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (
            node.matches('section, article, [data-reveal]') ||
            !!node.querySelector('section, article, [data-reveal]')
          ) {
            foundRevealCandidates = true;
          }
        });
      });

      if (foundRevealCandidates) queueRevealScan(false);
    });

    revealMutationObserver.observe(document.body, { childList: true, subtree: true });
  };

  const scheduleRevealInit = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(initReveals);
    });
  };

  // Close menu on route changes (Next uses history.pushState)
  const onLocationChange = () => {
    setActive();
    closeMenu();
    try {
      if (window.sessionStorage.getItem('morpethForceTopNextNav') === '1') {
        window.sessionStorage.removeItem('morpethForceTopNextNav');
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
      }
    } catch {}
    scheduleRevealInit();
  };

  const patchHistory = (type) => {
    const orig = history[type];
    history[type] = function(){
      const ret = orig.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
  };

  patchHistory('pushState');
  patchHistory('replaceState');
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  window.addEventListener('locationchange', onLocationChange);


  // Initial state
  setActive();
  syncAria(root.dataset.menuOpen === 'true');
  scheduleRevealInit();
})();
            `}
          </Script>
        </div>
      </body>
    </html>
  );
}
