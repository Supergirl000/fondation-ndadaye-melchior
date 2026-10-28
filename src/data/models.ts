export interface Picture {
  src: string;
  alt: string;
  position?: string;
  /** Browser-local asset; resolved by the image component, never a persisted object URL. */
  assetId?: string;
  srcSet?: string;
  width?: number;
  height?: number;
}
export interface Organization {
  name: string;
  logo: string;
  tagline: string;
  mission: string;
  colors: Record<
    "forest" | "ivory" | "charcoal" | "terracotta" | "sage",
    string
  >;
  contact: {
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  socialLinks: { label: string; url: string }[];
}
export interface Initiative {
  contentStatus?: "confirmed" | "demo";
  id: string;
  category: string;
  title: string;
  description: string;
  image: Picture;
  detail: string;
}
export interface Article {
  id: string;
  category: string;
  title: string;
  description: string;
  image: Picture;
}
export interface ContentBlock {
  heading: string;
  paragraphs: string[];
}
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  image: Picture;
}
export interface Project extends Initiative {
  slug: string;
  featured: boolean;
  status: string;
  intention: string;
  blocks: ContentBlock[];
  gallery: GalleryItem[];
}
export interface NewsArticle extends Article {
  slug: string;
  featured: boolean;
  publishedAt: string;
  author: string;
  readingMinutes: number;
  blocks: ContentBlock[];
}
export interface TeamPlaceholder {
  id: string;
  role: string;
  description: string;
}
export interface AboutContent {
  intro: string;
  vision: string;
  story: { title: string; body: string }[];
  team: TeamPlaceholder[];
}
