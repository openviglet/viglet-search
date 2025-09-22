import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { contentApi } from '@/lib/content-api'
import { Content } from '@/types'
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ContentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchContent(parseInt(id))
    }
  }, [id])

  const fetchContent = async (contentId: number) => {
    try {
      const data = await contentApi.getById(contentId)
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
      navigate('/content')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!content) return
    
    try {
      await contentApi.delete(content.id)
      navigate('/content')
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Content not found</h2>
        <Link to="/content">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content List
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/content">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <p className="text-muted-foreground">Content ID: {content.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/content/${content.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Content</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{content.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {content.author && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Author:</span>
                <span>{content.author}</span>
              </div>
            )}
            {content.category && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Category:</span>
                <span className="bg-secondary px-2 py-1 rounded text-xs">
                  {content.category}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              <span>{formatDate(content.createdAt)}</span>
            </div>
            {content.updatedAt !== content.createdAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Updated:</span>
                <span>{formatDate(content.updatedAt)}</span>
              </div>
            )}
          </div>
          {content.tags && (
            <div className="mt-4">
              <span className="font-medium text-sm">Tags: </span>
              <span className="text-sm text-muted-foreground">{content.tags}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Body */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {content.body}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Related Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {content.category && (
              <Link to={`/search?category=${encodeURIComponent(content.category)}`}>
                <Button variant="outline" size="sm">
                  Find similar in "{content.category}"
                </Button>
              </Link>
            )}
            {content.author && (
              <Link to={`/search?author=${encodeURIComponent(content.author)}`}>
                <Button variant="outline" size="sm">
                  More by "{content.author}"
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}