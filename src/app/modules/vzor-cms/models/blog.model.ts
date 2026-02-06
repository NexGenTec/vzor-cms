export interface BlogSection {
  f_title: string;
  f_subtitle: string;
  f_paragraph: string;
  f_img: string[];
  f_media_links: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
  sections: BlogSection[];
  mainImageUrl?: string; // Imagen principal del post
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
  mainImageUrl?: string;
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
}