import { defineField, defineType } from "sanity";

export default defineType({
  name: "parentsPage",
  title: "Parents page",
  type: "document",
  groups: [{ name: "attendance", title: "Attendance & Absence" }],
  fields: [
    defineField({
      name: "attendanceCard",
      title: "Attendance card (Parents page)",
      type: "object",
      group: "attendance",
      description: "This card appears on the Parents page before the popup opens.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "phoneLabel", title: "Phone label", type: "string" }),
        defineField({ name: "phoneDisplay", title: "Phone number (display)", type: "string" }),
        defineField({ name: "phoneHref", title: "Phone link (tel:...)", type: "string" }),
        defineField({ name: "emailLabel", title: "Email label", type: "string" }),
        defineField({ name: "emailAddress", title: "Email address", type: "string" }),
        defineField({ name: "buttonLabel", title: "Button label (opens popup)", type: "string" }),
        defineField({
          name: "buttonHelper",
          title: "Button helper text",
          type: "string",
          description: "Short line under the button to explain that it opens a popup window.",
        }),
      ],
    }),
    defineField({
      name: "attendanceModal",
      title: "Attendance & absence popup content",
      type: "object",
      group: "attendance",
      description: "These fields control the Attendance & Absence popup window on the Parents page.",
      fields: [
        defineField({ name: "heading", title: "Popup heading", type: "string" }),
        defineField({ name: "whyTitle", title: "Why it matters title", type: "string" }),
        defineField({
          name: "whyParagraphs",
          title: "Why it matters paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "scaleTitle", title: "How we judge attendance title", type: "string" }),
        defineField({
          name: "scaleIntroParagraphs",
          title: "Scale intro paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({
          name: "scaleRows",
          title: "Attendance scale rows",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "judgement", title: "Judgement", type: "string" }),
                defineField({ name: "attendance", title: "Attendance", type: "string" }),
                defineField({ name: "daysAbsent", title: "Days absent text", type: "string" }),
                defineField({
                  name: "tone",
                  title: "Row tone",
                  type: "string",
                  options: {
                    list: [
                      { title: "Bright green", value: "brightGreen" },
                      { title: "Green", value: "green" },
                      { title: "Amber", value: "amber" },
                      { title: "Red", value: "red" },
                    ],
                  },
                  initialValue: "brightGreen",
                }),
                defineField({
                  name: "summaryText",
                  title: "Summary bullet text (optional)",
                  type: "string",
                }),
              ],
              preview: {
                select: { title: "judgement", subtitle: "attendance" },
              },
            },
          ],
        }),
        defineField({ name: "summaryTitle", title: "Summary title", type: "string" }),
        defineField({ name: "reportingTitle", title: "Reporting section title", type: "string" }),
        defineField({
          name: "reportingParagraphs",
          title: "Reporting paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "reportingPhoneLabel", title: "Reporting phone label", type: "string" }),
        defineField({ name: "reportingPhoneDisplay", title: "Reporting phone number", type: "string" }),
        defineField({ name: "reportingPhoneHref", title: "Reporting phone link", type: "string" }),
        defineField({ name: "reportingEmailLabel", title: "Reporting email label", type: "string" }),
        defineField({ name: "reportingEmailAddress", title: "Reporting email address", type: "string" }),
        defineField({ name: "punctualityTitle", title: "Punctuality title", type: "string" }),
        defineField({
          name: "punctualityParagraphs",
          title: "Punctuality paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "concernTitle", title: "Concern section title", type: "string" }),
        defineField({
          name: "concernParagraphs",
          title: "Concern paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "termTimeTitle", title: "Term-time section title", type: "string" }),
        defineField({
          name: "termTimeParagraphs",
          title: "Term-time paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "policyTitle", title: "Policy section title", type: "string" }),
        defineField({
          name: "policyParagraphs",
          title: "Policy paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({ name: "policyButtonLabel", title: "Policy button label", type: "string" }),
        defineField({ name: "policyButtonHref", title: "Policy button URL", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Parents page",
        subtitle: "Attendance & absence settings",
      };
    },
  },
});
