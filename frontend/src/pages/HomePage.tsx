import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { contentApi } from '@/lib/content-api'
import { Content } from '@/types'
import { FileText, Search, Plus, Users, Calendar } from 'lucide-react'

export function HomePage() {
  const [recentContent, setRecentContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalContent: 0,
    uniqueAuthors: 0,
    uniqueCategories: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const content = await contentApi.getAll()
        setRecentContent(content.slice(0, 10))
        
        // Calculate stats
        const uniqueAuthors = new Set(content.filter(c => c.author).map(c => c.author)).size
        const uniqueCategories = new Set(content.filter(c => c.category).map(c => c.category)).size
        
        setStats({
          totalContent: content.length,
          uniqueAuthors,
          uniqueCategories
        })
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Viglet Search
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A powerful content indexing and search platform built with Spring Boot and Apache Lucene,
          now with a modern React frontend.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/content/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Content
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" size="lg">
              <Search className="h-5 w-5 mr-2" />
              Search Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <p className="text-xs text-muted-foreground">
              Content items indexed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueAuthors}</div>
            <p className="text-xs text-muted-foreground">
              Unique contributors
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueCategories}</div>
            <p className="text-xs text-muted-foreground">
              Content categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Content</CardTitle>
            <Link to="/content">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentContent.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No content found.</p>
              <Link to="/content/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Content
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link to={`/content/${content.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {content.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {content.body.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        {content.author && (
                          <span>By {content.author}</span>
                        )}
                        {content.category && (
                          <span className="bg-secondary px-2 py-1 rounded">
                            {content.category}
                          </span>
                        )}
                        <span>{formatDate(content.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}