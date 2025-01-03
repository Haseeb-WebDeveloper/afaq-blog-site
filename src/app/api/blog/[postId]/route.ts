import { NextResponse } from "next/server";
import connectDB from "@/database/connect";
import { BlogPostModel } from "@/database/models/blog-post.model";
import { getUser } from "@/lib/auth";

// Get a single post
export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    await connectDB();
    const post = await BlogPostModel.findOne({ _id: params.postId });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// Update a post
export async function PUT(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      title, 
      content,
      excerpt,
      slug: newSlug,
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
      language,
      priority
    } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate slug if not provided
    const finalSlug = newSlug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Process tags and categories
    const processedTags = Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim());
    const processedCategories = Array.isArray(categories) ? categories : categories.split(',').map((cat: string) => cat.trim());

    const post = await BlogPostModel.findOneAndUpdate(
      { _id: params.postId },
      {
        title,
        content,
        excerpt: excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''),
        slug: finalSlug,
        author: user.email,
        categories: processedCategories,
        tags: processedTags,
        featuredImage,
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''),
        metaKeywords: metaKeywords || processedTags,
        ogTitle: ogTitle || title,
        ogDescription: ogDescription || excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''),
        ogImage: ogImage || featuredImage,
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
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// Delete a post (existing code)
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    console.log('Deleting post:', params.postId);
    await connectDB();
    const post = await BlogPostModel.findOneAndDelete({ _id: params.postId });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

// Toggle publish status (existing code)
export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { isPublished } = await req.json();
    console.log('Patching post:', params.postId);
    console.log('isPublished', isPublished);

    await connectDB();
    const post = await BlogPostModel.findOneAndUpdate(
      { _id: await params.postId },
      { isPublished },
      { new: true }
    );

    console.log('post', post.isPublished);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
} 