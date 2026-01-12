import { defineField, defineType } from "sanity";

export default defineType({
  name: "jobPost",
  title: "Job Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", slugify: (v: string) => v.toLowerCase().replace(/\s+/g, "-").slice(0, 96) },
      validation: (r) => r.required(),
    }),
    defineField({ name: "department", title: "Department", type: "string" }),
    defineField({
      name: "jobType",
      title: "Job Type",
      type: "string",
      options: { list: ["Permanent", "Fixed-term", "Part-time", "Full-time", "Term-time only"] },
    }),
    defineField({ name: "contractType", title: "Contract Type", type: "string" }),
    defineField({ name: "salary", title: "Salary", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "closingDate", title: "Closing Date", type: "datetime" }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({
      name: "howToApply",
      title: "How to apply",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "department" },
  },
});