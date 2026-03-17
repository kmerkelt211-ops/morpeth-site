import { loadExtracurricularPageContent } from "../../lib/contentLoaders";
import ExtracurricularPageClient from "./ExtracurricularPageClient";
import type { PartialExtracurricularContent } from "./ExtracurricularPageClient";

export default async function ExtracurricularPage() {
  const initialContent = await loadExtracurricularPageContent();

  return (
    <ExtracurricularPageClient
      initialContent={initialContent as PartialExtracurricularContent}
    />
  );
}
