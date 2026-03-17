import { defineField, defineType } from "sanity";

export default defineType({
  name: "admissionsEnquiry",
  title: "Admissions enquiry",
  type: "document",
  groups: [
    { name: "enquiry", title: "Enquiry details" },
    { name: "workflow", title: "Workflow" },
  ],
  fields: [
    defineField({
      name: "fullName",
      title: "Full name",
      type: "string",
      group: "enquiry",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "enquiry",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "enquiry",
    }),
    defineField({
      name: "childYearGroup",
      title: "Child year group",
      type: "string",
      group: "enquiry",
      options: {
        list: [
          { title: "Year 5", value: "year5" },
          { title: "Year 6", value: "year6" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "admissionYear",
      title: "Admission year",
      type: "number",
      group: "enquiry",
    }),
    defineField({
      name: "enquiryType",
      title: "Enquiry type",
      type: "string",
      group: "enquiry",
      options: {
        list: [
          { title: "Book a visit", value: "book_visit" },
          { title: "General admissions question", value: "general" },
          { title: "Request callback", value: "callback" },
        ],
      },
      initialValue: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 6,
      group: "enquiry",
      validation: (rule) => rule.required().min(15),
    }),
    defineField({
      name: "sourcePage",
      title: "Source page",
      type: "string",
      group: "enquiry",
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      group: "enquiry",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "workflow",
      options: {
        layout: "radio",
        list: [
          { title: "New", value: "new" },
          { title: "In review", value: "in_review" },
          { title: "Responded", value: "responded" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "handledBy",
      title: "Handled by",
      type: "string",
      group: "workflow",
    }),
    defineField({
      name: "handledAt",
      title: "Handled at",
      type: "datetime",
      group: "workflow",
    }),
    defineField({
      name: "staffNotes",
      title: "Staff notes",
      type: "text",
      rows: 5,
      group: "workflow",
    }),
    defineField({
      name: "audienceSegment",
      title: "Audience segment",
      type: "string",
      group: "workflow",
      readOnly: true,
    }),
    defineField({
      name: "heroVariant",
      title: "Hero variant",
      type: "string",
      group: "workflow",
      readOnly: true,
    }),
    defineField({
      name: "requestFingerprint",
      title: "Request fingerprint",
      type: "string",
      group: "workflow",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "email",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ title, subtitle, status, submittedAt }) {
      const statusLabel =
        status === "in_review"
          ? "In review"
          : status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "New";
      const dateLabel = submittedAt
        ? new Date(submittedAt).toLocaleDateString("en-GB")
        : "";
      const datePart = dateLabel ? ` • ${dateLabel}` : "";
      return {
        title: title || "Admissions enquiry",
        subtitle: `${statusLabel}${datePart}${subtitle ? ` • ${subtitle}` : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Oldest first",
      name: "submittedAsc",
      by: [{ field: "submittedAt", direction: "asc" }],
    },
  ],
});
