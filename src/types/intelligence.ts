export interface IntelSource {
  id: string
  name: string
}

export interface IntelItem {
  id: string
  title: string | null
  sourceId: string | null
  publishedAt: string | null
  url: string | null
  summary: string | null
}
