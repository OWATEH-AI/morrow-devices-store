import { CatalogPage } from "../../components/storefront";
import { getPublishedProducts } from "../../lib/sanity";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const catalog = await getPublishedProducts();
  return <CatalogPage catalog={catalog} initialQuery={q} heading={q ? `Results for “${q}”` : "Search the collection"} intro="Search product names, brands, and SKUs." />;
}