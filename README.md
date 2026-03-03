This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Staff Login Setup (Google)

The `/staff` section is protected by Google OAuth and a signed staff session cookie.

Add these variables to `.env.local` and your hosting environment:

```bash
STAFF_GOOGLE_CLIENT_ID=
STAFF_GOOGLE_CLIENT_SECRET=
STAFF_GOOGLE_REDIRECT_URI=
STAFF_ALLOWED_GOOGLE_DOMAINS=
STAFF_AUTH_SECRET=
```

Notes:

- `STAFF_GOOGLE_REDIRECT_URI` should match your Google OAuth redirect URL exactly (for example `https://www.morpeth.school/api/staff-auth/callback`).
- `STAFF_ALLOWED_GOOGLE_DOMAINS` accepts one or more comma-separated Workspace domains (for example `morpeth.school,morpeth.towerhamlets.sch.uk`).
- `STAFF_AUTH_SECRET` should be a long random secret used to sign session cookies.
- If these values are missing, `/staff` redirects to `/staff/login` with a configuration warning.

## Admissions Inbox Setup (Sanity)

Homepage admissions enquiries are submitted to `/api/admissions-enquiry` and saved in Sanity as `admissionsEnquiry` documents.

Add this variable to `.env.local` and your hosting environment:

```bash
SANITY_API_WRITE_TOKEN=
```

Notes:

- Use a Sanity token with permission to create documents in your target dataset.
- Enquiries appear in Studio under **Admissions Inbox** with status columns (`New`, `In Review`, `Responded`, `Closed`).

## Live Homepage + Social Preview Setup

The homepage now powers motion sections from real CMS data:

- **School Pulse**: latest notices, lunches, attendance guidance, and key events.
- **Live achievement wall**: first uses `studentSpotlight` documents, then falls back to latest news if none exist.
- **Milestone timeline**: upcoming `event` documents with links to `/events/[slug]` pages.

Event and news pages also generate dynamic social images:

- `/news/[slug]/opengraph-image`
- `/events/[slug]/opengraph-image`

Recommended environment variable for correct social URLs:

```bash
NEXT_PUBLIC_SITE_URL=https://morpeth-site.vercel.app
```

In Sanity Studio, populate:

- **Home → Student spotlights** (`studentSpotlight`)
- **Home → Calendar events** (`event`, with `slug` + `start`)
- **Parents → Parents page** attendance fields for richer attendance data in Pulse

## Continuous Improvement Setup (Analytics + A/B + Heatmaps)

The site now includes:

- Vercel analytics tracking for page views, section views, CTA clicks and scroll depth.
- Homepage A/B assignment for hero messaging (`hero_message_v1`).
- Optional heatmap/session tools (Microsoft Clarity and Hotjar).

Optional environment variables:

```bash
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_HOTJAR_ID=
NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION=6
```

Notes:

- If these are not set, the site still works and no heatmap scripts are loaded.
- To force a homepage hero variant for testing, use:
  - `?exp_hero_message_v1=community`
  - `?exp_hero_message_v1=achievement`
- Accessibility and low-bandwidth toggles are persisted in local storage and included in analytics context.

Suggested weekly loop:

1. Check top CTA clicks and section-view drop-off.
2. Compare hero variant conversion (`homepage_ab_variant_assigned` vs admissions CTA/form events).
3. Review heatmaps/session recordings for friction zones.
4. Ship one focused homepage iteration and repeat.

## AI School Assistant (Grounded + Escalation)

Homepage now includes an "Ask Morpeth" assistant panel powered by `/api/school-assistant`.

Current behavior:

- Answers only from known school information areas (term dates, admissions, uniforms, transport/contact, clubs, lunches, letters, Edulink).
- If confidence is low or the topic looks sensitive/urgent, it escalates to staff contact routes instead of guessing.
- Shows source links with each response.

No external AI key is required for the current grounded version.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
