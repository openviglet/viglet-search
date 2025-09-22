export interface Content {
  id: number
  title: string
  body: string
  category?: string
  author?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

export interface ContentDto {
  id?: number
  title: string
  body: string
  category?: string
  author?: string
  tags?: string
}

export interface SearchResult {
  content: Content
  score: number
  highlights: string[]
}