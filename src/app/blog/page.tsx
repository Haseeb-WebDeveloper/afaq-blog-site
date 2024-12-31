import { BlogPostModel } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Tag } from "lucide-react";
import SearchBar from "./components/search-bar";

// Function to estimate reading time
function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string; q?: string };
}) {
  // Await searchParams before using
  const tag = await searchParams.tag;
  const query = await searchParams.q;

  await connectDB();

  // Build query based on search params
  const dbQuery: any = { isPublished: true };
  if (tag) {
    dbQuery.tags = tag;
  }
  if (query) {
    dbQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ];
  }

  // Fetch posts and all unique tags
  const [posts, allTags] = await Promise.all([
    BlogPostModel.find(dbQuery)
      .sort({ createdAt: -1 })
      .lean(),
    BlogPostModel.distinct('tags', { isPublished: true })
  ]);

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

        {/* Search and Filters */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchBar />
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tagItem) => (
                <Link 
                  key={tagItem} 
                  href={`/blog?tag=${tagItem}`}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors
                    ${tag === tagItem 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'}`}
                >
                  <Tag className="w-3 h-3" />
                  {tagItem}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-5xl mx-auto">
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link 
                  key={post.title}
                  href={`/blog/${post._id}`}
                  className="group relative flex flex-col bg-card rounded-lg overflow-hidden border transition-colors hover:border-primary"
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <time dateTime={post.createdAt?.toString()}>
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </time>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getReadingTime(post.content)} min read
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold leading-snug mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {post.tags.map((tagItem: string) => (
                          <span
                            key={tagItem}
                            className="px-2 py-1 bg-muted rounded-md text-xs"
                          >
                            {tagItem}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                {(query || tag)
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Check back later for new posts."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Blog | Your Site Name',
  description: 'Read our latest blog posts about technology, design, and more.',
};
