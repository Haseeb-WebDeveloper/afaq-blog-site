import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { BlogPostModel } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";
import PublishButton from "./components/publish-button";
import DeletePostButton from "./components/delete-post-button";

export default async function PostsPage() {
  await connectDB();
  
  // Fetch posts with pagination
  const posts = await BlogPostModel.find()
    .sort({ createdAt: -1 })
    .select('title content isPublished createdAt updatedAt')
    .lean();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <Card>
        <div className="divide-y">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.title} className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    {post.isPublished ? (
                      <Globe className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.isPublished 
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                    }`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/blog/${post._id}`} >
                    <Button variant="ghost" size="icon" title="View post">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/posts/edit/${post._id}`}>
                    <Button variant="ghost" size="icon" title="Edit post">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <PublishButton 
                    postId={post._id?.toString() || ''} 
                    isPublished={post.isPublished} 
                  />
                  <DeletePostButton postId={post._id?.toString() || ''} />
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No posts yet. Create your first post!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 