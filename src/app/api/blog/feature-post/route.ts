import { NextResponse } from 'next/server';
import { BlogPostModel } from '@/database/models/blog-post.model';
import connectDB from '@/database/connect';

export async function GET(req: Request) {
  await connectDB();
  const posts = await BlogPostModel.find();
// getting only featured posts
  const featuredPosts = posts.filter(post => post.isFeatured);
  return NextResponse.json({ featuredPosts }, { status: 200 });
}