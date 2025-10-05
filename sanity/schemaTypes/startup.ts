import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),

    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1)
          .max(20)
          .error("Category must be between 1 and 20 characters"),
    }),
    defineField({
      name: "image",
      type: "string",
      title: "Image URL",
      description: "URL of the startup image",
    }),
    defineField({
      name: "imageAsset",
      type: "image",
      title: "Image Asset",
      description: "Uploaded image asset",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "pitch",
      type: "markdown",
    }),
    defineField({
      name: "upvotes",
      type: "number",
      title: "Upvotes Count",
      initialValue: 0,
    }),
    defineField({
      name: "upvotedBy",
      type: "array",
      title: "Upvoted By Users",
      of: [
        {
          type: "reference",
          to: [{ type: "author" }],
        },
      ],
    }),
  ],
});
