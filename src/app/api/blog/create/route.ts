import connectDB from '@/database/connect';
import { BlogPostModel } from '@/database/models/blog-post.model';
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const user = await getUser();
        console.log(user);

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, tags, featuredImage } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
        }

        await connectDB();

        // Convert tags string to array if it's a string
        const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;

        // creating blog post
        const blogPost = await BlogPostModel.create({ 
            title, 
            content, 
            tags: tagsArray,
            featuredImage,
            author: user.email,
            isPublished: false // Default to draft
        });

        const blogPostFromDB = await BlogPostModel.findById(blogPost._id);
        console.log(blogPostFromDB);

        return NextResponse.json({ 
            message: 'Blog post created successfully',
            blogPost
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ 
            message: 'Error creating blog post',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 