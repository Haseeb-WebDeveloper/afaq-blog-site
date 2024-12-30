import mongoose, { Schema, model, models } from "mongoose";

export interface IBlogPost {
    _id?: string;
    title: string; 
    content: string; 
    author: string;
    categories?: string[]; 
    tags?: string[]; 
    featuredImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isPublished: boolean; 
}

// schema for blog post
const BlogPostSchema: Schema<IBlogPost> = new mongoose.Schema(
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      author: { type: String, required: true },
      categories: { type: [String], default: [] },
      tags: { type: [String], default: [] },
      featuredImage: { type: String, default: null },
      isPublished: { type: Boolean, default: true },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Check if the model exists before creating a new one
export const BlogPostModel = models.BlogPost || model<IBlogPost>('BlogPost', BlogPostSchema);
