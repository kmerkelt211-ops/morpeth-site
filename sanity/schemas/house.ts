import {defineField, defineType} from 'sanity'

const BRAND_COLOURS = [
  {title: 'Chapman (red)', value: 'chapman'},
  {title: 'Jalal (blue)', value: 'jalal'},
  {title: 'Tull (gold)', value: 'tull'},
  {title: 'Pankhurst (purple)', value: 'pankhurst'},
  {title: 'Mendoza (green)', value: 'mendoza'},
]

export default defineType({
  name: 'house',
  title: 'House page',
  type: 'document',
  groups: [
    {name: 'setup', title: '1. Setup', default: true},
    {name: 'content', title: '2. Page content'},
    {name: 'media', title: '3. Media'},
    {name: 'activity', title: '4. Points, events and links'},
    {name: 'resources', title: '5. Notices and downloads'},
    {name: 'admin', title: '6. Admin'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'House name',
      type: 'string',
      description: 'Name shown on house cards and the house page heading.',
      group: 'setup',
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: 'slug',
      title: 'Page URL slug',
      type: 'slug',
      options: {source: 'title'},
      description: 'Used in the house page URL, e.g. /our-school/houses/chapman.',
      group: 'setup',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'houseLeads',
      title: 'House leads',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'staffMember'}]}],
      description: 'Select staff responsible for this house page.',
      group: 'setup',
      validation: (rule) => rule.min(1).warning('Add at least one house lead.'),
    }),
    defineField({
      name: 'brandColor',
      title: 'House colour theme',
      type: 'string',
      options: {list: BRAND_COLOURS},
      description: 'Controls accent colours in the house cards and house page.',
      group: 'setup',
    }),

    defineField({
      name: 'summary',
      title: 'Card summary',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on the House System overview cards.',
      group: 'content',
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: 'about',
      title: 'About this house',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Main house page introduction and story content.',
      group: 'content',
    }),

    defineField({
      name: 'crest',
      title: 'House crest',
      type: 'image',
      options: {hotspot: true},
      description: 'Round crest icon used across house cards and page headers.',
      group: 'media',
    }),
    defineField({
      name: 'heroImage',
      title: 'House hero image',
      type: 'image',
      options: {hotspot: true},
      description: 'Large image shown at the top of the house page.',
      group: 'media',
    }),
    defineField({
      name: 'videoUrl',
      title: 'House video URL',
      type: 'url',
      description: 'YouTube/Vimeo/embed URL. If file upload is also provided, file is preferred.',
      group: 'media',
    }),
    defineField({
      name: 'videoFile',
      title: 'House video (upload)',
      type: 'file',
      options: {accept: 'video/*', storeOriginalFilename: true},
      description: 'Optional direct video upload.',
      group: 'media',
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video poster image',
      type: 'image',
      options: {hotspot: true},
      description: 'Thumbnail used before video playback.',
      group: 'media',
    }),

    defineField({
      name: 'currentPoints',
      title: 'Current points total',
      type: 'number',
      description: 'Numeric score shown in standings and house cards.',
      group: 'activity',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'pointsUpdatedAt',
      title: 'Points last updated',
      type: 'datetime',
      description: 'Shows when the score was last reviewed.',
      group: 'activity',
    }),
    defineField({
      name: 'latestPoints',
      title: 'Points fallback label',
      type: 'string',
      initialValue: 'Updated weekly',
      description: 'Used only if no numeric points total is set.',
      group: 'activity',
    }),
    defineField({
      name: 'events',
      title: 'Upcoming events',
      type: 'array',
      group: 'activity',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Event title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'date',
              title: 'Date and time',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'location', type: 'string'}),
            defineField({name: 'summary', type: 'text', rows: 3}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'date'},
          },
        },
      ],
    }),
    defineField({
      name: 'links',
      title: 'Useful links',
      type: 'array',
      description: 'External/internal links shown in the house page sidebar.',
      group: 'activity',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        },
      ],
    }),

    defineField({
      name: 'notices',
      title: 'House notices',
      type: 'array',
      description: 'Important notices shown on the house page.',
      group: 'resources',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Notice body',
              type: 'array',
              of: [{type: 'block'}],
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        },
      ],
    }),
    defineField({
      name: 'downloadItems',
      title: 'Downloads',
      type: 'array',
      description: 'Preferred format: label + file upload.',
      group: 'resources',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Button label',
              type: 'string',
            }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
              options: {storeOriginalFilename: true},
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'file.asset.originalFilename'},
            prepare(selection) {
              return {
                title: selection.title || 'Download',
                subtitle: selection.subtitle || 'File attached',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'downloads',
      title: 'Legacy downloads (optional)',
      type: 'array',
      description: 'Older file list format kept for backwards compatibility.',
      group: 'resources',
      of: [{type: 'file', options: {storeOriginalFilename: true}}],
    }),
    defineField({
      name: 'resources',
      title: 'Extra resources (optional)',
      type: 'array',
      description: 'Optional extra files or links.',
      group: 'resources',
      of: [
        {type: 'file', options: {storeOriginalFilename: true}},
        {
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'url', type: 'url'}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        },
      ],
    }),

    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first on the overview page.',
      group: 'admin',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      summary: 'summary',
      media: 'crest',
      points: 'currentPoints',
    },
    prepare(selection) {
      const pointsText = typeof selection.points === 'number' ? `${selection.points} pts` : 'No points yet'
      return {
        title: selection.title || 'Untitled house',
        subtitle: `${pointsText}${selection.summary ? ` - ${selection.summary}` : ''}`,
        media: selection.media,
      }
    },
  },
})
