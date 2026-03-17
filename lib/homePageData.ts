import { client } from "../sanity/client";
import { getCalendarEvents } from "./calendarEvents";
import { fetchInstagramNewsPosts } from "./instagramFeed";
import {
  DEFAULT_HOME_SIXTH_FORM_MEDIA,
  DEFAULT_PULSE_MEDIA,
  loadHomeSixthFormMedia,
  loadPulseMedia,
  type HomeSixthFormMedia,
  type PulseMedia,
} from "./siteMediaLoaders";

export type CalendarEvent = {
  title: string;
  start: string;
  end?: string;
  location?: string;
  url?: string;
};

export type NewsCard = {
  title: string;
  href: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SpotlightCard = NewsCard & {
  id?: string;
  studentName?: string;
  yearGroup?: string;
  highlight?: string;
  achievementTag?: string;
};

export type NoticePulse = {
  title?: string;
  date?: string;
};

export type LunchPulse = {
  title?: string;
  month?: string;
};

export type AttendancePulse = {
  title?: string;
  description?: string;
  phoneHref?: string;
  phoneDisplay?: string;
  emailAddress?: string;
};

export type TimelineEvent = {
  title: string;
  start: string;
  location?: string;
  audience?: string;
  href: string;
};

export type Metric = {
  label: string;
  value: number;
};

export type SchoolPulseInitialData = {
  events: CalendarEvent[];
  posts: NewsCard[];
  notice: NoticePulse | null;
  lunchMenu: LunchPulse | null;
  attendance: AttendancePulse | null;
  pulseMedia: PulseMedia;
};

export type ResultsSectionInitialData = {
  gcseBars: Metric[];
  sixthFormBars: Metric[];
};

export type HomePageInitialData = {
  schoolPulse: SchoolPulseInitialData;
  spotlights: SpotlightCard[];
  timeline: TimelineEvent[];
  results: ResultsSectionInitialData;
  sixthFormHighlight: HomeSixthFormMedia;
};

const STUDENT_SPOTLIGHT_QUERY = `
*[_type == "studentSpotlight" && coalesce(featured, true) == true && coalesce(publishedAt, _createdAt) <= now() && !(_id in path("drafts.**"))]
| order(coalesce(publishedAt, _createdAt) desc)[0...8]{
  "id": _id,
  title,
  studentName,
  yearGroup,
  highlight,
  "href": select(
    defined(ctaHref) => ctaHref,
    "/student-spotlights/" + _id
  ),
  "date": coalesce(publishedAt, _createdAt),
  "imageUrl": coalesce(photo.asset->url, backgroundImage.asset->url),
  "imageAlt": coalesce(photo.alt, backgroundImage.alt, title),
  achievementTag
}
`;

const TIMELINE_EVENTS_QUERY = `
*[_type == "event" && defined(slug.current) && dateTime(start) >= dateTime(now()) && !(_id in path("drafts.**"))]
| order(start asc)[0...6]{
  title,
  start,
  location,
  audience,
  "href": "/events/" + slug.current
}
`;

const RESULTS_QUERY = `
{
  "gcse": *[_type == "gcseResults"][0]{
    "headline": headlineMetrics[]{
      label,
      value
    }
  },
  "sixth": *[_type == "sixthFormResults"][0]{
    "headline": aLevelHeadlineMetrics[]{
      label,
      value
    }
  }
}
`;

const PULSE_NOTICE_QUERY = `
*[_type == "letter"]
| order(coalesce(publishedAt, _createdAt) desc)[0]{
  title,
  "date": coalesce(publishedAt, _createdAt)
}
`;

const PULSE_LUNCH_QUERY = `
*[_type == "schoolMenu"]
| order(month desc, _createdAt desc)[0]{
  title,
  month
}
`;

const PULSE_ATTENDANCE_QUERY = `
*[_type == "parentsPage"][0]{
  "title": coalesce(attendanceCard.title, attendanceModal.reportingTitle),
  "description": coalesce(attendanceCard.description, attendanceModal.reportingParagraphs[0]),
  "phoneHref": coalesce(attendanceCard.phoneHref, attendanceModal.reportingPhoneHref),
  "phoneDisplay": coalesce(attendanceCard.phoneDisplay, attendanceModal.reportingPhoneDisplay),
  "emailAddress": coalesce(attendanceCard.emailAddress, attendanceModal.reportingEmailAddress)
}
`;

const DEFAULT_GCSE_BARS: Metric[] = [
  { label: "Grade 5+ in English & Maths", value: 65 },
  { label: "Grades 9-7 (all subjects)", value: 30 },
];

const DEFAULT_SIXTH_FORM_BARS: Metric[] = [
  { label: "A level A*-B", value: 55 },
  { label: "Students to university / HE", value: 80 },
];

export async function loadHomePageData(): Promise<HomePageInitialData> {
  const [
    calendarResult,
    instagramResult,
    noticeResult,
    lunchResult,
    attendanceResult,
    pulseMediaResult,
    spotlightResult,
    timelineResult,
    resultsResult,
    sixthFormHighlightResult,
  ] = await Promise.allSettled([
    getCalendarEvents(4),
    fetchInstagramNewsPosts({ limit: 3, revalidateSeconds: 300 }),
    client.fetch<NoticePulse | null>(PULSE_NOTICE_QUERY),
    client.fetch<LunchPulse | null>(PULSE_LUNCH_QUERY),
    client.fetch<AttendancePulse | null>(PULSE_ATTENDANCE_QUERY),
    loadPulseMedia(),
    client.fetch<SpotlightCard[]>(STUDENT_SPOTLIGHT_QUERY),
    client.fetch<TimelineEvent[]>(TIMELINE_EVENTS_QUERY),
    client.fetch<{
      gcse?: { headline?: Metric[] | null };
      sixth?: { headline?: Metric[] | null };
    }>(RESULTS_QUERY),
    loadHomeSixthFormMedia(),
  ]);

  const resultsData =
    resultsResult.status === "fulfilled" && resultsResult.value
      ? resultsResult.value
      : undefined;

  return {
    schoolPulse: {
      events:
        calendarResult.status === "fulfilled" && Array.isArray(calendarResult.value)
          ? calendarResult.value
          : [],
      posts:
        instagramResult.status === "fulfilled" && Array.isArray(instagramResult.value)
          ? instagramResult.value
          : [],
      notice:
        noticeResult.status === "fulfilled" ? noticeResult.value || null : null,
      lunchMenu:
        lunchResult.status === "fulfilled" ? lunchResult.value || null : null,
      attendance:
        attendanceResult.status === "fulfilled" ? attendanceResult.value || null : null,
      pulseMedia:
        pulseMediaResult.status === "fulfilled"
          ? pulseMediaResult.value
          : DEFAULT_PULSE_MEDIA,
    },
    spotlights:
      spotlightResult.status === "fulfilled" && Array.isArray(spotlightResult.value)
        ? spotlightResult.value
        : [],
    timeline:
      timelineResult.status === "fulfilled" && Array.isArray(timelineResult.value)
        ? timelineResult.value
        : [],
    results: {
      gcseBars:
        Array.isArray(resultsData?.gcse?.headline) && resultsData.gcse.headline.length > 0
          ? resultsData.gcse.headline.slice(0, 2)
          : DEFAULT_GCSE_BARS,
      sixthFormBars:
        Array.isArray(resultsData?.sixth?.headline) && resultsData.sixth.headline.length > 0
          ? resultsData.sixth.headline.slice(0, 2)
          : DEFAULT_SIXTH_FORM_BARS,
    },
    sixthFormHighlight:
      sixthFormHighlightResult.status === "fulfilled"
        ? sixthFormHighlightResult.value
        : DEFAULT_HOME_SIXTH_FORM_MEDIA,
  };
}
