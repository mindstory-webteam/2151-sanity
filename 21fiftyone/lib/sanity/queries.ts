import { groq } from 'next-sanity'
import { client } from './client'
import type { Post } from './types'

export type { Post }

// All posts, newest first, for the blog listing page
const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage,
    author->{ name, image },
    categories[]->{ title }
  }
`

// Single post by slug, for the detail page
const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage,
    body,
    author->{ name, image, bio },
    categories[]->{ title },
    seo
  }
`

// Just the slugs, for generateStaticParams
const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(POSTS_QUERY, {}, { next: { revalidate: 60 } })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(POST_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } })
}

export async function getAllPostSlugs(): Promise<string[]> {
  return client.fetch(POST_SLUGS_QUERY, {}, { next: { revalidate: 60 } })
}