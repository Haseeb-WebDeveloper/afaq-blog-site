import { NextResponse } from 'next/server';
import { BlogPostModel } from '@/database/models/blog-post.model';
import connectDB from '@/database/connect';

export async function GET(req: Request) {
  await connectDB();
  const posts = await BlogPostModel.find();
  return NextResponse.json({ posts });
}