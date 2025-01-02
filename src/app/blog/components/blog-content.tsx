import { BlogPostModel } from "@/database/models/blog-post.model";
import connectDB from "@/database/connect";

interface BlogContentProps {
  searchParams: {
    tag?: string;
    category?: string;
    q?: string;
    page?: string;
    sort?: 'latest' | 'popular';
  };
}

export async function getBlogContent({ searchParams }: BlogContentProps) {
  // Await all searchParams at once
  const resolvedParams = {
    tag: await searchParams.tag,
    category: await searchParams.category,
    q: await searchParams.q,
    page: await searchParams.page,
    sort: await searchParams.sort as 'latest' | 'popular'
  };

  await connectDB();

  // Build query based on search params
  const query: any = { isPublished: true };
  if (resolvedParams.tag) {
    query.tags = resolvedParams.tag;
  }
  if (resolvedParams.category) {
    query.categories = resolvedParams.category;
  }
  if (resolvedParams.q) {
    query.$or = [
      { title: { $regex: resolvedParams.q, $options: 'i' } },
      { content: { $regex: resolvedParams.q, $options: 'i' } },
      { excerpt: { $regex: resolvedParams.q, $options: 'i' } },
    ];
  }

  // Pagination
  const page = Number(resolvedParams.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  // Sort options
  const sortOptions = {
    latest: { createdAt: -1 },
    popular: { priority: -1, createdAt: -1 }
  };
  const sort = sortOptions[resolvedParams.sort] || sortOptions.latest;

  // Fetch posts with pagination and serialize the results
  const [postsRaw, totalPosts, featuredPostsRaw] = await Promise.all([
    BlogPostModel.find(query)
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt content categories tags featuredImage createdAt readingTime author')
      .lean(),
    BlogPostModel.countDocuments(query),
    BlogPostModel.find({ isPublished: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title slug excerpt featuredImage createdAt readingTime')
      .lean()
  ]);

  // Serialize MongoDB objects
  const posts = postsRaw.map(post => ({
    ...post,
    _id: post._id,
    createdAt: post.createdAt?.toISOString(),
    updatedAt: post.updatedAt?.toISOString()
  }));

  const featuredPosts = featuredPostsRaw.map(post => ({
    ...post,
    _id: post._id,
    slug: post.slug,
    createdAt: post.createdAt?.toISOString(),
    updatedAt: post.updatedAt?.toISOString()
  }));

  return {
    posts,
    totalPosts,
    featuredPosts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit)
  };
} 