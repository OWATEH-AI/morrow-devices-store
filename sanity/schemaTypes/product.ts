import { defineArrayMember, defineField, defineType } from "sanity";

const specs = [
  "display",
  "processor",
  "camera",
  "battery",
  "operatingSystem",
  "network",
  "memory",
  "modelNumber",
];

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Product name", type: "string", validation: (rule) => rule.required().max(120) }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }], validation: (rule) => rule.required() }),
    defineField({ name: "productType", title: "Device type", type: "string", options: { list: ["phone", "tablet", "laptop", "accessory"] }, validation: (rule) => rule.required() }),
    defineField({ name: "categories", title: "Collections", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })] }),
    defineField({ name: "summary", title: "Short description", type: "text", rows: 2, validation: (rule) => rule.max(220) }),
    defineField({ name: "description", title: "Full description", type: "text", rows: 5 }),
    defineField({ name: "image", title: "Main image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })], validation: (rule) => rule.required() }),
    defineField({ name: "gallery", title: "Image gallery", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })] })] }),
    defineField({ name: "variants", title: "Configurations", type: "array", validation: (rule) => rule.min(1), of: [defineArrayMember({
      name: "productVariant",
      title: "Variant",
      type: "object",
      fields: [
        defineField({ name: "sku", title: "SKU", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "storage", title: "Storage / configuration", type: "string" }),
        defineField({ name: "color", title: "Colour", type: "string" }),
        defineField({ name: "colorHex", title: "Colour swatch", type: "string", description: "Optional hex colour, for example #2F3433." }),
        defineField({ name: "pricePaise", title: "Price in paise", type: "number", description: "Integer minor units; ₹1,000 is 100000 paise.", validation: (rule) => rule.required().integer().min(0) }),
        defineField({ name: "image", title: "Variant image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })] }),
      ],
    })] }),
    defineField({ name: "specifications", title: "Specifications", type: "object", fields: specs.map((name) => defineField({ name, type: "string" })) }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "bestseller", title: "Bestseller", type: "boolean", initialValue: false }),
    defineField({ name: "newArrival", title: "New arrival", type: "boolean", initialValue: false }),
    defineField({ name: "promotionLabel", title: "Promotion label", type: "string", description: "Use only for a verified promotion." }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "name", subtitle: "brand.name", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});