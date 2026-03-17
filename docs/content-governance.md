# Content Governance Notes

## Pages That Need Regular Review
- Homepage: hero messaging, admissions CTA, notices, events, and assistant links.
- Parents: attendance content, policy links, and contact details.
- School lunches: current menu PDF/images and allergens file.
- News and events: freshness of Instagram feed, Sanity events, and social images.
- Staff: external tool links and domain allowlist.

## Where Editors Update Content
- Sanity Studio:
  - `homeSchoolPulseSettings` for the homepage School Pulse title, copy, CTA, and feature media.
  - `parentsPage` for attendance guidance.
  - `teachingLearningPage` for curriculum content.
  - `extracurricularPage` for enrichment content.
  - `schoolMenu` for lunches PDFs and preview images.
  - `admissionsEnquiry` for enquiry workflow handling.
  - `studentSpotlight`, `event`, `letter`, `policyDocument`, `staffMember`.

## Operational Rules
- Keep privileged or tokenized links out of page content; use internal redirect routes or server env config instead.
- Prefer Portable Text or structured Sanity fields over pasted raw HTML.
- Use published documents as the source of truth for dates, policies, and downloadable files.
- When an external feed fails, keep the page usable with fallback copy rather than blank states.
- Homepage autoplay/loop media should be web-optimised before upload. The shared homepage media helpers reject remote videos above `12MB`, so large feature videos should use a poster image or a click-to-play pattern instead of autoplay.

## When Data Is Missing
- Admissions form should fail with a clear user message if the inbox token is unavailable.
- Staff area should redirect to `/staff/login` if auth config is incomplete or the session is missing.
- Lunches page should still show static guidance even if no current menu document exists.
- News/calendar widgets should degrade gracefully without breaking the page shell.
