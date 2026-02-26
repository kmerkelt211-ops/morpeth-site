import { defineField, defineType } from "sanity";

export default defineType({
  name: "teachingLearningPage",
  title: "Teaching & Learning page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "overview", title: "On This Page" },
    { name: "ks3", title: "KS3 Section" },
    { name: "subjects", title: "Subjects" },
    { name: "support", title: "Support Cards" },
    { name: "modal", title: "Modal Text" },
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
      ],
    }),
    defineField({
      name: "onPage",
      title: "On this page section",
      type: "object",
      group: "overview",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({
          name: "links",
          title: "Quick links",
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
      name: "ks3",
      title: "KS3 section",
      type: "object",
      group: "ks3",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({
          name: "subjects",
          title: "KS3 subjects (pill list)",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "features",
          title: "KS3 feature cards",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "id", title: "Card id", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: [
                      { title: "Book", value: "book" },
                      { title: "Users", value: "users" },
                      { title: "Language", value: "language" },
                      { title: "Stars", value: "stars" },
                    ],
                  },
                  initialValue: "book",
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "id" },
              },
            },
          ],
        }),
        defineField({
          name: "details",
          title: "KS3 detail accordion items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({
                  name: "paragraphs",
                  title: "Paragraphs",
                  type: "array",
                  of: [{ type: "text" }],
                }),
              ],
              preview: {
                select: { title: "title" },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "subjects",
      title: "Subject cards section",
      type: "object",
      group: "subjects",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
        defineField({ name: "searchPlaceholder", title: "Search placeholder", type: "string" }),
        defineField({
          name: "emptyText",
          title: "No results text",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Subject cards",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "id", title: "Unique id", type: "string" }),
                defineField({ name: "name", title: "Subject name", type: "string" }),
                defineField({ name: "phase", title: "Phase label", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 5 }),
                defineField({
                  name: "image",
                  title: "Card image (upload)",
                  type: "image",
                  options: { hotspot: true },
                }),
                defineField({
                  name: "imageUrl",
                  title: "Card image URL (optional)",
                  type: "url",
                }),
                defineField({
                  name: "videoFile",
                  title: "Subject video (upload)",
                  type: "file",
                  options: { accept: "video/*", storeOriginalFilename: true },
                }),
                defineField({
                  name: "videoUrl",
                  title: "Subject video URL",
                  type: "url",
                }),
                defineField({
                  name: "videoPoster",
                  title: "Video poster (optional)",
                  type: "image",
                  options: { hotspot: true },
                }),
              ],
              preview: {
                select: {
                  title: "name",
                  subtitle: "phase",
                  media: "image",
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "support",
      title: "Support cards section",
      type: "object",
      group: "support",
      fields: [
        defineField({
          name: "cards",
          title: "Support cards",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "id", title: "Card id", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 4 }),
                defineField({
                  name: "details",
                  title: "Expanded paragraphs",
                  type: "array",
                  of: [{ type: "text" }],
                }),
                defineField({ name: "note", title: "Footer note", type: "text", rows: 3 }),
                defineField({
                  name: "image",
                  title: "Card image (upload)",
                  type: "image",
                  options: { hotspot: true },
                }),
                defineField({
                  name: "imageUrl",
                  title: "Card image URL (optional)",
                  type: "url",
                }),
                defineField({
                  name: "imageAlt",
                  title: "Image alt text",
                  type: "string",
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "id", media: "image" },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "modal",
      title: "Modal text",
      type: "object",
      group: "modal",
      fields: [
        defineField({ name: "comingSoonText", title: "No video text", type: "string" }),
        defineField({
          name: "fallbackDescription",
          title: "Fallback description",
          type: "text",
          rows: 4,
        }),
        defineField({ name: "footerText", title: "Footer text", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Teaching & Learning page",
        subtitle: "Website page settings",
      };
    },
  },
});
