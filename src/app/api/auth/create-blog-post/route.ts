import connectDB from '@/database/connect';
import { BlogPostModel } from '@/database/models/blog-post.model';
import { getAuthorizationHeader } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { user } = await getAuthorizationHeader();
        console.log(user);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const { title, content, tags, featuredImage } = await req.json();
        console.log(title, content, tags, featuredImage);

        if (!title || !content || !tags || !featuredImage) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        await connectDB();

        // creating blog post
        const blogPost = await BlogPostModel.create({ title, content, tags, featuredImage });

        console.log(blogPost);

        return NextResponse.json({ 
            message: 'Blog post created successfully',
            blogPost: blogPost
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating blog post' }, { status: 500 });
    }

}