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
    const post = await BlogPostModel.findById(params.postId);
    
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

    const { title, content, tags, featuredImage } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Convert tags string to array if it's a string
    const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;

    const post = await BlogPostModel.findByIdAndUpdate(
      params.postId,
      {
        title,
        content,
        tags: tagsArray,
        featuredImage,
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
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const post = await BlogPostModel.findByIdAndDelete(params.postId);

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
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPublished } = await req.json();

    await connectDB();
    const post = await BlogPostModel.findByIdAndUpdate(
      params.postId,
      { isPublished },
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