'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`/api/blog/${postId}`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete post"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
} 