import { defineField, defineType } from "sanity";

export const storeSettings = defineType({
  name: "storeSettings",
  title: "Store settings",
  type: "document",
  fields: [
    defineField({ name: "storeName", title: "Store name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "accentColor", title: "Accent colour", type: "string" }),
    defineField({ name: "email", title: "Store email", type: "string" }),
    defineField({ name: "phone", title: "Store phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string" }),
    defineField({ name: "address", title: "Physical address", type: "text", rows: 3 }),
    defineField({ name: "shippingPolicy", title: "Shipping and delivery", type: "text", rows: 5 }),
    defineField({ name: "returnsPolicy", title: "Returns and refunds", type: "text", rows: 5 }),
    defineField({ name: "warranty", title: "Warranty information", type: "text", rows: 4 }),
  ],
});