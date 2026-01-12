import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'houseUpdate',
  title: 'House update / news',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'house', type: 'reference', to: [{ type: 'house' }], validation: r => r.required() }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'featured', type: 'boolean' }),
  ],
  preview: { select: { title: 'title', subtitle: 'house.title' } },
});