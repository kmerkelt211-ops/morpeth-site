import "server-only";

import { client } from "../sanity/client";

const PARENTS_PAGE_QUERY = `*[_type == "parentsPage"][0]{
  attendanceCard{
    eyebrow,
    title,
    description,
    phoneLabel,
    phoneDisplay,
    phoneHref,
    emailLabel,
    emailAddress,
    buttonLabel,
    buttonHelper
  },
  attendanceModal{
    heading,
    whyTitle,
    whyParagraphs,
    scaleTitle,
    scaleIntroParagraphs,
    scaleRows[]{
      judgement,
      attendance,
      daysAbsent,
      tone,
      summaryText
    },
    summaryTitle,
    reportingTitle,
    reportingParagraphs,
    reportingPhoneLabel,
    reportingPhoneDisplay,
    reportingPhoneHref,
    reportingEmailLabel,
    reportingEmailAddress,
    punctualityTitle,
    punctualityParagraphs,
    concernTitle,
    concernParagraphs,
    termTimeTitle,
    termTimeParagraphs,
    policyTitle,
    policyParagraphs,
    policyButtonLabel,
    policyButtonHref
  }
}`;

const EXTRACURRICULAR_PAGE_QUERY = `*[_type == "extracurricularPage"][0]{
  hero{
    eyebrow,
    title,
    description,
    links[]{
      label,
      href
    }
  },
  whyEnrichment{
    eyebrow,
    title,
    paragraphs,
    sidebarTitle,
    sidebarBullets,
    sidebarNote
  },
  enrichmentVideo{
    eyebrow,
    title,
    paragraphs,
    videoUrl,
    "videoFileUrl": videoFile.asset->url,
    "videoPosterUrl": videoPoster.asset->url
  },
  clubVideos{
    eyebrow,
    title,
    description,
    cards[]{
      title,
      description,
      videoUrl,
      "videoFileUrl": videoFile.asset->url,
      "hoverLoopFileUrl": hoverLoopFile.asset->url,
      "hoverLoopFileSize": hoverLoopFile.asset->size,
      "videoPosterUrl": videoPoster.asset->url
    },
    footerText
  },
  flexibleTimetable{
    eyebrow,
    title,
    paragraphs,
    sidebarTitle,
    sidebarBullets,
    sidebarBody,
    links[]{
      label,
      href,
      openInNewTab
    }
  },
  lifeBeyondLessons{
    eyebrow,
    title,
    description,
    cards[]{
      title,
      description
    },
    footerText
  }
}`;

const TEACHING_LEARNING_PAGE_QUERY = `*[_type == "teachingLearningPage"][0]{
  hero{
    eyebrow,
    title,
    description
  },
  onPage{
    eyebrow,
    title,
    description,
    links[]{
      label,
      href
    }
  },
  ks3{
    eyebrow,
    title,
    description,
    subjects,
    features[]{
      id,
      title,
      description,
      icon
    },
    details[]{
      title,
      paragraphs
    }
  },
  subjects{
    eyebrow,
    title,
    description,
    searchPlaceholder,
    emptyText,
    items[]{
      id,
      name,
      phase,
      description,
      imageUrl,
      "imageFileUrl": image.asset->url,
      videoUrl,
      "videoFileUrl": videoFile.asset->url,
      "videoPosterUrl": videoPoster.asset->url
    }
  },
  support{
    cards[]{
      id,
      title,
      intro,
      details,
      note,
      imageUrl,
      "imageFileUrl": image.asset->url,
      imageAlt
    }
  },
  modal{
    comingSoonText,
    fallbackDescription,
    footerText
  }
}`;

const SCHOOL_MENU_QUERY = `*[_type == "schoolMenu"] | order(month desc, _updatedAt desc)[0]{
  title,
  month,
  "menuPdfUrl": menuPdf.asset->url,
  "allergensPdfUrl": allergensPdf.asset->url,
  "specialMenuPdfUrl": specialMenuPdf.asset->url,
  specialMenuLabel,
  "images": images[]{"url": asset->url, alt}
}`;

type LinkItem = {
  label?: string;
  href?: string;
  openInNewTab?: boolean;
};

const PERIPATETIC_LINK_PATH = "/timetables/peripatetic";

function normaliseLink(link: LinkItem): LinkItem {
  const href = link.href?.trim() || "";
  const label = link.label?.trim() || "";
  const isProtectedPeripateticLink =
    href.includes("app.involveeducation.com") ||
    /peripatetic instrumental lessons timetable/i.test(label);

  if (!isProtectedPeripateticLink) {
    return {
      ...link,
      href,
      label,
    };
  }

  return {
    ...link,
    href: PERIPATETIC_LINK_PATH,
    label: label || "Peripatetic instrumental lessons timetable",
    openInNewTab: false,
  };
}

export async function loadParentsPageContent() {
  return (await client.fetch(PARENTS_PAGE_QUERY)) ?? {};
}

export async function loadExtracurricularPageContent() {
  const data = ((await client.fetch(EXTRACURRICULAR_PAGE_QUERY)) ?? {}) as {
    flexibleTimetable?: { links?: LinkItem[] };
  };

  if (Array.isArray(data.flexibleTimetable?.links)) {
    data.flexibleTimetable.links = data.flexibleTimetable.links.map(normaliseLink);
  }

  return data;
}

export async function loadTeachingLearningPageContent() {
  return (await client.fetch(TEACHING_LEARNING_PAGE_QUERY)) ?? {};
}

export async function loadLatestSchoolMenu() {
  return (await client.fetch(SCHOOL_MENU_QUERY)) ?? null;
}
