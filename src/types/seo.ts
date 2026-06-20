export interface Article {
  id: string
  title: string
  slug: string | null
  excerpt: string | null
  content: string | null
  publishedAt: string | null
  authorId: string | null
  status: string | null
}

export interface Author {
  id: string
  name: string
  slug: string | null
  bio: string | null
}
