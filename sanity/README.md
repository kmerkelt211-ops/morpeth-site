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
- `Parents`: `Letters home`, `School menu`
- `Staff`: `Staff directory`
- `Jobs`: `Vacancies`
- `Morpeth TV`: `Morpeth TV videos`

Gallery content is managed on the external gallery website, not in this Studio.

If you need raw access, use **All Document Types**.

## Developer notes

- Application Sanity client: `sanity/client.ts`
- Studio schema definitions: `sanity/schemaTypes/index.ts` and `sanity/schemas/*`
- Studio navigation: `sanity/structure.ts`
