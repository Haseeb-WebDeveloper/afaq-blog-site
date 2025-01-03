import { MetadataRoute } from 'next';
import { BlogPostModel } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";
import { siteConfig } from '@/config/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();
  
  // Get all published blog posts
  const posts = await BlogPostModel.find({ isPublished: true })
    .select('slug updatedAt')
    .sort({ updatedAt: -1 })
    .lean();

  const blogPosts = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogPosts,
  ];
} 