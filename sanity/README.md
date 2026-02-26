# Sanity Content Guide

The site uses Sanity Studio at `/studio`.

## Login

1. Open `/content` on the website.
2. Click **Open Studio**.
3. Sign in with your Sanity account.

## How content is organised

In Studio, use the **Website Pages** section:

- `Home`: `Site settings`, `News posts`, `Events`
- `Our School`: `GCSE results`, `Sixth Form results`, `Houses`, `House updates`, `Coaching Circles`
- `Teaching & Learning`: `Teaching & Learning page`
- `Extracurricular`: `Extracurricular page`
- `Parents`: `Parents page`, `Letters home`, `School menu`
- `Staff`: `Staff directory`
- `Jobs`: `Vacancies`
- `Morpeth TV`: `Morpeth TV videos`

Gallery content is managed on the external gallery website, not in this Studio.

If you need raw access, use **All Document Types**.

## Hero video editing

In **Site settings**:

- `Global hero video URL` sets the default hero video used across the website.
- `Global hero video file (upload)` can be used instead of URL, and takes priority over global URL.
- `Per-page hero overrides` lets you change specific pages without affecting others.
  Leave an override blank to use the global default.
- `Per-page hero file overrides (upload)` can override global settings for individual pages.
- `Global hero video WebM URL` and `Per-page hero WebM overrides` are optional, but recommended for faster load.
- `Global hero video WebM file (upload)` and `Per-page hero WebM file overrides` are optional upload-based WebM equivalents.

## Teaching & Learning + Extracurricular editing

- Both page documents are fully sectioned so non-technical editors can update copy without code changes.
- Subject cards and club cards support both:
  - `Video (upload)` via Sanity file field
  - `Video URL` for externally hosted videos
- On the frontend, uploaded file URLs are used first, then fallback to video URL.

## Parents attendance editing

- Open `Parents` -> `Parents page`.
- `Attendance card` controls the visible Attendance & Absence card on the Parents page.
- `Attendance guidance modal` controls the full pop-up guidance content, including:
  - section titles and paragraphs,
  - attendance scale rows and colour tone,
  - reporting phone/email details,
  - policy button label and link.

## Developer notes

- Application Sanity client: `sanity/client.ts`
- Studio schema definitions: `sanity/schemaTypes/index.ts` and `sanity/schemas/*`
- Studio navigation: `sanity/structure.ts`
