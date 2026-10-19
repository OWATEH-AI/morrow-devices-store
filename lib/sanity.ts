import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { demoProducts, type DeviceType, type Product } from "./catalog";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01";

const client = projectId && dataset && projectId !== "your-project-id"
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;

const imageBuilder = client ? imageUrlBuilder(client) : null;

type SanityVariant = {
  _key: string;
  sku?: string;
  storage?: string;
  color?: string;
  colorHex?: string;
  pricePaise?: number;
  image?: unknown;
};

type SanityProduct = {
  _id: string;
  name: string;
  slug?: string;
  brand?: string;
  productType?: DeviceType;
  summary?: string;
  description?: string;
  image?: unknown;
  imageAlt?: string;
  specifications?: Record<string, string | undefined>;
  variants?: SanityVariant[];
  featured?: boolean;
  promotionLabel?: string;
};

const productsProjection = `{
  _id,
  name,
  "slug": slug.current,
  "brand": brand->name,
  productType,
  summary,
  description,
  image,
  "imageAlt": image.alt,
  specifications,
  featured,
  promotionLabel,
  variants[]{ _key, sku, storage, color, colorHex, pricePaise, image }
}`;

const productsQuery = `*[_type == "product" && defined(slug.current)] | order(name asc) ${productsProjection}`;

function toImageUrl(source: unknown, width: number) {
  if (!imageBuilder || !source) return undefined;
  try {
    return imageBuilder.image(source as Parameters<typeof imageBuilder.image>[0]).width(width).auto("format").url();
  } catch {
    return undefined;
  }
}

function toProduct(item: SanityProduct): Product | null {
  const slug = item.slug;
  const variants = item.variants?.filter((variant) =>
    Boolean(variant.sku && variant._key && Number.isInteger(variant.pricePaise) && (variant.pricePaise ?? -1) >= 0),
  );
  const image = toImageUrl(item.image, 1200);
  if (!slug || !item.name || !image || !variants?.length) return null;

  return {
    slug,
    name: item.name,
    brand: item.brand || "Independent",
    type: item.productType || "phone",
    summary: item.summary || "",
    description: item.description || "",
    image,
    imageAlt: item.imageAlt || item.name,
    specs: Object.values(item.specifications || {}).filter((value): value is string => Boolean(value)),
    featured: Boolean(item.featured),
    badge: item.promotionLabel,
    variants: variants.map((variant) => ({
      id: variant._key,
      sku: variant.sku!,
      storage: variant.storage || "Standard",
      color: variant.color || "Default",
      colorHex: variant.colorHex || "#c7cbc6",
      pricePaise: variant.pricePaise!,
      image: toImageUrl(variant.image, 1000),
    })),
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  if (!client) return demoProducts;
  const result = await client.fetch<SanityProduct[]>(productsQuery);
  return result.map(toProduct).filter((product): product is Product => product !== null);
}

export async function getPublishedProduct(slug: string): Promise<Product | undefined> {
  if (!client) return demoProducts.find((product) => product.slug === slug);
  const result = await client.fetch<SanityProduct | null>(
    `*[_type == "product" && defined(slug.current) && slug.current == $slug][0] ${productsProjection}`,
    { slug },
  );
  return result ? toProduct(result) ?? undefined : undefined;
}

export const sanityIsConfigured = Boolean(client);