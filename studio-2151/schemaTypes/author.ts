import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bio', type: 'array', of: [{type: 'block'}]}),
  ],
  preview: {select: {title: 'name', media: 'image'}},
})