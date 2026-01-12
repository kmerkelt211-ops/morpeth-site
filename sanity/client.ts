import { createClient, type QueryParams } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8492tcbd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-01',
  useCdn: true,
  perspective: 'published',
})

export const sanityFetch = async <T>(q: string, params?: QueryParams) =>
  params ? client.fetch<T>(q, params) : client.fetch<T>(q)