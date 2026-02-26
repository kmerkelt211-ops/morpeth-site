import { defineField, defineType } from "sanity";

export default defineType({
  name: "extracurricularPage",
  title: "Extracurricular page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "why", title: "Why Enrichment" },
    { name: "video", title: "Enrichment Video" },
    { name: "clubs", title: "Club Videos" },
    { name: "timetable", title: "Flexible Timetable" },
    { name: "life", title: "Life Beyond Lessons" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero section",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({
          name: "links",
          title: "Hero buttons",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "Anchor / link", type: "string" }),
              ],
              preview: {
                select: { title: "label", subtitle: "href" },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "whyEnrichment",
      title: "Why enrichment matters",
      type: "object",
      group: "why",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "paragraphs",
          title: "Main paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "sidebarTitle", title: "Sidebar title", type: "string" }),
        defineField({
          name: "sidebarBullets",
          title: "Sidebar bullets",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "sidebarNote", title: "Sidebar note", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "enrichmentVideo",
      title: "Enrichment in action section",
      type: "object",
      group: "video",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({
          name: "videoFile",
          title: "Section video (upload)",
          type: "file",
          options: { accept: "video/*", storeOriginalFilename: true },
        }),
        defineField({
          name: "videoUrl",
          title: "Section video URL",
          type: "url",
        }),
        defineField({
          name: "videoPoster",
          title: "Video poster",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "clubVideos",
      title: "Club videos section",
      type: "object",
      group: "clubs",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({
          name: "cards",
          title: "Club cards",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
                defineField({
                  name: "videoFile",
                  title: "Card video (upload)",
                  type: "file",
                  options: { accept: "video/*", storeOriginalFilename: true },
                }),
                defineField({
                  name: "videoUrl",
                  title: "Card video URL",
                  type: "url",
                }),
                defineField({
                  name: "videoPoster",
                  title: "Card poster image",
                  type: "image",
                  options: { hotspot: true },
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "videoUrl", media: "videoPoster" },
              },
            },
          ],
        }),
        defineField({ name: "footerText", title: "Footer note", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "flexibleTimetable",
      title: "Flexible Learning Timetable section",
      type: "object",
      group: "timetable",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "paragraphs",
          title: "Main paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "sidebarTitle", title: "Sidebar title", type: "string" }),
        defineField({
          name: "sidebarBullets",
          title: "Sidebar bullets",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "sidebarBody", title: "Sidebar body", type: "text", rows: 3 }),
        defineField({
          name: "links",
          title: "Action links",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "URL", type: "string" }),
                defineField({
                  name: "openInNewTab",
                  title: "Open in new tab",
                  type: "boolean",
                  initialValue: false,
                }),
              ],
              preview: {
                select: { title: "label", subtitle: "href" },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "lifeBeyondLessons",
      title: "Life beyond lessons section",
      type: "object",
      group: "life",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({
          name: "cards",
          title: "Info cards",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
              ],
              preview: {
                select: { title: "title" },
              },
            },
          ],
        }),
        defineField({ name: "footerText", title: "Footer note", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Extracurricular page",
        subtitle: "Website page settings",
      };
    },
  },
});
