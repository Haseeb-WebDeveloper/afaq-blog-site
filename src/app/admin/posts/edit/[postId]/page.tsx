'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditPostPage({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    featuredImage: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/blog/${params.postId}`);
        const post = response.data.post;
        setFormData({
          title: post.title,
          content: post.content,
          tags: post.tags?.join(', ') || '',
          featuredImage: post.featuredImage || ''
        });
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      }
    };

    fetchPost();
  }, [params.postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.put(`/api/blog/${params.postId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Make changes to your post</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
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
            <label className="text-sm font-medium">Content</label>
            <Editor
              apiKey="0yjhs49kdhknwm2or3apawddwfxc3ptzu9y964f7cdvspjdh"
              value={formData.content}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
              onEditorChange={(content) => setFormData({ ...formData, content })}
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image URL</label>
            <Input
              placeholder="Enter image URL"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
            />
          </div>
        </form>
      </Card>
    </div>
  );
} 