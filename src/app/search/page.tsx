"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Package,
  Store,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface VendorResult {
  id: number;
  businessName: string;
  lat: number;
  lng: number;
  address: string;
  photoUrl: string | null;
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
  rating: number;
  reviewCount: number;
  hasFreshItems: boolean;
  bio?: string;
}

interface ListingResult {
  id: number;
  title: string;
  description: string;
  price: number | null;
  quantity: number | null;
  photoUrl: string | null;
  dietaryTags: string | null;
  vendorName: string;
  vendorId: number;
  categoryIcon: string | null;
  postType: string;
}

function parseDietaryTags(tags: string | null): string[] {
  if (!tags) return [];
  try { return JSON.parse(tags); } catch { return []; }
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<{ vendors: VendorResult[]; listings: ListingResult[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-cream-50/95 backdrop-blur border-b border-cream-200/60">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex-shrink-0 w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-ink" />
          </Link>
          <div className="flex-1 bg-card rounded-full border border-cream-200/60 flex items-center gap-2 px-4 py-2.5 shadow-warm">
            <Search className="w-4 h-4 text-ink-muted" strokeWidth={2} />
            <span className="text-sm text-ink font-medium">{query}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-sage-500 animate-spin" />
          </div>
        ) : !results ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-ink-muted mx-auto mb-4" strokeWidth={1} />
            <p className="text-ink-light font-bold font-serif text-lg mb-1">Search FreshFinds</p>
            <p className="text-ink-muted text-sm">Find local vendors, fresh items, and more.</p>
          </div>
        ) : results.total === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-ink-muted mx-auto mb-4" strokeWidth={1} />
            <p className="text-ink-light font-bold font-serif text-lg mb-1">No results for "{query}"</p>
            <p className="text-ink-muted text-sm mb-6">Try a different search term or browse the map.</p>
            <div className="flex flex-col items-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 bg-terra-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm">
                Browse Map →
              </Link>
              <Link href="/onboarding" className="text-sm font-semibold text-sage-600 hover:text-sage-500 transition-colors">
                🌱 Don&apos;t see your favorite vendor? Invite them to join!
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-muted mb-4">
              {results.total} result{results.total !== 1 ? "s" : ""} for "{query}"
            </p>

            {/* Vendors section */}
            {results.vendors.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-bold text-ink-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Store className="w-4 h-4" /> Vendors ({results.vendors.length})
                </h2>
                <div className="space-y-3">
                  {results.vendors.map((v) => (
                    <Link
                      key={v.id}
                      href={`/vendor/${v.id}`}
                      className="block bg-card rounded-2xl shadow-warm border border-cream-200/60 p-4 card-hover"
                    >
                      <div className="flex items-center gap-3">
                        {v.photoUrl ? (
                          <img src={v.photoUrl} alt={v.businessName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-xl flex-shrink-0">
                            {v.categoryIcon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-ink font-serif truncate">{v.businessName}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-ink-muted">{v.categoryIcon} {v.categoryName}</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-honey-500 fill-honey-500" />
                              <span className="text-xs font-bold text-ink">{v.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {v.address}
                          </p>
                        </div>
                        {v.hasFreshItems && (
                          <span className="flex-shrink-0 bg-sage-50 text-sage-600 text-xs font-bold px-2 py-1 rounded-full border border-sage-200/40">
                            Fresh
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Listings section */}
            {results.listings.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-ink-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Items ({results.listings.length})
                </h2>
                <div className="space-y-3">
                  {results.listings.map((l) => (
                    <Link
                      key={`listing-${l.id}`}
                      href={`/vendor/${l.vendorId}`}
                      className="block bg-card rounded-2xl shadow-warm border border-cream-200/60 overflow-hidden card-hover"
                    >
                      <div className="flex">
                        <div className="w-24 h-24 flex-shrink-0 bg-cream-100">
                          {l.photoUrl ? (
                            <img src={l.photoUrl} alt={l.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              {l.categoryIcon || "📦"}
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-ink font-serif line-clamp-1">{l.title}</h3>
                            {l.price !== null && (
                              <span className="text-sage-600 font-bold text-sm whitespace-nowrap bg-sage-50 px-2 py-0.5 rounded-lg">
                                ${l.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{l.description}</p>
                          <p className="text-xs text-ink-muted mt-1">by {l.vendorName}</p>
                          {l.dietaryTags && parseDietaryTags(l.dietaryTags).length > 0 && (
                            <div className="flex gap-1 mt-1.5 flex-wrap">
                              {parseDietaryTags(l.dietaryTags).slice(0, 3).map((tag) => (
                                <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full font-semibold border bg-sage-50 text-sage-700 border-sage-200/40">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <div className="pb-20" />
    </div>
  );
}
