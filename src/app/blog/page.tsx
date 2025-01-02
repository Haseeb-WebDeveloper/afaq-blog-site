import { getBlogContent } from "./components/blog-content";
import BlogLayout from "./components/blog-layout";

interface PageProps {
  searchParams: {
    tag?: string;
    category?: string;
    q?: string;
    page?: string;
    sort?: 'latest' | 'popular';
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const blogContent = await getBlogContent({ searchParams });
  
  return <BlogLayout content={blogContent} searchParams={searchParams} />;
}

export const metadata = {
  title: 'Blog | Your Site Name',
  description: 'Read our latest blog posts about technology, design, and more.',
};

