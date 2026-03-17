import { loadTeachingLearningPageContent } from "../../lib/contentLoaders";
import TeachingLearningPageClient from "./TeachingLearningPageClient";

export default async function TeachingLearningPage() {
  const initialContent = await loadTeachingLearningPageContent();

  return <TeachingLearningPageClient initialContent={initialContent} />;
}
