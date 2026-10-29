import {defineArrayMember, defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({name: 'excerpt', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'author', type: 'reference', to: [{type: 'author'}], group: 'content'}),
    defineField({
      name: 'mainImage',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
    }),
    defineField({name: 'publishedAt', type: 'datetime', group: 'content'}),
    defineField({
      name: 'body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      description: 'Leave blank to use the post title and excerpt',
      fields: [
        defineField({name: 'metaTitle', type: 'string'}),
        defineField({name: 'metaDescription', type: 'text', rows: 3}),
        defineField({name: 'canonicalUrl', type: 'url'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', author: 'author.name', media: 'mainImage'},
    prepare: ({title, author, media}) => ({title, subtitle: author && `by ${author}`, media}),
  },
})