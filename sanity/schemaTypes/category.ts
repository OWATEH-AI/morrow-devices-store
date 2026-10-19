import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Collection",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Collection name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "deviceType", title: "Device type", type: "string", options: { list: ["phone", "tablet", "laptop", "accessory"] } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Collection image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })] }),
    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", initialValue: false }),
  ],
});