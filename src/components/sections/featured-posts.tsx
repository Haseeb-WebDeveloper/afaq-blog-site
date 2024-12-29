import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedPosts() {
  const posts = [
    {
      category: "Technology",
      readTime: "5 min read",
      title: "The Future of Artificial Intelligence",
      excerpt: "Exploring the latest developments in AI and their impact on our daily lives...",
      author: "John Doe",
      date: "April 12, 2024"
    },
    {
      category: "Design",
      readTime: "3 min read",
      title: "Principles of Modern Web Design",
      excerpt: "Understanding the key elements that make websites stand out in 2024...",
      author: "Jane Smith",
      date: "April 11, 2024"
    },
    {
      category: "Development",
      readTime: "7 min read",
      title: "Building Scalable Applications",
      excerpt: "Best practices for creating applications that can grow with your needs...",
      author: "Mike Johnson",
      date: "April 10, 2024"
    }
  ];

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <div className="group relative bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center gap-x-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
          <span className="text-sm text-muted-foreground">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-x-4">
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60" />
          <div>
            <p className="text-sm font-medium">{post.author}</p>
            <p className="text-xs text-muted-foreground">Posted on {post.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 