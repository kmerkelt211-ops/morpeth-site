import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryExhibition',
  title: 'Gallery Exhibition',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subtitle', type: 'string' }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: r => r.required(),
    }),

    defineField({
      name: 'locationType',
      type: 'string',
      options: {
        list: [
          { title: 'Portman Gallery', value: 'portman' },
          { title: 'Around the school', value: 'aroundSchool' },
          { title: 'External gallery', value: 'external' },
          { title: 'Digital-only', value: 'digital' },
        ],
      },
      validation: r => r.required(),
    }),

    defineField({
      name: 'viewLayout',
      title: 'Layout type',
      type: 'string',
      options: {
        list: [
          { title: 'Digital gallery', value: 'digitalGallery' },
          { title: "What’s on / event", value: 'whatsOn' },
        ],
        layout: 'radio',
      },
      initialValue: 'digitalGallery',
    }),

    // External venue details (only show when locationType === 'external')
    defineField({
      name: 'venueName',
      title: 'Venue name',
      type: 'string',
      hidden: ({ document }) => document?.locationType !== 'external',
    }),
    defineField({
      name: 'venueAddress',
      title: 'Venue address',
      type: 'text',
      rows: 2,
      hidden: ({ document }) => document?.locationType !== 'external',
    }),
    defineField({
      name: 'venueWebsite',
      title: 'Venue website',
      type: 'url',
      hidden: ({ document }) => document?.locationType !== 'external',
    }),
    defineField({
      name: 'venueMapLink',
      title: 'Google Maps link',
      type: 'url',
      hidden: ({ document }) => document?.locationType !== 'external',
    }),

    defineField({
      name: 'exhibitorType',
      title: 'Exhibitor type',
      type: 'string',
      options: {
        list: [
          { title: 'Student work', value: 'student' },
          { title: 'Staff & visiting artists', value: 'staffVisiting' },
          { title: 'Collaborative / other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: r => r.required(),
    }),

    defineField({ name: 'isCurrent', type: 'boolean', initialValue: false }),
    defineField({ name: 'startDate', type: 'date' }),
    defineField({ name: 'endDate', type: 'date' }),

    defineField({
      name: 'bgColor',
      title: 'Bg Color',
      type: 'string',
      description: 'Background band colour for the exhibition header.',
      options: {
        layout: 'dropdown',
        list: [
          { title: 'Aqua (Morpeth)', value: '#9EDFE6' },
          { title: 'Lavender', value: '#B5B9FF' },
          { title: 'Soft Pink', value: '#F3D7E6' },
          { title: 'Warm Sand', value: '#FFF1D6' },
          { title: 'Peach', value: '#FFD7B3' },
          { title: 'Tangerine', value: '#FFC16B' },
          { title: 'Mint', value: '#E6F5ED' },
          { title: 'Pale Blue', value: '#E7F0FF' },
          { title: 'Lilac Grey', value: '#ECE6FF' },
          { title: 'Off White', value: '#F5F5F5' },
          { title: 'Light Grey', value: '#EEEEEE' },
          { title: 'White', value: '#FFFFFF' },
        ],
      },
    }),

    // Keep hero images small (for cards/headers)
    defineField({
      name: 'heroImages',
      title: 'Hero images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: r => r.max(2),
    }),

    // NEW: the actual gallery (lots of images, grid upload)
    defineField({
      name: 'galleryImages',
      title: 'Gallery images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
      options: { layout: 'grid' },
    }),

    // NEW: optional PDF guide / worksheet
    defineField({
      name: 'guidePdf',
      title: 'PDF guide',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),

    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),

    defineField({ name: 'orderRank', type: 'number' }),
  ],

  orderings: [
    {
      title: 'Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
})