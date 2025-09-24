export interface BlogSection {
  f_title: string;
  f_subtitle: string;
  f_paragraph: string;
  f_img: string[];
  f_media_links: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
  sections: BlogSection[];
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
  sections: BlogSection[];
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
}