"use client"

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export default function FeaturedPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  // sending request to api to get the posts
  async function getPosts() {
    try {
      const response = await fetch('/api/blog/feature-post');
      const data = await response.json();
      setPosts(data.featuredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-500">
              Featured Stories
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover the most engaging stories from our community
            </p>
          </div>
          <Link 
            href="/blog" 
            className="hidden sm:flex items-center text-primary hover:underline group"
          >
            View all posts 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <Link 
      key={post._id} 
      href={`/blog/${post.slug}`}
      className="group"
    >
      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
        {post.featuredImage && (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-4 flex flex-col min-h-[180px] justify-between">
          {/* Content Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          {/* Footer with Categories */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              {post.categories?.slice(0, 2).map((category: string) => (
                <Badge 
                  key={category}
                  variant="secondary"
                  className="bg-primary/5 text-primary text-xs"
                >
                  {category}
                </Badge>
              ))}
            </div>
            <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}