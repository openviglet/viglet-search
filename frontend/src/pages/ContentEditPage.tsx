import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contentApi } from '@/lib/content-api'
import { ContentDto } from '@/types'
import { ArrowLeft, Save } from 'lucide-react'

export function ContentEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ContentDto>({
    title: '',
    body: '',
    category: '',
    author: '',
    tags: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit && id) {
      fetchContent(parseInt(id))
    }
  }, [id, isEdit])

  const fetchContent = async (contentId: number) => {
    try {
      const content = await contentApi.getById(contentId)
      setFormData({
        id: content.id,
        title: content.title,
        body: content.body,
        category: content.category || '',
        author: content.author || '',
        tags: content.tags || ''
      })
    } catch (error) {
      console.error('Error fetching content:', error)
      navigate('/content')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must not exceed 255 characters'
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body is required'
    }

    if (formData.category && formData.category.length > 100) {
      newErrors.category = 'Category must not exceed 100 characters'
    }

    if (formData.author && formData.author.length > 100) {
      newErrors.author = 'Author must not exceed 100 characters'
    }

    if (formData.tags && formData.tags.length > 500) {
      newErrors.tags = 'Tags must not exceed 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      if (isEdit && id) {
        await contentApi.update(parseInt(id), formData)
        navigate(`/content/${id}`)
      } else {
        const newContent = await contentApi.create(formData)
        navigate(`/content/${newContent.id}`)
      }
    } catch (error) {
      console.error('Error saving content:', error)
      setErrors({ submit: 'Failed to save content. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ContentDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Edit Content' : 'Create New Content'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update your content item' : 'Create a new content item'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter content title"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Body */}
            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium">
                Content *
              </label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Enter your content here..."
                rows={10}
                className={errors.body ? 'border-destructive' : ''}
              />
              {errors.body && (
                <p className="text-sm text-destructive">{errors.body}</p>
              )}
            </div>

            {/* Category and Author Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Technology, News, Tutorial"
                  className={errors.category ? 'border-destructive' : ''}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="author" className="text-sm font-medium">
                  Author
                </label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Author name"
                  className={errors.author ? 'border-destructive' : ''}
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="Comma-separated tags (e.g., react, javascript, tutorial)"
                className={errors.tags ? 'border-destructive' : ''}
              />
              {errors.tags && (
                <p className="text-sm text-destructive">{errors.tags}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {errors.submit}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Link to="/content">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Update Content' : 'Create Content'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}