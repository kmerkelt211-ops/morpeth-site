// pages/api/instagram.ts
import type { NextApiRequest, NextApiResponse } from "next"

type InstaPost = {
  title: string
  href: string
  date: string
  excerpt?: string
  imageUrl?: string
  imageAlt?: string
}

// Helper: fetch from Instagram Graph API (pseudo-code – fill in with real call)
async function fetchInstagramPosts(): Promise<InstaPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!accessToken || !userId) {
    console.warn("Instagram env vars missing")
    return []
  }

  // Example using Instagram Basic Display / Graph API
  // Adjust URL + fields to suit your setup.
  const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink,timestamp&access_token=${accessToken}`

  const res = await fetch(url)
  if (!res.ok) {
    console.error("Instagram API error", await res.text())
    return []
  }

  const data = await res.json() as {
    data?: {
      id: string
      caption?: string
      media_url?: string
      permalink: string
      timestamp: string
    }[]
  }

  if (!data.data) return []

  return data.data.slice(0, 3).map((item) => ({
    title: item.caption?.split("\n")[0]?.slice(0, 80) || "Instagram post",
    href: item.permalink,
    date: item.timestamp,
    excerpt: item.caption,
    imageUrl: item.media_url,
    imageAlt: item.caption || "Instagram post",
  }))
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const posts = await fetchInstagramPosts()
    // If nothing, respond with 204 so the frontend knows to fall back.
    if (!posts.length) {
      return res.status(204).end()
    }
    res.status(200).json(posts)
  } catch (err) {
    console.error("Instagram handler error", err)
    res.status(500).json({ error: "Instagram unavailable" })
  }
}