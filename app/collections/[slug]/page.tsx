import { CatalogPage } from "../../../components/storefront";
import { collectionType } from "../../../lib/catalog";
import { getPublishedProducts } from "../../../lib/sanity";
import { notFound } from "next/navigation";

const collectionCopy: Record<string, { title: string; intro: string }> = {
  phones: { title: "Phones, considered.", intro: "Explore the smartphone edit, with sample configurations and retailer-managed options." },
  tablets: { title: "Make space for more.", intro: "Tablets for note-taking, making, reading, and everything between." },
  laptops: { title: "A better kind of workspace.", intro: "Portable computers for focused work, creative projects, and everyday life." },
  accessories: { title: "The useful extras.", intro: "Accessories sit alongside devices in the same flexible catalogue." },
};

export default async function CollectionPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ q?: string }> }) {
  const { slug } = await params;
  const { q = "" } = await searchParams;
  const type = collectionType(slug);
  const copy = collectionCopy[slug];
  if (!copy) notFound();
  const catalog = await getPublishedProducts();
  return <CatalogPage initialType={type} initialQuery={q} heading={copy.title} intro={copy.intro} catalog={catalog} />;
}