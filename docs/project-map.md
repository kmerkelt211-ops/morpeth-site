# Morpeth Project Map

## Purpose
Morpeth is a public school website built with Next.js App Router and Sanity. It serves prospective families, current parents, students, and staff, while giving editors a Sanity Studio for content updates.

## Main User Journeys
- Public homepage: school overview, admissions, latest news/events, assistant, and quick navigation.
- Parents: attendance guidance, term dates, lunches, letters home, Edulink, policies, and contact routes.
- Prospective families: admissions enquiry form, open-event/news content, school-life messaging, and contact.
- Staff: Google-authenticated access to internal tools and the staff directory.
- Editors: Sanity Studio at `/studio` for structured content and inbox workflows.

## Route Inventory
### Public pages
- `/`: homepage, admissions form, latest notices/events/news, analytics experiments, assistant.
- `/parents`, `/term-dates`, `/school-lunches`, `/letters-home`, `/contact`, `/policies`, `/edulink`.
- `/news`, `/news/[slug]`, `/events/[slug]`, `/calendar`.
- `/our-school`, `/teaching-learning`, `/extracurricular`, `/sixth-form`, `/student-spotlights`, `/jobs`.

### Protected / internal
- `/staff`: protected staff tools and directory.
- `/staff/login`: Google sign-in entrypoint.
- `/studio`: Sanity Studio.

### API routes
- `/api/admissions-enquiry`: validates and stores admissions enquiries in Sanity.
- `/api/school-assistant`: grounded FAQ assistant with safe escalation.
- `/api/events`, `/api/events/instagram`: calendar and Instagram content feeds.
- `/api/parents-page`, `/api/teaching-learning`, `/api/extracurricular`: CMS-backed page data.
- `/api/hero-video`, `/api/pulse-media`, `/api/home-sixth-form-media`, `/api/sixth-form-media`, `/api/recruitment-video`: media/config feeds.
- `/api/staff-auth/*`: Google OAuth login, callback, and logout.
- `/timetables/peripatetic`: internal redirect to the private peripatetic timetable URL when configured.

## Source Of Truth Matrix
| Area | Primary source | Secondary/fallback |
| --- | --- | --- |
| Homepage editorial content | Mixed: local component defaults plus Sanity/API feeds | Local fallback copy/assets |
| Parents attendance guidance | `parentsPage` in Sanity | Hard-coded defaults in page UI |
| Teaching & Learning | `teachingLearningPage` in Sanity | Hard-coded client defaults |
| Extracurricular | `extracurricularPage` in Sanity | Hard-coded client defaults |
| School lunches | `schoolMenu` in Sanity | Static fallback PDF links |
| Staff access | Google OAuth + signed staff cookie | Redirect to `/staff/login` |
| Admissions inbox | Sanity `admissionsEnquiry` docs | None; endpoint returns error if write token missing |
| News feed | Instagram Graph API | Empty list |
| Calendar | Remote ICS feed | Last known parsed events in process memory |
| External gallery/music | Public env-configured links | Default public URLs |
| Peripatetic timetable | Private env-configured redirect | Redirect to contact page |

## Third-Party Integrations
- Sanity CMS for structured content and Studio.
- Google OAuth for staff sign-in.
- Instagram Graph API for `/news`.
- ICS calendar feed from `www.morpethschool.org.uk`.
- Vercel Analytics and Speed Insights.
- Optional Microsoft Clarity and Hotjar.

## Environment Variables
### Required for full production behaviour
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_WRITE_TOKEN`
- `STAFF_GOOGLE_CLIENT_ID`
- `STAFF_GOOGLE_CLIENT_SECRET`
- `STAFF_AUTH_SECRET`

### Optional / recommended
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `STAFF_GOOGLE_REDIRECT_URI`
- `STAFF_ALLOWED_GOOGLE_DOMAINS`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `NEXT_PUBLIC_CLARITY_ID`
- `NEXT_PUBLIC_HOTJAR_ID`
- `NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION`
- `NEXT_PUBLIC_EXTERNAL_GALLERY_URL`
- `NEXT_PUBLIC_EXTERNAL_MUSIC_URL`
- `NEXT_PUBLIC_EMAIL_URL`
- `NEXT_PUBLIC_EMAIL_HELP_URL`
- `NEXT_PUBLIC_REMOTE_ACCESS_URL`
- `PRIVATE_PERIPATETIC_TIMETABLE_URL`

## Current Engineering Guardrails
- Shared env/config lives in `lib/env.ts`.
- Shared CMS query loaders live in `lib/contentLoaders.ts`.
- Security headers are defined in `next.config.ts`.
- Staff access is enforced server-side by `requireStaffSession`.
- CI runs lint, smoke tests, and production build.
- `public/video` should only contain small shared fallback assets. Page-specific or campaign videos should come from Sanity/media hosting rather than checked-in duplicates.
- Autoplay or looping feature media loaded through the shared media helpers is intentionally capped at `12MB` in `lib/mediaPolicy.ts`. This is a homepage performance guardrail, not a blanket size limit for every Sanity asset.
- If a Sanity video is too large for those lightweight surfaces, editors should provide either a smaller web-encoded loop, a poster image, or a non-autoplay/static treatment.
