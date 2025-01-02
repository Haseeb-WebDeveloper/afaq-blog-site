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
  const { posts, featuredPosts, currentPage, totalPages } = content;

  const handleSortChange = (sortValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    router.push(`/blog?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push('/blog');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </div>

        {/* Featured Posts */}
        {/* {featuredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredPosts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="group relative"
              >
                <Card className="overflow-hidden border-none shadow-lg">
                  {post.featuredImage && (
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-primary">Featured</Badge>
                    </div>
                  )}
                  <CardContent className="absolute bottom-0 p-6 text-white">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <time dateTime={post.createdAt?.toString()}>
                        {format(new Date(post.createdAt || ''), 'MMM d, yyyy')}
                      </time>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )} */}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-2">
                        {CATEGORIES.map((category) => (
                          <Link
                            key={category}
                            href={`/blog?category=${category}`}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-md text-sm transition-colors",
                              searchParams.category === category
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            )}
                          >
                            <span>{category}</span>
                            <Badge variant="outline" className="ml-auto">12</Badge>
                          </Link>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  {/* Tags */}
                  <div>
                    <h3 className="font-medium mb-3">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <Link key={tag} href={`/blog?tag=${tag}`}>
                          <Badge 
                            variant={searchParams.tag === tag ? "default" : "secondary"}
                            className="cursor-pointer hover:opacity-80"
                          >
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Posts Grid */}
            <div className="space-y-6">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <SearchBar className="pl-10" />
                </div>
                <div className="flex gap-2">
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
              </div>

              {/* Active Filters */}
              {(searchParams.tag || searchParams.category || searchParams.q) && (
                <div className="flex flex-wrap items-center gap-2">
                  {searchParams.q && (
                    <Badge variant="secondary">Search: {searchParams.q}</Badge>
                  )}
                  {searchParams.category && (
                    <Badge variant="secondary">Category: {searchParams.category}</Badge>
                  )}
                  {searchParams.tag && (
                    <Badge variant="secondary">Tag: {searchParams.tag}</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Posts */}
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Link 
                      key={post._id} 
                      href={`/blog/${post.slug}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                        {post.featuredImage && (
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          {post.categories && post.categories.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {post.categories.map((category) => (
                                <Badge key={`${post._id}-${category}`} variant="secondary">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>

                          <CardDescription className="mb-4 line-clamp-2">
                            {post.excerpt}
                          </CardDescription>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(post.createdAt), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readingTime} min read
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Read more <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <CardTitle className="mb-2">No posts found</CardTitle>
                  <CardDescription>
                    {searchParams.q || searchParams.tag || searchParams.category
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Check back later for new posts."}
                  </CardDescription>
                </Card>
              )}

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
    </div>
  );
} 