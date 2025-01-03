import connectDB from '@/database/connect';
import { BlogPostModel } from '@/database/models/blog-post.model';
import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const {
            title,
            content,
            excerpt,
            slug,
            categories,
            tags,
            featuredImage,
            isPublished,
            isFeatured,
            metaTitle,
            metaDescription,
            metaKeywords,
            ogTitle,
            ogDescription,
            ogImage,
            structuredData,
            language,
            priority
        } = await req.json();

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json({ 
                message: 'Title and content are required' 
            }, { status: 400 });
        }

        await connectDB();

        // Generate slug if not provided
        const finalSlug = slug || title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Check if slug is unique
        const existingPost = await BlogPostModel.findOne({ slug: finalSlug });
        if (existingPost) {
            return NextResponse.json({ 
                message: 'A post with this slug already exists' 
            }, { status: 400 });
        }

        // Process tags and categories
        const processedTags = Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim());
        const processedCategories = Array.isArray(categories) ? categories : categories.split(',').map((cat: string) => cat.trim());

        // Create the blog post with all fields
        const blogPost = await BlogPostModel.create({ 
            title,
            content,
            excerpt: excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''), // Strip HTML and limit length
            slug: finalSlug,
            author: user.email,
            categories: processedCategories,
            tags: processedTags,
            featuredImage,
            isPublished: isPublished || false,
            isFeatured: isFeatured || false,
            // SEO Fields
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''),
            metaKeywords: metaKeywords || processedTags,
            // Open Graph
            ogTitle: ogTitle || title,
            ogDescription: ogDescription || excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''),
            ogImage: ogImage || featuredImage,
            // Additional SEO
            structuredData: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": title,
                "image": featuredImage ? [featuredImage] : [],
                "author": {
                    "@type": "Person",
                    "name": user.email
                },
                "datePublished": new Date().toISOString(),
                "description": excerpt || content.substring(0, 160).replace(/<[^>]*>/g, '')
            }),
            language: language || 'en',
            priority: priority || 0,
            readingTime: 0  
        });

        // Verify the post was created and fetch it with virtuals
        const createdPost = await BlogPostModel.findById(blogPost._id);

        return NextResponse.json({ 
            message: 'Blog post created successfully',
            post: createdPost
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ 
            message: 'Error creating blog post',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 