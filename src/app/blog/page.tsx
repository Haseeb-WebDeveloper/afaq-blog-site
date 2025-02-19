import { getBlogContent } from "./components/blog-content";
import BlogLayout from "./components/blog-layout";
import { Metadata } from 'next';
import { siteConfig } from '@/config/seo';
import { BlogPost, SearchParams } from "@/types/blog";
import { Suspense } from 'react';

interface PageProps {
  searchParams: SearchParams;
}

export const metadata: Metadata = {
  title: "Blog | Explore Our Articles",
  description: "Read our latest articles about technology, programming, and digital innovation.",
  keywords: [...siteConfig.keywords, "Tech Blog", "Programming Blog", "Developer Articles"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteConfig.url}/blog`,
    title: "Blog | Explore Our Articles",
    description: "Read our latest articles about technology, programming, and digital innovation.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Blog Articles"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Explore Our Articles",
    description: "Read our latest articles about technology, programming, and digital innovation.",
    images: [siteConfig.ogImage],
    creator: "@haseebkhan"
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`
  }
};

export const generateStructuredData = (posts: BlogPost[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": `${siteConfig.url}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`
      }
    },
    "blogPosts": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt || post.createdAt,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "image": post.featuredImage,
      "url": `${siteConfig.url}/blog/${post.slug}`
    }))
  };
};

export default async function BlogPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<BlogLoadingState />}>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  );
}

function BlogLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

async function BlogContent({ searchParams }: PageProps) {
  try {
    const blogContent = await getBlogContent({ searchParams });
    const structuredData = generateStructuredData(blogContent.posts);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <BlogLayout content={blogContent} searchParams={searchParams} />
      </>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Failed to load blog content</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }
}