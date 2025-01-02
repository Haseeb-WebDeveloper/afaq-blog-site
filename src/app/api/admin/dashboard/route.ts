import { BlogPostModel } from '@/database/models/blog-post.model';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
    const totalPosts = await BlogPostModel.countDocuments({ isPublished: true });
    const recentPosts = await BlogPostModel.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    return NextResponse.json({ totalPosts, recentPosts }, { status: 200 });
   } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
   }
}