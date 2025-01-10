import { getBlogContent } from "./components/blog-content";
import BlogLayout from "./components/blog-layout";
import { Metadata } from 'next';
import { siteConfig } from '@/config/seo';

interface PageProps {
  searchParams: {
    tag?: string;
    category?: string;
    q?: string;
    page?: string;
    sort?: 'latest' | 'popular';
  };
}

export const metadata: Metadata = {
  title: "Blog | Explore Our Articles",
  description: "Read our latest articles about technology, programming, and digital innovation. Stay updated with the latest trends and insights.",
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

// Add structured data for the blog listing
export const generateStructuredData = (posts: any[]) => {
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
      "dateModified": post.updatedAt,
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
  const blogContent = await getBlogContent({ searchParams });
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(blogContent.posts))
        }}
      />
      <BlogLayout content={blogContent} searchParams={searchParams} />
    </>
  );
}

