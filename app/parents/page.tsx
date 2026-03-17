import { loadParentsPageContent } from "../../lib/contentLoaders";
import ParentsPageClient from "./ParentsPageClient";

export default async function ParentsPage() {
  const initialContent = await loadParentsPageContent();

  return <ParentsPageClient initialContent={initialContent} />;
}
