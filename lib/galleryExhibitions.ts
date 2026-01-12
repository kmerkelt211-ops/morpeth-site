// lib/galleryExhibitions.ts
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-10-01',
  useCdn: true,
})

export type GalleryExhibition = {
  _id: string
  title: string
  subtitle?: string
  slug?: { current: string }
  locationType?: 'portman' | 'aroundSchool' | 'external' | 'digital'
  exhibitorType?: 'student' | 'staffVisiting' | 'other'
  isCurrent?: boolean
  startDate?: string
  endDate?: string
  bgColor?: string
  heroImages?: {
    _key: string
    asset: { _ref: string }
    alt?: string
  }[]
}

export async function getAllGalleryExhibitions(): Promise<GalleryExhibition[]> {
  return client.fetch(
    `*[_type == "galleryExhibition"] | order(isCurrent desc, startDate desc){
      _id,
      title,
      subtitle,
      slug,
      locationType,
      exhibitorType,
      isCurrent,
      startDate,
      endDate,
      bgColor,
      heroImages[]{
        _key,
        asset,
        alt
      }
    }`
  )
}