
export interface Post {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  mainImage?: any
  author?: {
    name: string
    image?: any
    bio?: string
  }
  categories?: { title: string }[]
  body?: any
}