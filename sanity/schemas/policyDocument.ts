import { defineField, defineType } from "sanity";

const CATEGORY_OPTIONS = [
  { title: "Safeguarding", value: "safeguarding" },
  { title: "Attendance", value: "attendance" },
  { title: "Behaviour", value: "behaviour" },
  { title: "Curriculum", value: "curriculum" },
  { title: "Data Protection", value: "data" },
  { title: "Governance", value: "governance" },
  { title: "Admissions", value: "admissions" },
  { title: "SEN / Inclusion", value: "sen" },
  { title: "Other", value: "other" },
];

export default defineType({
  name: "policyDocument",
  title: "Policy document",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORY_OPTIONS },
      initialValue: "other",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "file",
      title: "Policy file (PDF)",
      type: "file",
      options: { accept: "application/pdf", storeOriginalFilename: true },
    }),
    defineField({
      name: "externalUrl",
      title: "External URL (optional)",
      type: "url",
      description: "Use this if the policy is hosted outside Sanity.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Feature on policy page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Published (newest first)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "file",
    },
    prepare({ title, subtitle, media }) {
      const categoryLabel =
        CATEGORY_OPTIONS.find((item) => item.value === subtitle)?.title ?? "Uncategorised";

      return {
        title: title || "Untitled policy",
        subtitle: categoryLabel,
        media,
      };
    },
  },
});
