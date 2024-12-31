'use client';

import { PostForm } from "../../components/post-form";
import { useEffect, useState } from "react";
import axios from "axios";

interface PostData {
  title: string;
  content: string;
  tags: string;
  featuredImage: string;
}

type EditPostPageProps = {
  params: {
    postId: string;
  };
};

export default function EditPostPage({ params }: EditPostPageProps) {
  const [initialData, setInitialData] = useState<PostData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/blog/${params.postId}`);
        const post = response.data.post;
        setInitialData({
          title: post.title,
          content: post.content,
          tags: post.tags?.join(", ") || "",
          featuredImage: post.featuredImage || "",
        });
      } catch (err: any) {
        console.error("Error fetching post:", err?.message || err);
        setError("Failed to load post");
      }
    };

    fetchPost();
  }, [params.postId]);

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <PostForm initialData={initialData} postId={params.postId} />;
}
