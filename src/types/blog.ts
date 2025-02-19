export interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    categories?: string[];
    tags?: string[];
    featuredImage?: string;
    createdAt: string;
    updatedAt?: string;
    readingTime: number;
    author: string;
    isPublished: boolean;
    isFeatured?: boolean;
    priority?: number;
  }
  
  export interface BlogContent {
    posts: BlogPost[];
    totalPosts: number;
    featuredPosts: BlogPost[];
    currentPage: number;
    totalPages: number;
  }
  
  export interface SearchParams {
    tag?: string;
    category?: string;
    q?: string;
    page?: string;
    sort?: 'latest' | 'popular';
  }