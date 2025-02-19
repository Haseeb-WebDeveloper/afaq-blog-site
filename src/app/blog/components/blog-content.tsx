import { BlogPostModel } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";
import { BlogPost, SearchParams } from "@/types/blog";

interface BlogContentProps {
  searchParams: SearchParams;
}

export async function getBlogContent({ searchParams }: BlogContentProps) {
  try {
    await connectDB();

    const resolvedParams = {
      tag: searchParams?.tag,
      category: searchParams?.category,
      q: searchParams?.q,
      page: searchParams?.page,
      sort: searchParams?.sort || 'latest'
    };

    const query: any = { isPublished: true };
    if (resolvedParams.tag) query.tags = resolvedParams.tag;
    if (resolvedParams.category) query.categories = resolvedParams.category;
    if (resolvedParams.q) {
      query.$or = [
        { title: { $regex: resolvedParams.q, $options: 'i' } },
        { content: { $regex: resolvedParams.q, $options: 'i' } },
        { excerpt: { $regex: resolvedParams.q, $options: 'i' } },
      ];
    }

    const page = Math.max(1, Number(resolvedParams.page) || 1);
    const limit = 9;
    const skip = (page - 1) * limit;

    const sortOptions = {
      latest: { createdAt: -1 },
      popular: { priority: -1, createdAt: -1 }
    };

    const [posts, totalPosts, featuredPosts] = await Promise.all([
      BlogPostModel.find(query)
        .sort(sortOptions[resolvedParams.sort] as any)
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPostModel.countDocuments(query),
      BlogPostModel.find({ isPublished: true, isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean()
    ]);

    return {
      posts: serializePosts(posts),
      totalPosts,
      featuredPosts: serializePosts(featuredPosts),
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit)
    };
  } catch (error) {
    console.error('Error fetching blog content:', error);
    throw new Error('Failed to fetch blog content');
  }
}

function serializePosts(posts: any[]): BlogPost[] {
  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt?.toISOString(),
    updatedAt: post.updatedAt?.toISOString()
  }));
}