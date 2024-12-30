import { BlogPostModel } from "@/database/models/blog-post.model";
import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function GET() {
   try {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const blogPosts = await BlogPostModel.find({userId: user.id});
    
    console.log(blogPosts);
    return NextResponse.json({
       message: 'Blog posts fetched successfully',
       data: blogPosts
    });
   } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
   }
}