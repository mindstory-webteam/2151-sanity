export interface PostImage {
  asset?: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: unknown
  crop?: unknown
  alt?: string
  [key: string]: unknown
}

export interface PostSeo {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
}

export interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  mainImage?: PostImage
  author?: {
    name: string
    image?: PostImage
    bio?: string
  }
  categories?: { title: string }[]
  body?: any
  seo?: PostSeo
}