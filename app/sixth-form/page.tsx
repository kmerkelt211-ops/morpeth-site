import { loadSixthFormMedia } from "../../lib/siteMediaLoaders"
import SixthFormPageClient from "./SixthFormPageClient"

export default async function SixthFormPage() {
  const initialMedia = await loadSixthFormMedia()

  return <SixthFormPageClient initialMedia={initialMedia} />
}
