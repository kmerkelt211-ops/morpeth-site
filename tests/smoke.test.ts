import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  getAdmissionsRequestFingerprint,
  normalizeAdmissionsPayload,
  validateAdmissionsPayload,
} from "../lib/admissions.ts";
import { clampCalendarLimit, parseEventsFromIcs } from "../lib/calendarEvents.ts";
import { validateAssistantQuestion } from "../lib/schoolAssistantValidation.ts";
import { buildStaffLoginRedirectPath } from "../lib/staffAuthPaths.ts";

test("homepage source includes core public journeys", async () => {
  const wrapperSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const clientSource = await readFile(new URL("../app/HomePageClient.tsx", import.meta.url), "utf8");
  assert.match(wrapperSource, /loadHomePageData/);
  assert.match(clientSource, /SchoolAssistantSection/);
  assert.match(clientSource, /admissions/i);
});

test("admissions payload validation normalises and validates required fields", () => {
  const payload = normalizeAdmissionsPayload({
    fullName: "  Sam Taylor ",
    email: "SAM@example.com ",
    message: "Please tell me about Year 7 admissions.",
    sourcePage: "/",
  });

  assert.equal(payload.fullName, "Sam Taylor");
  assert.equal(payload.email, "sam@example.com");
  assert.equal(validateAdmissionsPayload(payload), null);
  assert.equal(getAdmissionsRequestFingerprint("203.0.113.5").length, 64);
});

test("staff redirect path sanitises unsafe return targets", () => {
  assert.equal(
    buildStaffLoginRedirectPath("//evil.example"),
    "/staff/login?returnTo=%2Fstaff",
  );
  assert.equal(
    buildStaffLoginRedirectPath("/staff?tab=directory"),
    "/staff/login?returnTo=%2Fstaff%3Ftab%3Ddirectory",
  );
});

test("assistant validation rejects empty and oversized questions", () => {
  assert.equal(validateAssistantQuestion(""), "Please ask a fuller question so I can help.");
  assert.equal(validateAssistantQuestion("x".repeat(801)), "Question is too long. Please keep it under 800 characters.");
  assert.equal(validateAssistantQuestion("What are the term dates?"), null);
});

test("calendar parsing handles ICS input and limit clamping", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "UID:test-open-evening",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20990101T100000Z",
    "DTEND:20990101T110000Z",
    "SUMMARY:Open Evening",
    "LOCATION:Main Hall",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  const events = parseEventsFromIcs(ics);
  assert.equal(events.length, 1);
  assert.equal(events[0]?.title, "Open Evening");
  assert.equal(clampCalendarLimit(999), 500);
  assert.equal(clampCalendarLimit(0), 6);
});
