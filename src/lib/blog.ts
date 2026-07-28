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
  {
    slug: "sell-homemade-food-north-carolina-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in North Carolina — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "North Carolina requires zero permits, licenses, or inspections to start selling homemade food. Plus, you can sell to restaurants and retail stores — a rare privilege nationwide.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=1200&q=80",
    tags: ["North Carolina", "cottage food", "home bakery", "food law", "Charlotte", "Raleigh", "Asheville"],
  },
  {
    slug: "sell-homemade-food-south-carolina-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in South Carolina — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "South Carolina's cottage food law requires no permit, no kitchen inspection, and has no sales cap. Start your home bakery in Charleston, Greenville, or Columbia for $0.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=1200&q=80",
    tags: ["South Carolina", "cottage food", "home bakery", "food law", "Charleston", "Greenville", "Columbia"],
  },
  {
    slug: "sell-homemade-food-texas-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Texas — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Texas allows cottage food sales up to $150,000/year with just a $7 food handler course. Sell at farmers markets, online, and even to restaurants and retail stores.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    tags: ["Texas", "cottage food", "home bakery", "food law", "Austin", "Dallas", "Houston", "San Antonio"],
  },
  {
    slug: "sell-homemade-food-virginia-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Virginia — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Virginia's two-tier cottage food system lets you start with zero paperwork and upgrade to restaurant/retail sales when ready. No sales cap at either tier.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80",
    tags: ["Virginia", "cottage food", "home bakery", "food law", "Richmond", "Norfolk", "Arlington"],
  },
  {
    slug: "sell-homemade-food-arkansas-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Arkansas — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Arkansas's 2021 Food Freedom Act lets you start selling homemade food with zero permits, licenses, or inspections. Retail sales allowed — one of the most permissive laws in the country.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1464305795204-6f83bb17c7e6?w=1200&q=80",
    tags: ["Arkansas", "cottage food", "home bakery", "food law", "Little Rock", "Fayetteville"],
  },
  {
    slug: "sell-homemade-food-kansas-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Kansas — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Kansas requires no license, permit, or kitchen inspection for cottage food sales. Just register for a sales tax ID and you're ready to sell across the Sunflower State.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    tags: ["Kansas", "cottage food", "home bakery", "food law", "Wichita", "Kansas City", "Lawrence"],
  },
  {
    slug: "sell-homemade-food-florida-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Florida — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Florida's cottage food law requires zero permits, licenses, or inspections — and has a $250,000 annual sales cap, one of the highest in the nation. Start your home bakery in Miami, Tampa, or Orlando for $0.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=1200&q=80",
    tags: ["Florida", "cottage food", "home bakery", "food law", "Miami", "Tampa", "Orlando", "Jacksonville"],
  },
  {
    slug: "sell-homemade-food-georgia-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Georgia — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Georgia has no sales cap, allows sales to restaurants and retail stores, and only requires a $7 food safety course. One of the most permissive cottage food states in the country.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    tags: ["Georgia", "cottage food", "home bakery", "food law", "Atlanta", "Savannah", "Athens"],
  },
  {
    slug: "sell-homemade-food-alabama-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Alabama — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Alabama's 2021 amendment removed the sales cap and expanded allowed foods. Just complete a food safety course and get county health department approval to start selling.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=1200&q=80",
    tags: ["Alabama", "cottage food", "home bakery", "food law", "Birmingham", "Huntsville", "Montgomery", "Mobile"],
  },
  {
    slug: "sell-homemade-food-mississippi-cottage-food-law-guide-2026",
    title: "How to Sell Homemade Food in Mississippi — A Complete Guide to Cottage Food Laws (2026)",
    description:
      "Mississippi requires zero paperwork to start — no permit, license, or inspection. But with a $35K sales cap and no online sales, here's what MS home bakers need to know.",
    date: "2026-07-28",
    author: "FreshFinds Team",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    tags: ["Mississippi", "cottage food", "home bakery", "food law", "Jackson", "Oxford", "Hattiesburg", "Gulfport"],
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
