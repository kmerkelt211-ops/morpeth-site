import { type SchemaTypeDefinition, defineType, defineField } from "sanity";
import house from "../schemas/house";
import houseUpdate from "../schemas/houseUpdate";
import coachingCircles from "../schemas/coachingCircles";
import letter from "../schemas/letter";
import teachingLearningPage from "../schemas/teachingLearningPage";
import extracurricularPage from "../schemas/extracurricularPage";
import parentsPage from "../schemas/parentsPage";
import admissionsEnquiry from "../schemas/admissionsEnquiry";
import studentSpotlight from "../schemas/studentSpotlight";
import policyDocument from "../schemas/policyDocument";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // NEWS POSTS
    defineType({
      name: "post",
      title: "News post",
      type: "document",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "slug",
          type: "slug",
          options: { source: "title" },
          validation: (r) => r.required(),
        }),
        defineField({
          name: "publishedAt",
          type: "datetime",
          initialValue: () => new Date().toISOString(),
        }),
        defineField({ name: "excerpt", type: "text" }),
        defineField({ name: "mainImage", type: "image", options: { hotspot: true } }),
        defineField({
          name: "categories",
          type: "array",
          of: [{ type: "reference", to: [{ type: "category" }] }],
        }),
        defineField({
          name: "tags",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
        }),
        defineField({ name: "featured", type: "boolean" }),
        defineField({
          name: "body",
          type: "array",
          of: [{ type: "block" }, { type: "image" }],
        }),
      ],
    }),

    // NEWS CATEGORIES
    defineType({
      name: "category",
      title: "Category",
      type: "document",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
      ],
    }),

    // EVENTS
    defineType({
      name: "event",
      title: "Event",
      type: "document",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "slug",
          type: "slug",
          options: { source: "title" },
          validation: (r) => r.required(),
        }),
        defineField({ name: "start", type: "datetime", validation: (r) => r.required() }),
        defineField({ name: "end", type: "datetime" }),
        defineField({ name: "location", type: "string" }),
        defineField({
          name: "audience",
          type: "string",
          options: { list: ["All", "Parents", "Students", "Staff", "Sixth Form"] },
        }),
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "featured", type: "boolean" }),
        defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
      ],
    }),

    // SCHOOL MENUS (PDF + images for previews)
    defineType({
      name: "schoolMenu",
      title: "School menu",
      type: "document",
      fields: [
        defineField({
          name: "title",
          title: "Menu title (e.g. December menu)",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "month",
          title: "Month / period",
          type: "date",
          description:
            "Use the first day of the month (e.g. 2025-12-01) so the site can automatically show the latest menu.",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "menuPdf",
          title: "Full monthly menu PDF (lunch + break combined)",
          type: "file",
          options: { accept: "application/pdf", storeOriginalFilename: true },
          validation: (r) => r.required(),
        }),
        defineField({
          name: "allergensPdf",
          title: "Allergens information PDF",
          type: "file",
          options: { accept: "application/pdf", storeOriginalFilename: true },
        }),
        defineField({
          name: "specialMenuPdf",
          title: "Special menu PDF (optional)",
          description: "Use for one-off menus (e.g. Christmas lunch).",
          type: "file",
          options: { accept: "application/pdf", storeOriginalFilename: true },
        }),
        defineField({
          name: "specialMenuLabel",
          title: "Special menu button label (optional)",
          type: "string",
          initialValue: "Download special menu (PDF)",
          hidden: ({ parent }) => !parent?.specialMenuPdf,
        }),
        defineField({
          name: "images",
          title: "This month’s menu images (JPG/PNG for on-page carousel)",
          description:
            "Upload the pages as JPG/PNG so families can view without downloading the PDF.",
          type: "array",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                },
              ],
            },
          ],
        }),
      ],
    }),

    // STAFF DIRECTORY
    defineType({
      name: "staffMember",
      title: "Staff member",
      type: "document",
      fields: [
        defineField({ name: "name", type: "string", validation: (r) => r.required() }),
        defineField({ name: "slug", type: "slug", options: { source: "name" } }),
        defineField({ name: "role", type: "string" }),
        defineField({ name: "department", type: "string" }),
        defineField({
          name: "team",
          title: "Team",
          type: "string",
          options: {
            layout: "radio",
            list: [
              { title: "Senior Leadership Team (SLT)", value: "slt" },
              { title: "Teaching", value: "teaching" },
              { title: "Support", value: "support" },
            ],
          },
        }),
        defineField({ name: "phone", title: "Telephone", type: "string" }),
        defineField({ name: "email", type: "string" }),
        defineField({ name: "photo", type: "image", options: { hotspot: true } }),
        defineField({ name: "bio", type: "array", of: [{ type: "block" }] }),
        defineField({ name: "order", type: "number" }),
      ],
    }),

    // HOMEPAGE SCHOOL PULSE MEDIA (singleton document)
    defineType({
      name: "homeSchoolPulseSettings",
      title: "Home: School Pulse media",
      type: "document",
      fields: [
        defineField({
          name: "pulseMediaTitle",
          title: "School Pulse media title",
          type: "string",
          description: "Short heading shown over the media panel on the homepage.",
        }),
        defineField({
          name: "pulseMediaDescription",
          title: "School Pulse media description",
          type: "text",
          rows: 3,
          description: "Support text for the media panel.",
        }),
        defineField({
          name: "pulseMediaCtaLabel",
          title: "School Pulse media button label",
          type: "string",
          description: "e.g. Explore school life",
        }),
        defineField({
          name: "pulseMediaCtaHref",
          title: "School Pulse media button link",
          type: "string",
          description: "Internal path or full URL, e.g. /our-school",
        }),
        defineField({
          name: "pulseMediaLoopFile",
          title: "School Pulse media loop (upload)",
          type: "file",
          options: { accept: "video/*", storeOriginalFilename: true },
          description: "If set, this looping video is shown instead of the photo carousel.",
        }),
        defineField({
          name: "pulseMediaLoopUrl",
          title: "School Pulse media loop (URL)",
          type: "url",
          description: "Optional external loop video URL used when no upload is provided.",
        }),
        defineField({
          name: "pulseMediaPoster",
          title: "School Pulse media poster",
          type: "image",
          options: { hotspot: true },
          description: "Poster frame for the media loop.",
        }),
        defineField({
          name: "pulseMediaSlides",
          title: "School Pulse media slides",
          type: "array",
          description: "Used as a rotating photo carousel when no loop video is set.",
          of: [
            defineField({
              name: "slide",
              title: "Slide",
              type: "object",
              fields: [
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                }),
                defineField({
                  name: "caption",
                  title: "Caption",
                  type: "string",
                }),
              ],
              preview: {
                select: {
                  title: "caption",
                  subtitle: "alt",
                  media: "image",
                },
                prepare(selection) {
                  return {
                    title: selection.title || "Pulse slide",
                    subtitle: selection.subtitle || "No alt text",
                    media: selection.media,
                  };
                },
              },
            }),
          ],
        }),
      ],
    }),

    // HOMEPAGE SIXTH FORM HIGHLIGHT MEDIA (singleton document)
    defineType({
      name: "homeSixthFormHighlightSettings",
      title: "Home: Sixth Form highlight media",
      type: "document",
      fields: [
        defineField({
          name: "homeSixthFormHighlightVideoFile",
          title: "Sixth Form highlight video (upload)",
          type: "file",
          options: { accept: "video/*", storeOriginalFilename: true },
          description: "Homepage strip media under School Pulse. Upload a video to show instead of a photo.",
        }),
        defineField({
          name: "homeSixthFormHighlightVideoUrl",
          title: "Sixth Form highlight video (URL)",
          type: "url",
          description: "Optional external video URL for the homepage Sixth Form strip.",
        }),
        defineField({
          name: "homeSixthFormHighlightPoster",
          title: "Sixth Form highlight video poster",
          type: "image",
          options: { hotspot: true },
          description: "Poster image shown before the video plays.",
        }),
        defineField({
          name: "homeSixthFormHighlightImage",
          title: "Sixth Form highlight photo",
          type: "image",
          options: { hotspot: true },
          description: "Fallback image used when no video is set.",
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
    }),

    // SITE SETTINGS (strapline, hero video, contact etc.)
    defineType({
      name: "siteSettings",
      title: "Site settings",
      type: "document",
      groups: [
        { name: "general", title: "General" },
        { name: "heroMedia", title: "Hero videos" },
        { name: "pageMedia", title: "Page media" },
        { name: "contactDetails", title: "Contact" },
      ],
      fields: [
        defineField({ name: "strapline", type: "string", group: "general" }),
        defineField({
          name: "heroVideoUrl",
          title: "Global hero video URL",
          type: "url",
          group: "heroMedia",
          description:
            "Default hero video for all pages. Use an MP4/WebM URL. Individual page overrides below are optional.",
        }),
        defineField({
          name: "heroVideoFile",
          title: "Global hero video file (upload)",
          type: "file",
          group: "heroMedia",
          options: { accept: "video/*", storeOriginalFilename: true },
          description:
            "Upload a global hero video file. If set, this is preferred over the global URL.",
        }),
        defineField({
          name: "heroVideoWebmUrl",
          title: "Global hero video WebM URL (optional)",
          type: "url",
          group: "heroMedia",
          description:
            "Optional WebM source used before MP4 for faster delivery on supported browsers.",
        }),
        defineField({
          name: "heroVideoWebmFile",
          title: "Global hero video WebM file (upload, optional)",
          type: "file",
          group: "heroMedia",
          options: { accept: "video/webm", storeOriginalFilename: true },
          description:
            "Upload a global WebM file for faster delivery. If set, this is preferred over the global WebM URL.",
        }),
        defineField({
          name: "heroVideoOverrides",
          title: "Per-page hero overrides (optional)",
          type: "object",
          group: "heroMedia",
          fields: [
            defineField({ name: "home", title: "Home hero video URL", type: "url" }),
            defineField({ name: "ourSchool", title: "Our School hero video URL", type: "url" }),
            defineField({
              name: "teachingLearning",
              title: "Teaching & Learning hero video URL",
              type: "url",
            }),
            defineField({ name: "sixthForm", title: "Sixth Form hero video URL", type: "url" }),
            defineField({
              name: "extracurricular",
              title: "Extracurricular hero video URL",
              type: "url",
            }),
            defineField({ name: "parents", title: "Parents hero video URL", type: "url" }),
            defineField({ name: "staff", title: "Staff hero video URL", type: "url" }),
          ],
        }),
        defineField({
          name: "heroVideoFileOverrides",
          title: "Per-page hero file overrides (upload, optional)",
          type: "object",
          group: "heroMedia",
          fields: [
            defineField({
              name: "home",
              title: "Home hero video file",
              type: "file",
              options: { accept: "video/*", storeOriginalFilename: true },
            }),
            defineField({
              name: "ourSchool",
              title: "Our School hero video file",
              type: "file",
              options: { accept: "video/*", storeOriginalFilename: true },
            }),
            defineField({
              name: "teachingLearning",
              title: "Teaching & Learning hero video file",
              type: "file",
              options: { accept: "video/*", storeOriginalFilename: true },
            }),
            defineField({
              name: "sixthForm",
              title: "Sixth Form hero video file",
              type: "file",
              options: { accept: "video/*", storeOriginalFilename: true },
            }),
            defineField({
              name: "extracurricular",
              title: "Extracurricular hero video file",
              type: "file",
              options: { accept: "video/*", storeOriginalFilename: true },
            }),
            defineField({
              name: "parents",
              title: "Parents hero video file",
              type: "file",
              options: { accept: "video/*", storeOriginalFilename: true },
            }),
            defineField({
              name: "staff",
              title: "Staff hero video file",
              type: "file",
              options: { accept: "video/*", storeOriginalFilename: true },
            }),
          ],
        }),
        defineField({
          name: "heroVideoWebmOverrides",
          title: "Per-page hero WebM overrides (optional)",
          type: "object",
          group: "heroMedia",
          fields: [
            defineField({ name: "home", title: "Home hero WebM URL", type: "url" }),
            defineField({ name: "ourSchool", title: "Our School hero WebM URL", type: "url" }),
            defineField({
              name: "teachingLearning",
              title: "Teaching & Learning hero WebM URL",
              type: "url",
            }),
            defineField({ name: "sixthForm", title: "Sixth Form hero WebM URL", type: "url" }),
            defineField({
              name: "extracurricular",
              title: "Extracurricular hero WebM URL",
              type: "url",
            }),
            defineField({ name: "parents", title: "Parents hero WebM URL", type: "url" }),
            defineField({ name: "staff", title: "Staff hero WebM URL", type: "url" }),
          ],
        }),
        defineField({
          name: "heroVideoWebmFileOverrides",
          title: "Per-page hero WebM file overrides (upload, optional)",
          type: "object",
          group: "heroMedia",
          fields: [
            defineField({
              name: "home",
              title: "Home hero WebM file",
              type: "file",
              options: { accept: "video/webm", storeOriginalFilename: true },
            }),
            defineField({
              name: "ourSchool",
              title: "Our School hero WebM file",
              type: "file",
              options: { accept: "video/webm", storeOriginalFilename: true },
            }),
            defineField({
              name: "teachingLearning",
              title: "Teaching & Learning hero WebM file",
              type: "file",
              options: { accept: "video/webm", storeOriginalFilename: true },
            }),
            defineField({
              name: "sixthForm",
              title: "Sixth Form hero WebM file",
              type: "file",
              options: { accept: "video/webm", storeOriginalFilename: true },
            }),
            defineField({
              name: "extracurricular",
              title: "Extracurricular hero WebM file",
              type: "file",
              options: { accept: "video/webm", storeOriginalFilename: true },
            }),
            defineField({
              name: "parents",
              title: "Parents hero WebM file",
              type: "file",
              options: { accept: "video/webm", storeOriginalFilename: true },
            }),
            defineField({
              name: "staff",
              title: "Staff hero WebM file",
              type: "file",
              options: { accept: "video/webm", storeOriginalFilename: true },
            }),
          ],
        }),
        // Year 5 film fields (used on the Our School page)
        defineField({
          name: "recruitmentVideoUrl",
          title: "Year 5 film (URL)",
          type: "url",
          group: "pageMedia",
          description: "Paste a public MP4 or direct playable URL.",
        }),
        defineField({
          name: "recruitmentVideoFile",
          title: "Year 5 film (upload)",
          type: "file",
          group: "pageMedia",
          options: { accept: "video/*", storeOriginalFilename: true },
          description: "Upload the recruitment film to Sanity if you prefer hosting here.",
        }),
        defineField({
          name: "recruitmentPoster",
          title: "Year 5 film poster",
          type: "image",
          group: "pageMedia",
          options: { hotspot: true },
        }),
        defineField({
          name: "recruitmentLoopFile",
          title: "Year 5 loop (upload)",
          type: "file",
          group: "pageMedia",
          options: { accept: "video/*", storeOriginalFilename: true },
          description: "Short looping teaser version of the Year 5 film.",
        }),
        defineField({
          name: "recruitmentLoopUrl",
          title: "Year 5 loop (URL)",
          type: "url",
          group: "pageMedia",
          description: "Optional external URL for the looping teaser clip.",
        }),
        defineField({
          name: "sixthFormWhyJoinVideoUrl",
          title: "Sixth Form: Why join video (URL)",
          type: "url",
          group: "pageMedia",
          description: "Optional direct playable URL for the Why join Sixth Form video.",
        }),
        defineField({
          name: "sixthFormWhyJoinVideoFile",
          title: "Sixth Form: Why join video (upload)",
          type: "file",
          group: "pageMedia",
          options: { accept: "video/*", storeOriginalFilename: true },
          description: "Upload the Why join Sixth Form video to Sanity.",
        }),
        defineField({
          name: "sixthFormWhyJoinVideoPoster",
          title: "Sixth Form: Why join video poster",
          type: "image",
          group: "pageMedia",
          options: { hotspot: true },
          description: "Poster image shown before the video plays.",
        }),
        defineField({ name: "contactEmail", type: "string", group: "contactDetails" }),
        defineField({ name: "contactPhone", type: "string", group: "contactDetails" }),
        defineField({ name: "address", type: "text", group: "contactDetails" }),
      ],
    }),

    // JOB POSTS / VACANCIES
    defineType({
      name: "jobPost",
      title: "Job post",
      type: "document",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({
          name: "slug",
          type: "slug",
          options: { source: "title" },
          validation: (r) => r.required(),
        }),
        defineField({
          name: "publishedAt",
          type: "datetime",
          initialValue: () => new Date().toISOString(),
        }),
        defineField({
          name: "status",
          type: "string",
          options: { list: ["Open", "Closed", "Draft"] },
          initialValue: "Open",
        }),
        defineField({ name: "department", type: "string" }),
        defineField({
          name: "jobType",
          title: "Role type",
          type: "string",
          options: { list: ["Teaching", "Support", "Leadership", "Apprenticeship", "Other"] },
        }),
        defineField({
          name: "contractType",
          type: "string",
          options: { list: ["Full-time", "Part-time", "Fixed-term", "Casual"] },
        }),
        defineField({ name: "salary", type: "string" }),
        defineField({ name: "location", type: "string", initialValue: "Bethnal Green, London E2 0PX" }),
        defineField({ name: "closingDate", type: "datetime", validation: (r) => r.required() }),
        defineField({ name: "startDate", type: "date" }),
        defineField({ name: "applyUrl", type: "url" }),
        defineField({ name: "contactEmail", type: "string" }),
        defineField({ name: "attachments", type: "array", of: [{ type: "file" }], options: { layout: "grid" } }),
        defineField({ name: "featured", type: "boolean" }),
        defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image" }] }),
      ],
    }),

    // GENERIC RESULTS METRIC (re-usable for graphs + headline bars)
    defineType({
      name: "resultMetric",
      title: "Result metric",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "value",
          title: "Value",
          type: "number",
          description: "Usually a percentage, but can be any numeric value.",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "max",
          title: "Maximum value",
          type: "number",
          description: "Optional. Defaults to 100. Only needed if the metric is not out of 100.",
        }),
        defineField({
          name: "colourClass",
          title: "Bar colour (Tailwind class)",
          type: "string",
          description:
            "Optional Tailwind class to control bar colour, e.g. bg-sky-600. If left empty a default colour will be used.",
        }),
      ],
    }),

    // RE-USABLE RESULTS GRAPH (for detailed breakdown sections)
    defineType({
      name: "resultsGraph",
      title: "Results graph",
      type: "document",
      fields: [
        defineField({
          name: "title",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "subtitle",
          type: "text",
        }),
        defineField({
          name: "category",
          type: "string",
          description: "e.g. GCSE, Sixth Form, EBacc, Destinations.",
        }),
        defineField({
          name: "year",
          title: "Year / cohort",
          type: "string",
        }),
        defineField({
          name: "metrics",
          title: "Metrics / bars",
          type: "array",
          of: [{ type: "resultMetric" }],
          validation: (r) => r.min(1),
        }),
        defineField({
          name: "note",
          title: "Footnote / explanation",
          type: "text",
        }),
      ],
    }),

    // GCSE / KEY STAGE 4 RESULTS
    defineType({
      name: "gcseResults",
      title: "GCSE / Key Stage 4 results",
      type: "document",
      fields: [
        defineField({
          name: "title",
          title: "Section label",
          type: "string",
          initialValue: "Key Stage 4",
        }),
        defineField({
          name: "heroHeading",
          title: "Main heading",
          type: "string",
          initialValue: "Celebrating achievement",
        }),
        defineField({
          name: "heroImage",
          title: "Hero image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "intro",
          title: "Intro text",
          type: "array",
          of: [{ type: "block" }],
          description: "Short introduction above the GCSE headline stats.",
        }),
        defineField({
          name: "resultsHeading",
          title: "Results across the board – heading",
          type: "string",
          initialValue: "Results across the board",
        }),
        defineField({
          name: "resultsBullets",
          title: "Headline bullet points",
          type: "array",
          of: [{ type: "string" }],
          description: "Key bullet points such as % achieving grade 4+/5+, EBacc entry etc.",
        }),
        defineField({
          name: "headlineMetrics",
          title: "GCSE headline graph bars",
          type: "array",
          of: [{ type: "resultMetric" }],
          description: "Bars shown in the GCSE headline graph (e.g. Grade 4+ and Grade 5+ in English & Maths).",
        }),
        defineField({
          name: "progressHeading",
          title: "Progress heading",
          type: "string",
          initialValue: "Progress",
        }),
        defineField({
          name: "progressBody",
          title: "Progress text",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "proudHeading",
          title: "Proud of every student – heading",
          type: "string",
          initialValue: "Proud of every student",
        }),
        defineField({
          name: "proudBody",
          title: "Proud of every student – text",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "dfeLinkLabel",
          title: "DfE performance link label",
          type: "string",
          initialValue: "View Key Stage 4 performance",
        }),
        defineField({
          name: "dfeLinkUrl",
          title: "DfE performance link URL",
          type: "url",
        }),
        defineField({
          name: "breakdownGraphs",
          title: "GCSE results breakdown graphs",
          type: "array",
          of: [{ type: "reference", to: [{ type: "resultsGraph" }] }],
          description:
            "Pick one or more detailed graphs (subject performance, EBacc, destinations etc.) to display under the GCSE section.",
        }),
      ],
    }),

    // SIXTH FORM / KEY STAGE 5 RESULTS
    defineType({
      name: "sixthFormResults",
      title: "Sixth Form / Key Stage 5 results",
      type: "document",
      fields: [
        defineField({
          name: "title",
          title: "Section label",
          type: "string",
          initialValue: "Key Stage 5",
        }),
        defineField({
          name: "heroHeading",
          title: "Main heading",
          type: "string",
          initialValue: "Morpeth Sixth Form",
        }),
        defineField({
          name: "heroImage",
          title: "Hero image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "intro",
          title: "Intro text",
          type: "array",
          of: [{ type: "block" }],
          description: "Opening paragraphs about Sixth Form achievements and ethos.",
        }),
        defineField({
          name: "destinationsHeading",
          title: "Destinations heading",
          type: "string",
          initialValue: "Destinations",
        }),
        defineField({
          name: "destinationsBody",
          title: "Destinations text",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "curriculumHeading",
          title: "Curriculum heading",
          type: "string",
          initialValue: "A broad and inclusive curriculum",
        }),
        defineField({
          name: "curriculumBody",
          title: "Curriculum text",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "aLevelHeadlineMetrics",
          title: "A level headline metrics",
          type: "array",
          of: [{ type: "resultMetric" }],
          description: "Bars for headline A level results (all A*, A*–B, A*–C, overall pass rate, etc.).",
        }),
        defineField({
          name: "btecHeadlineMetrics",
          title: "BTEC headline metrics",
          type: "array",
          of: [{ type: "resultMetric" }],
          description: "Bars for headline BTEC results (D*, D*–D, D*–M, D*–P, etc.).",
        }),
        defineField({
          name: "btecSummary",
          title: "BTEC summary / APS text",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "dfeLinkLabel",
          title: "DfE KS5 performance link label",
          type: "string",
          initialValue: "View KS5 performance on DfE",
        }),
        defineField({
          name: "dfeLinkUrl",
          title: "DfE KS5 performance link URL",
          type: "url",
        }),
        defineField({
          name: "breakdownGraphs",
          title: "Sixth Form results breakdown graphs",
          type: "array",
          of: [{ type: "reference", to: [{ type: "resultsGraph" }] }],
          description:
            "Pick one or more detailed graphs (grade distributions, BTEC outcomes, student profile, etc.) to display under the Sixth Form section.",
        }),
      ],
    }),

    house,
    houseUpdate,
    coachingCircles,
    letter,
    teachingLearningPage,
    extracurricularPage,
    parentsPage,
    admissionsEnquiry,
    studentSpotlight,
    policyDocument,
  ],
};
