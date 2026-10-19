import Link from "next/link";
import { ProductDetails } from "../../../components/storefront";
import { getPublishedProduct, getPublishedProducts } from "../../../lib/sanity";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, catalog] = await Promise.all([getPublishedProduct(slug), getPublishedProducts()]);
  if (!product) {
    return <section className="page-wrap setup-page"><p className="eyebrow">NOT IN THIS DEMO</p><h1>That device is not here.</h1><p>This sample catalogue does not contain a published product with that address.</p><Link className="text-link" href="/shop">Browse all devices <span aria-hidden="true">→</span></Link></section>;
  }
  return <ProductDetails product={product} catalog={catalog} />;
}