import { loadRecruitmentMedia } from "../../lib/siteMediaLoaders"
import OurSchoolPageContent from "../components/our-school/OurSchoolPageContent"

export default async function OurSchoolPage() {
  const initialRecruitmentMedia = await loadRecruitmentMedia()

  return <OurSchoolPageContent initialRecruitmentMedia={initialRecruitmentMedia} />
}
