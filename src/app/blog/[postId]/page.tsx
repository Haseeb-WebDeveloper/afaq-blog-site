import { BlogPostModel, IBlogPost } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";
import { notFound } from "next/navigation";
import { format } from 'date-fns';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

interface Props {
  params: { postId: string };
}

export default async function BlogPostPage({ params }: Props) {
  try {
    await connectDB();
    
    const post = await BlogPostModel.findOne({ 
      slug: params.postId,
      isPublished: true 
    }).lean() as IBlogPost | null;
    
    if (!post) {
      notFound();
    }

    // TODO: add similar posts to the bottom of the page

    return (
      <>
        {/* Structured Data */}
        <Script id="structured-data" type="application/ld+json">
          {post.structuredData}
        </Script>

        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <Link 
                href="/blog" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to all posts
              </Link>

              <article className="space-y-8">
                {/* Header */}
                <header className="space-y-4">
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {post.categories.map((category) => (
                        <Link
                          key={category}
                          href={`/blog?category=${category}`}
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}

                  <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
                  
                  {post.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.createdAt?.toString()}>
                        {format(new Date(post.createdAt || ''), 'MMMM d, yyyy')}
                      </time>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>By {post.author}</span>
                    </div> */}
                  </div>
                </header>

                {/* Featured Image */}
                {post.featuredImage && (
                  <figure className="aspect-video relative overflow-hidden rounded-lg">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                )}

                {/* Content */}
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="pt-8 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${tag}`}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}

// Enhanced metadata generation
export async function generateMetadata({ params }: Props) {
  try {
    await connectDB();
    const post = await BlogPostModel.findOne({ 
      slug: params.postId,
      isPublished: true 
    }).lean() as IBlogPost | null;

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.'
      };
    }

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.metaKeywords,
      authors: [{ name: post.author }],
      openGraph: {
        title: post.ogTitle || post.title,
        description: post.ogDescription || post.excerpt,
        type: 'article',
        publishedTime: post.createdAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        authors: [post.author],
        images: [
          {
            url: post.ogImage || post.featuredImage || '',
            width: 1200,
            height: 675,
            alt: post.title,
          },
        ],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.ogTitle || post.title,
        description: post.ogDescription || post.excerpt,
        images: [post.ogImage || post.featuredImage || ''],
      },
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
    };
  } catch {
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post.'
    };
  }
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const posts = await BlogPostModel.find({ 
      isPublished: true 
    })
    .select('slug')
    .lean();
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
} 