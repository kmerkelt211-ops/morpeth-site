import { defineField, defineType } from "sanity";

export default defineType({
  name: "studentSpotlight",
  title: "Student spotlight",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Story title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "studentName",
      title: "Student name",
      type: "string",
    }),
    defineField({
      name: "yearGroup",
      title: "Year group",
      type: "string",
      options: {
        list: [
          { title: "Year 7", value: "Year 7" },
          { title: "Year 8", value: "Year 8" },
          { title: "Year 9", value: "Year 9" },
          { title: "Year 10", value: "Year 10" },
          { title: "Year 11", value: "Year 11" },
          { title: "Sixth Form", value: "Sixth Form" },
        ],
      },
    }),
    defineField({
      name: "achievementTag",
      title: "Achievement tag",
      type: "string",
      description: "Example: Music, STEM, Sport, Leadership.",
    }),
    defineField({
      name: "highlight",
      title: "Highlight quote",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image (optional)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (optional)",
      type: "url",
    }),
    defineField({
      name: "videoFile",
      title: "Video file (optional)",
      type: "file",
      options: { accept: "video/*", storeOriginalFilename: true },
    }),
    defineField({
      name: "linkedPost",
      title: "Linked news post (optional)",
      type: "reference",
      to: [{ type: "post" }],
    }),
    defineField({
      name: "ctaHref",
      title: "Custom link (optional)",
      type: "url",
      description: "Used when no linked news post is selected.",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      student: "studentName",
      yearGroup: "yearGroup",
      date: "publishedAt",
      media: "photo",
    },
    prepare({ title, student, yearGroup, date, media }) {
      const subtitleParts = [student, yearGroup, date ? new Date(date).toLocaleDateString("en-GB") : ""].filter(
        Boolean
      );
      return {
        title: title || "Student spotlight",
        subtitle: subtitleParts.join(" • "),
        media,
      };
    },
  },
});
