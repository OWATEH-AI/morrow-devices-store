import { CatalogPage } from "../../components/storefront";
import { getPublishedProducts } from "../../lib/sanity";

export default async function ShopPage() {
  const catalog = await getPublishedProducts();
  return <CatalogPage catalog={catalog} />;
}