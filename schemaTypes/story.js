import {defineField, defineType} from 'sanity'

export const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'illustration',
      title: 'Illustration',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'audio',
      title: 'Audio File',
      type: 'file',
      options: {accept: 'audio/*'},
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Consumer Products', value: 'Consumer Products'},
          {title: 'Developer Tools', value: 'Developer Tools'},
          {title: 'Design', value: 'Design'},
          {title: 'B2B', value: 'B2B'},
          {title: 'Fintech', value: 'Fintech'},
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
          },
        },
        {type: 'image', options: {hotspot: true}},
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'company', media: 'illustration'},
  },
})
