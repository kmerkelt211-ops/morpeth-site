// sanity/schemas/letter.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "letter",
  title: "Letter",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "summary", type: "text" }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: r => r.required(),
    }),
    defineField({
      name: "audience",
      type: "string",
      options: { list: ["All parents", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Sixth Form"] },
    }),
    defineField({
      name: "yearGroups",
      title: "Year groups (tags)",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "file",
      title: "PDF",
      type: "file",
      options: { storeOriginalFilename: true, accept: "application/pdf" },
    }),
    // optional manual URL fallback
    defineField({ name: "fileUrl", title: "External file URL", type: "url" }),
  ],
  orderings: [
    { title: "Publish date, newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", publishedAt: "publishedAt", audience: "audience" },
    prepare: ({ title, publishedAt, audience }) => ({
      title,
      subtitle: [publishedAt ? new Date(publishedAt).toLocaleDateString("en-GB") : "", audience].filter(Boolean).join(" • "),
    }),
  },
});