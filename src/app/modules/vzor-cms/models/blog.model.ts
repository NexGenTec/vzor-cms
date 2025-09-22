export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}

export interface CreateBlogPostRequest {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
}