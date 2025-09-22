import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { contentApi } from '@/lib/content-api'
import { SearchResult } from '@/types'
import { Search, Filter, Eye, Edit } from 'lucide-react'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchForm, setSearchForm] = useState({
    query: searchParams.get('query') || '',
    category: searchParams.get('category') || '',
    author: searchParams.get('author') || ''
  })

  useEffect(() => {
    // Perform search on mount if there are search params
    if (searchParams.get('query') || searchParams.get('category') || searchParams.get('author')) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const searchResults = await contentApi.search(
        searchForm.query || undefined,
        searchForm.category || undefined,
        searchForm.author || undefined,
        50
      )
      setResults(searchResults)
      
      // Update URL params
      const params = new URLSearchParams()
      if (searchForm.query) params.set('query', searchForm.query)
      if (searchForm.category) params.set('category', searchForm.category)
      if (searchForm.author) params.set('author', searchForm.author)
      setSearchParams(params)
    } catch (error) {
      console.error('Error searching content:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights || highlights.length === 0) return text

    let highlightedText = text
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
    })
    
    return highlightedText
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search Content</h1>
        <p className="text-muted-foreground">
          Search through all your content using various filters and criteria.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Query Input */}
            <div className="space-y-2">
              <label htmlFor="query" className="text-sm font-medium">
                Search Query
              </label>
              <Input
                id="query"
                value={searchForm.query}
                onChange={(e) => setSearchForm(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Enter keywords to search for..."
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category Filter
                </label>
                <Input
                  id="category"
                  value={searchForm.category}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Filter by category..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="author" className="text-sm font-medium">
                  Author Filter
                </label>
                <Input
                  id="author"
                  value={searchForm.author}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Filter by author..."
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchForm({ query: '', category: '', author: '' })
                  setResults([])
                  setSearchParams({})
                }}
              >
                Clear All
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.map((result) => (
                <div key={result.content.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link to={`/content/${result.content.id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">
                            {result.content.title}
                          </h3>
                        </Link>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Score: {result.score.toFixed(2)}
                        </span>
                      </div>
                      
                      {result.highlights && result.highlights.length > 0 ? (
                        <div className="text-sm text-muted-foreground mb-2">
                          {result.highlights.map((highlight, index) => (
                            <div 
                              key={index} 
                              className="mb-1"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightText(highlight, [searchForm.query]) 
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {result.content.body.substring(0, 200)}...
                        </p>
                      )}

                      <div className="flex items-center flex-wrap gap-4 text-xs text-muted-foreground">
                        {result.content.author && (
                          <span>By {result.content.author}</span>
                        )}
                        {result.content.category && (
                          <span className="bg-secondary px-2 py-1 rounded">
                            {result.content.category}
                          </span>
                        )}
                        <span>Created {formatDate(result.content.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link to={`/content/${result.content.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/content/${result.content.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && (searchForm.query || searchForm.category || searchForm.author) && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all content.
            </p>
            <Link to="/content">
              <Button variant="outline">
                Browse All Content
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!loading && results.length === 0 && !searchForm.query && !searchForm.category && !searchForm.author && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to search</h3>
            <p className="text-muted-foreground">
              Enter search terms or filters above to find content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}