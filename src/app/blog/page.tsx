import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Cottage Food Guides — FreshFinds",
  description:
    "Free guides on cottage food laws for every state. Learn how to sell homemade food legally, what foods you can sell, and how to get started — all from your home kitchen.",
  openGraph: {
    title: "Cottage Food Guides — Start Selling Homemade Food",
    description:
      "Free guides on cottage food laws for every state. Learn how to sell homemade food legally from your home kitchen.",
    type: "website",
  },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-sage-50 to-cream-50 pt-8 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-sm font-bold px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4" />
            Free Guides
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-ink mb-4 leading-tight">
            Cottage Food Guides
          </h1>
          <p className="text-ink-light text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Everything you need to know about selling homemade food in your state.
            Free, detailed, and updated for 2026.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-card rounded-2xl shadow-warm border border-cream-200/60 overflow-hidden hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden bg-cream-100 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold bg-sage-50 text-sage-600 px-2 py-0.5 rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg font-bold font-serif text-ink mb-2 leading-snug group-hover:text-sage-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-ink-light leading-relaxed mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-sage-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Read more
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {BLOG_POSTS.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-100 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-ink-muted" />
              </div>
              <p className="text-ink-muted text-lg font-medium">
                More guides coming soon!
              </p>
              <p className="text-ink-muted/70 text-sm mt-1">
                We're working on cottage food guides for every state.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto bg-sage-50 rounded-3xl p-8 text-center border border-sage-200/60 shadow-warm">
          <h2 className="text-xl font-bold font-serif text-ink mb-3">
            Ready to start selling?
          </h2>
          <p className="text-ink-light text-sm mb-6 max-w-md mx-auto">
            FreshFinds helps cottage food vendors get discovered by local customers. List your products for free — no fees, ever.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-terra-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98]"
          >
            Start Selling — It's Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
