'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Editor } from '@/components/ui/editor';
import { ImageUploadBox } from '@/components/ui/image-upload-box';

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    tags: string;
    featuredImage: string;
  };
  postId?: string;
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    tags: initialData?.tags || '',
    featuredImage: initialData?.featuredImage || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (postId) {
        await axios.put(`/api/blog/${postId}`, formData);
      } else {
        await axios.post('/api/blog/create', formData);
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
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

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter post title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image</label>
            <ImageUploadBox
              value={formData.featuredImage}
              onChange={(url) => setFormData({ ...formData, featuredImage: url })}
            />
            {formData.featuredImage && (
              <p className="text-xs text-muted-foreground">
                Image uploaded successfully
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Editor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              placeholder="Enter tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
        </form>
      </Card>
    </div>
  );
} 