'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Lock } from "lucide-react";
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface PublishButtonProps {
  postId: string;
  isPublished: boolean;
}

export default function PublishButton({ postId, isPublished }: PublishButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTogglePublish = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/blog/${postId}`, {
        isPublished: !isPublished
      });
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleTogglePublish}
      disabled={isLoading}
      title={isPublished ? "Unpublish post" : "Publish post"}
      className={isPublished ? "text-green-500" : "text-yellow-500"}
    >
      {isPublished ? (
        <Globe className="w-4 h-4" />
      ) : (
        <Lock className="w-4 h-4" />
      )}
    </Button>
  );
} 