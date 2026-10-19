import { HomePage } from "../components/storefront";
import { getPublishedProducts } from "../lib/sanity";

export default async function Home() {
  const catalog = await getPublishedProducts();
  return <HomePage catalog={catalog} />;
}