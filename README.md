# Morpeth Site

Morpeth is a Next.js 16 + Sanity school website for public visitors, parents, students, staff, and editors. The repo includes the public website, a protected staff area, Sanity Studio, admissions intake, and content/media integrations.

## Quick Start
1. Copy `.env.example` to `.env.local`.
2. Fill in the Sanity and staff auth variables you need.
3. Install dependencies with `npm ci`.
4. Start the app with `npm run dev`.

Open [http://localhost:3000](http://localhost:3000).

## Local Checks
- `npm run lint`
- `npm run test:smoke`
- `npm run build`
- `npm run check`

## Core Features
- Public school website with homepage, parents hub, curriculum, extracurricular, sixth form, jobs, calendar, and news.
- Sanity Studio at `/studio` for structured content editing.
- Protected `/staff` area using Google OAuth and signed cookies.
- Admissions enquiry endpoint writing to Sanity.
- Instagram-powered news feed and ICS-backed calendar.
- Grounded “Ask Morpeth” assistant with escalation behaviour.

## Key Environment Variables
### Sanity
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=8492tcbd
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-11-01
SANITY_API_WRITE_TOKEN=
```

### Staff Auth
```bash
STAFF_GOOGLE_CLIENT_ID=
STAFF_GOOGLE_CLIENT_SECRET=
STAFF_GOOGLE_REDIRECT_URI=
STAFF_ALLOWED_GOOGLE_DOMAINS=
STAFF_AUTH_SECRET=
```

### Social / Analytics
```bash
NEXT_PUBLIC_SITE_URL=https://morpeth-site.vercel.app
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_HOTJAR_ID=
NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION=6
```

### External Links
```bash
NEXT_PUBLIC_EXTERNAL_GALLERY_URL=
NEXT_PUBLIC_EXTERNAL_MUSIC_URL=
NEXT_PUBLIC_EMAIL_URL=
NEXT_PUBLIC_EMAIL_HELP_URL=
NEXT_PUBLIC_REMOTE_ACCESS_URL=
PRIVATE_PERIPATETIC_TIMETABLE_URL=
```

## Project Docs
- `docs/project-map.md`: architecture map, route inventory, source-of-truth matrix, and env overview.
- `docs/content-governance.md`: editorial ownership and failure-mode notes.
- `.env.example`: local setup template.

## Notes
- `/staff` redirects to `/staff/login` if the session is missing or auth is not configured.
- Admissions enquiries are stored as `admissionsEnquiry` documents in Sanity.
- The private peripatetic timetable link is now served via `/timetables/peripatetic`, backed by server env config.
- CI runs lint, smoke tests, and a production build on pushes and pull requests.
- Keep local video assets in `public/video` small and intentional. Large campaign or editorial videos should be hosted through Sanity or another streaming/CDN path, not committed as duplicate repo assets.
