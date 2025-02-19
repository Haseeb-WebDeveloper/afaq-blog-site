import { NextResponse } from 'next/server';
import { BlogPostModel } from '@/database/models/blog-post.model';
import connectDB from '@/database/connect';

export async function GET(req: Request) {
  console.log("Connected to MongoDB");
  await connectDB();
  console.log("Fetching posts");
  const posts = await BlogPostModel.find();
// getting only featured posts
  const featuredPosts = posts.filter(post => post.isFeatured);
  console.log("Featured posts fetched", featuredPosts);
  return NextResponse.json({ featuredPosts }, { status: 200 });
}