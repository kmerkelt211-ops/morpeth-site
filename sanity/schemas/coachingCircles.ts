// sanity/schemas/coachingCircles.ts
import {defineType, defineField} from 'sanity';

export default defineType({
  name: 'coachingCircles',
  title: 'Coaching Circles (single)',
  type: 'document',
  fields: [
    defineField({ name:'introTitle', type:'string' }),
    defineField({ name:'introBody', type:'array', of:[{type:'block'}] }),
    defineField({ name:'parentGuide', title:'Parent guide (PDF)', type:'file' }),
    defineField({ name:'faq', type:'array', of:[{
      type:'object',
      fields:[
        { name:'question', type:'string' },
        { name:'answer', type:'array', of:[{type:'block'}] }
      ],
      preview:{ select:{ title:'question' } }
    }]}),
    defineField({ name:'images', type:'array', of:[{type:'image', options:{hotspot:true}}] }),
  ],
});