// sanity/schemas/house.ts
import {defineType, defineField} from 'sanity';

export default defineType({
  name: 'house',
  title: 'House',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'houseLeads',
      title: 'House Leads',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'staffMember' }] },
      ],
      validation: r => r.min(1).warning('Add at least one house lead'),
    }),
    defineField({ name: 'summary', type: 'text' }),
    defineField({ name: 'about', title: 'About', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'crest', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'brandColor',
      title: 'Brand colour',
      type: 'string',
      options: { list: [
        {title:'Mendoza (green)', value:'mendoza'},
        {title:'Chapman (red)', value:'chapman'},
        {title:'Pankhurst (purple)', value:'pankhurst'},
        {title:'Tull (gold)', value:'tull'},
        {title:'Jalal (blue)', value:'jalal'},
      ]},
    }),
    defineField({ name: 'videoUrl', title: 'House video URL', type: 'url' }),
    defineField({
      name: 'videoFile',
      title: 'House video (upload)',
      type: 'file',
      options: { accept: 'video/*', storeOriginalFilename: true },
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video poster (thumbnail)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        { type: 'file', options: { storeOriginalFilename: true } },
        { type: 'object', fields: [
          { name:'label', type:'string' },
          { name:'url', type:'url' },
        ], preview: { select: { title: 'label' }}}
      ],
    }),
    defineField({
      name: 'latestPoints',
      title: 'Latest points',
      type: 'string',
      initialValue: 'Updated weekly',
    }),
    defineField({
      name: 'notices',
      title: 'Notices',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', validation: r => r.required() },
            { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'downloads',
      title: 'Downloads',
      type: 'array',
      of: [{ type: 'file', options: { storeOriginalFilename: true } }],
    }),
    defineField({
      name: 'events',
      title: 'Upcoming events',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', validation: r => r.required() },
            { name: 'date', title: 'Date & time', type: 'datetime', validation: r => r.required() },
            { name: 'location', type: 'string' },
            { name: 'summary', type: 'text' },
          ],
          preview: { select: { title: 'title', subtitle: 'date' } },
        },
      ],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', validation: r => r.required() },
            { name: 'url', type: 'url', validation: r => r.required() },
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
    }),
    defineField({ name: 'order', type: 'number' }),
  ],
});