export interface Page {
  id: string;
  imageUrl: string;
  text: string;
  audioUrl?: string;
}

export interface PictureBook {
  _id: string;
  id: string;
  title: string;
  author: string;
  illustrator: string;
  description: string;
  coverImage: string;
  ageRange: '0-3' | '3-6' | '6-9';
  theme: string;
  pages: Page[];
  views: number;
  likes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePictureBookRequest {
  title: string;
  author: string;
  illustrator: string;
  description: string;
  ageRange: '0-3' | '3-6' | '6-9';
  theme: string;
  pages: string;
  coverImage?: File;
}