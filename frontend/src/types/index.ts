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

export interface SearchResult extends Content {
  score: number
  highlightedTitle?: string
  highlightedBody?: string
}