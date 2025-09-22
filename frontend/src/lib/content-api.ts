import api from './api'
import { Content, ContentDto, SearchResult } from '@/types'

export const contentApi = {
  // Get all content
  getAll: async (): Promise<Content[]> => {
    const response = await api.get('/content')
    return response.data
  },

  // Get content by ID
  getById: async (id: number): Promise<Content> => {
    const response = await api.get(`/content/${id}`)
    return response.data
  },

  // Create new content
  create: async (contentDto: ContentDto): Promise<Content> => {
    const response = await api.post('/content', contentDto)
    return response.data
  },

  // Update content
  update: async (id: number, contentDto: ContentDto): Promise<Content> => {
    const response = await api.put(`/content/${id}`, contentDto)
    return response.data
  },

  // Delete content
  delete: async (id: number): Promise<void> => {
    await api.delete(`/content/${id}`)
  },

  // Search content
  search: async (
    query?: string,
    category?: string,
    author?: string,
    maxResults: number = 50
  ): Promise<SearchResult[]> => {
    const params = new URLSearchParams()
    if (query) params.append('query', query)
    if (category) params.append('category', category)
    if (author) params.append('author', author)
    params.append('maxResults', maxResults.toString())

    const response = await api.get(`/content/search?${params.toString()}`)
    return response.data
  },

  // Filter content
  filter: async (
    category?: string,
    author?: string,
    query?: string
  ): Promise<Content[]> => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (author) params.append('author', author)
    if (query) params.append('query', query)

    const response = await api.get(`/content/filter?${params.toString()}`)
    return response.data
  },

  // Reindex all content
  reindex: async (): Promise<string> => {
    const response = await api.post('/content/reindex')
    return response.data
  },
}