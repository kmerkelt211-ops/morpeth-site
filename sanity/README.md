# Sanity Content Guide

The site uses Sanity Studio at `/studio`.

## Login

1. Open `/content` on the website.
2. Click **Open Studio**.
3. Sign in with your Sanity account.

## How content is organised

In Studio, use:

- `Site settings`: `General settings & contact`, `Hero videos (all pages)`
- `Website Pages` -> `Home`: `School Pulse media (homepage)`, `Sixth Form highlight media (homepage)`, `Student spotlights`, `News posts`, `Events`
- `Our School`: `GCSE results`, `Sixth Form results`, `Houses`, `House updates`, `Coaching Circles`
- `Teaching & Learning`: `Teaching & Learning page`
- `Extracurricular`: `Extracurricular page`
- `Parents`: `Parents page`, `Policies`, `Letters home`, `School menu`
- `Staff`: `Staff directory`
- `Jobs`: `Vacancies`

Gallery content is managed on the external gallery website, not in this Studio.

If you need raw access, use **All Document Types**.

## Hero video editing

In **Site settings** -> **Hero videos (all pages)** (or inside `Site settings`, `Hero videos` tab):

- `Global hero video URL` sets the default hero video used across the website.
- `Global hero video file (upload)` can be used instead of URL, and takes priority over global URL.
- `Per-page hero overrides` lets you change specific pages without affecting others.
  Leave an override blank to use the global default.
- `Per-page hero file overrides (upload)` can override global settings for individual pages.
- `Global hero video WebM URL` and `Per-page hero WebM overrides` are optional, but recommended for faster load.
- `Global hero video WebM file (upload)` and `Per-page hero WebM file overrides` are optional upload-based WebM equivalents.

## Homepage School Pulse media

In **Website Pages** -> **Home** -> **School Pulse media (homepage)**, use the `School Pulse media ...` fields:

- Add `School Pulse media loop (upload)` or `School Pulse media loop (URL)` for a looping video panel.
- If no loop is set, `School Pulse media slides` will rotate as a photo carousel.
- Use title, description and CTA fields to control the text and button shown on the panel.
- This document uses live edit, so changes are applied directly (no separate Publish step).

## Homepage Sixth Form highlight media

In **Website Pages** -> **Home** -> **Sixth Form highlight media (homepage)**:

- Add `Sixth Form highlight video (upload)` or `Sixth Form highlight video (URL)` to show a video in that homepage strip.
- Use `Sixth Form highlight video poster` as the preview frame.
- Use `Sixth Form highlight photo` as the fallback image when no video is set.
- This document uses live edit, so changes are applied directly (no separate Publish step).

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

## Policies editing

- Open `Parents` -> `Policies`.
- Add one `Policy document` per file/link and set a category.
- Upload a PDF in `Policy file` or provide `External URL`.
- The `/policies` page groups documents by category automatically.

## Developer notes

- Application Sanity client: `sanity/client.ts`
- Studio schema definitions: `sanity/schemaTypes/index.ts` and `sanity/schemas/*`
- Studio navigation: `sanity/structure.ts`
