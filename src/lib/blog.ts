import type { Metadata } from "next";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "sell-homemade-food-tennessee-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Tennessee — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Everything you need to know about Tennessee's cottage food law: no permit, no sales cap, and exactly which foods you can and can't sell. Start your home bakery or food business today for $0.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    tags: ["Tennessee", "cottage food", "home bakery", "food law", "Nashville", "Knoxville", "Chattanooga"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogMetadata(slug: string): Metadata {
  const post = getBlogPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  const baseUrl = process.env.SITE_URL || "https://freshfinds.app";
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}
