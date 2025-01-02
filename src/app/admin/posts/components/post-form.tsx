'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, X, Globe, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Editor } from '@/components/ui/editor';
import { ImageUploadBox } from '@/components/ui/image-upload-box';
import { CATEGORIES, TAGS } from "@/constants/constant";
import { cn } from "@/lib/utils";

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    categories: string[];
    tags: string[];
    featuredImage: string;
    isPublished: boolean;
    isFeatured: boolean;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    language: string;
    priority: number;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    readingTime: number;
  };
  postId?: string;
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'social'>('content');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    slug: initialData?.slug || '',
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
    featuredImage: initialData?.featuredImage || '',
    isPublished: initialData?.isPublished || false,
    isFeatured: initialData?.isFeatured || false,
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    metaKeywords: initialData?.metaKeywords || [],
    language: initialData?.language || 'en',
    priority: initialData?.priority || 0,
    ogTitle: initialData?.ogTitle || '',
    ogDescription: initialData?.ogDescription || '',
    ogImage: initialData?.ogImage || '',
    readingTime: initialData?.readingTime || 0,
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.excerpt,
        metaKeywords: formData.metaKeywords.length ? formData.metaKeywords : formData.tags,
        ogTitle: formData.ogTitle || formData.title,
        ogDescription: formData.ogDescription || formData.excerpt,
        ogImage: formData.ogImage || formData.featuredImage,
      };

      if (postId) {
        await axios.put(`/api/blog/${postId}`, payload);
      } else {
        await axios.post('/api/blog/create', payload);
      }
      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'seo', label: 'SEO' },
    { id: 'social', label: 'Social' },
  ];

  return (
    <div className="space-y-8 w-full max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-10 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold">{postId ? 'Edit Post' : 'Create New Post'}</h1>
          <p className="text-muted-foreground">
            {postId ? 'Make changes to your post' : 'Create a new blog post'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <div className="flex border-b mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      });
                    }}
                    required
                  />
                </div>


                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    placeholder="post-url-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Excerpt</label>
                  <Input
                    placeholder="Brief description of the post it will be used as meta description"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Image</label>
                  <ImageUploadBox
                    value={formData.featuredImage}
                    onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Editor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">SEO Settings</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Meta Title</label>
                      <Input
                        placeholder="SEO title"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.metaTitle.length}/60 characters
                      </p>
                    </div>
                    {/* Add other SEO fields similarly */}
                  </div>
                </div>

                  {/* <div className="space-y-4">
                    <h3 className="font-medium">Advanced SEO</h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Canonical URL</label>
                        <Input
                          placeholder="https://example.com/blog/post"
                          value={formData.canonicalUrl}
                          onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div> */}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Social Media Preview</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">OG Title</label>
                      <Input
                        placeholder="Social media title"
                        value={formData.ogTitle}
                        onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">OG Description</label>
                      <Input
                        placeholder="Social media description"
                        value={formData.ogDescription}
                        onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">OG Image</label>
                      <ImageUploadBox
                        value={formData.ogImage}
                        onChange={(url) => setFormData({ ...formData, ogImage: url })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            {/* Publication Settings */}
            <div className="space-y-4">
              <h3 className="font-medium">Publication Settings</h3>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant={formData.isPublished ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                >
                  {formData.isPublished ? <Globe className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                  {formData.isPublished ? 'Published' : 'Draft'}
                </Button>
                <Button
                  type="button"
                  variant={formData.isFeatured ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                >
                  Featured Post
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={formData.categories.includes(category) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newCategories = formData.categories.includes(category)
                        ? formData.categories.filter(c => c !== category)
                        : [...formData.categories, category];
                      setFormData({ ...formData, categories: newCategories });
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={formData.tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newTags = formData.tags.includes(tag)
                        ? formData.tags.filter(t => t !== tag)
                        : [...formData.tags, tag];
                      setFormData({ ...formData, tags: newTags });
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="font-medium">Advanced Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Language</label>
                  <Input
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Priority</label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 