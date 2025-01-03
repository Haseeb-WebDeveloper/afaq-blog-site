'use client';

import Link from "next/link";
import { format } from "date-fns";
import { Clock, Tag, Filter, Search, Calendar, ArrowRight } from "lucide-react";
import SearchBar from "./search-bar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES, TAGS } from "@/constants/constant";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
  createdAt: string;
  readingTime: number;
  author: string;
}

interface BlogLayoutProps {
  content: {
    posts: BlogPost[];
    totalPosts: number;
    featuredPosts: BlogPost[];
    currentPage: number;
    totalPages: number;
  };
  searchParams: {
    tag?: string;
    category?: string;
    q?: string;
    page?: string;
    sort?: 'latest' | 'popular';
  };
}

export default function BlogLayout({ content, searchParams }: BlogLayoutProps) {
  const router = useRouter();
  const { posts, currentPage, totalPages } = content;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSortChange = (sortValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-dot-pattern">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-b from-background to-background/50 border-b">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
              Explore Our Articles
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover stories, insights, and knowledge shared by our community
            </p>
            <div className="max-w-xl mx-auto mt-8">
              <SearchBar className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="sticky top-24 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Filter Posts</CardTitle>
                <CardDescription>
                  Browse by category or tag
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-foreground/80">Categories</h3>
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-1 pr-4">
                      {CATEGORIES.map((category) => (
                        <Link
                          key={category}
                          href={`/blog?category=${category}`}
                          className={cn(
                            "group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all",
                            searchParams.category === category
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span>{category}</span>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* <Separator /> */}

                {/* Tags */}
                {/* <div className="space-y-3">
                  <h3 className="font-medium text-sm text-foreground/80">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${tag}`}>
                        <Badge 
                          variant={searchParams.tag === tag ? "default" : "secondary"}
                          className="hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Sort Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={searchParams.sort !== 'popular' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange(null)}
                >
                  Latest
                </Button>
                <Button
                  variant={searchParams.sort === 'popular' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange('popular')}
                >
                  Popular
                </Button>
              </div>
                <p className="text-sm text-muted-foreground">
                  {posts.length} articles found
                </p>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => (
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
                    <CardContent className="p-5 flex flex-col h-[180px] justify-between">
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
                          {post.categories?.slice(0, 2).map((category) => (
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
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}${
                      searchParams.q ? `&q=${searchParams.q}` : ''
                    }${searchParams.tag ? `&tag=${searchParams.tag}` : ''}${
                      searchParams.category ? `&category=${searchParams.category}` : ''
                    }${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
                  >
                    <Button
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 