import { Card } from "@/components/ui/card";
import { FileText, Users, Eye } from "lucide-react";
import Link from "next/link";
import { BlogPostModel } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";

export default async function AdminDashboard() {
  let stats = [
    {
      title: "Total Posts",
      value: "0",
      icon: FileText,
      link: "/admin/posts"
    },
    {
      title: "Total Views",
      value: "0",
      icon: Eye,
      link: "/admin/analytics"
    },
    {
      title: "Active Users",
      value: "1",
      icon: Users,
      link: "/admin/users"
    }
  ];

  let recentPosts: any[] = [];

  try {
    await connectDB();
    
    // Get total posts count
    const totalPosts = await BlogPostModel.countDocuments();
    stats[0].value = totalPosts.toString();

    // Get recent posts
    recentPosts = await BlogPostModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title isPublished createdAt updatedAt')
      .lean();

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          <Link 
            href="/admin/posts/new" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create New Post
          </Link>
        </div>
        
        <Card className="divide-y">
          {recentPosts.length > 0 ? (
            recentPosts.map((post: any) => (
              <div key={post._id} className="p-4">
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">
                  {post.isPublished ? 'Published' : 'Draft'} • Last edited{' '}
                  {new Date(post.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No posts yet. Create your first post!
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}