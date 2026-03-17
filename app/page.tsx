import HomePageClient from "./HomePageClient";
import { loadHomePageData } from "../lib/homePageData";

export default async function Home() {
  const initialData = await loadHomePageData();

  return <HomePageClient initialData={initialData} />;
}
