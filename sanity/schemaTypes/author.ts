import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "id",
      type: "string",
    }),
    defineField({
      name: "name",
      type: "string",
    }),

    defineField({
      name: "username",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      title: "Image",
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
