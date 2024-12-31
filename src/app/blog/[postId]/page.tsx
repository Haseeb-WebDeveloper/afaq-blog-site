import { BlogPostModel, IBlogPost } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";
import { notFound } from "next/navigation";
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function BlogPostPage({ params }: { params: { postId: string } }) {
  try {
    await connectDB();
    const post = await BlogPostModel.findById(params.postId).lean() as IBlogPost | null;
    
    if (!post || !post.isPublished) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-8xl flex flex-col items-start mx-auto">
            {/* Back button */}
            <Link 
              href="/blog" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>

            <article className="space-y-8 max-w-6xl">
              {/* Header */}
              <header className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <time dateTime={post.createdAt?.toString()}>
                    {format(new Date(post.createdAt || ''), 'MMMM d, yyyy')}
                  </time>
                  <span>·</span>
                  <span>By {post.author}</span>
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="aspect-video max-w-3xl relative overflow-hidden rounded-lg">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-8 border-t">
                  <h2 className="text-lg font-semibold mb-4">Tags</h2>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}

// Add metadata generation
export async function generateMetadata({ params }: { params: { postId: string } }) {
  try {
    await connectDB();
    const post = await BlogPostModel.findById(await params.postId).lean() as IBlogPost | null;

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.'
      };
    }

    return {
      title: post.title,
      description: post.content.substring(0, 160),
      openGraph: {
        title: post.title,
        description: post.content.substring(0, 160),
        images: post.featuredImage ? [post.featuredImage] : [],
      },
    };
  } catch {
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post.'
    };
  }
}