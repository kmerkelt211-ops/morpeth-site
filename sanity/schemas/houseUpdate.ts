import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'houseUpdate',
  title: 'House update',
  type: 'document',
  groups: [
    {name: 'setup', title: '1. Setup', default: true},
    {name: 'content', title: '2. Content'},
    {name: 'admin', title: '3. Admin'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Update title',
      type: 'string',
      group: 'setup',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: {source: 'title'},
      group: 'setup',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{type: 'house'}],
      description: 'Pick the house this update belongs to.',
      group: 'setup',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'setup',
    }),
    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      description: 'Optional teaser shown on house pages.',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Update content',
      type: 'array',
      of: [{type: 'block'}, {type: 'image'}],
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured update',
      type: 'boolean',
      group: 'admin',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      houseTitle: 'house.title',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Untitled update',
        subtitle: `${selection.houseTitle || 'No house selected'}${selection.publishedAt ? ` - ${selection.publishedAt}` : ''}`,
      }
    },
  },
})
