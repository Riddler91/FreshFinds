"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertTriangle, Check } from "lucide-react";

/* ── Constants ─────────────────────────────────────────────── */
const CATEGORIES = [
  { name: "Bread & Pastries", slug: "bread-pastries", icon: "🥖" },
  { name: "Eggs & Dairy", slug: "eggs-dairy", icon: "🥚" },
  { name: "Honey & Preserves", slug: "honey-preserves", icon: "🍯" },
  { name: "Desserts & Sweets", slug: "desserts", icon: "🥧" },
  { name: "Fresh Produce", slug: "produce", icon: "🌽" },
  { name: "Meals & Prepared", slug: "meals", icon: "🍽️" },
  { name: "Flowers & Plants", slug: "flowers", icon: "🌼" },
  { name: "Meat & Poultry", slug: "meat", icon: "🥩" },
  { name: "Food Truck", slug: "food-truck", icon: "🚚" },
  { name: "Other", slug: "other", icon: "📦" },
];

/* ── Types ─────────────────────────────────────────────────── */
interface VendorData {
  id: number;
  businessName: string;
  bio: string | null;
  photoUrl: string | null;
  phone: string | null;
  website: string | null;
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
  city: string;
  acceptsMessages: boolean;
}

/* ── Component ─────────────────────────────────────────────── */
export default function EditVendorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const vendorId = params.id as string;
  const token = searchParams.get("token") || "";

  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  // Fetch vendor data
  useEffect(() => {
    if (!vendorId) return;
    fetch(`/api/vendors?id=${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vendor) {
          setVendor({
            id: data.vendor.id,
            businessName: data.vendor.businessName || "",
            bio: data.vendor.bio || "",
            photoUrl: data.vendor.photoUrl || "",
            phone: data.vendor.phone || "",
            website: data.vendor.website || "",
            categoryName: data.vendor.categoryName || "Other",
            categorySlug: data.vendor.categorySlug || "other",
            categoryIcon: data.vendor.categoryIcon || "📦",
            city: data.vendor.city || "",
            acceptsMessages: data.vendor.acceptsMessages || false,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vendorId]);

  const update = useCallback((patch: Partial<VendorData>) => {
    setVendor((prev) => (prev ? { ...prev, ...patch } : null));
    setSaved(false);
  }, []);

  const handleSubmit = async () => {
    if (!vendor) return;
    setSaving(true);
    setError(null);

    try {
      const cat = CATEGORIES.find((c) => c.slug === vendor.categorySlug) || CATEGORIES[9];

      const res = await fetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: vendor.id,
          token,
          businessName: vendor.businessName,
          bio: vendor.bio,
          photoUrl: vendor.photoUrl,
          phone: vendor.phone,
          website: vendor.website,
          categoryName: cat.name,
          categorySlug: cat.slug,
          categoryIcon: cat.icon,
          city: vendor.city,
          acceptsMessages: vendor.acceptsMessages,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 403) {
          setAuthError(true);
          throw new Error("Invalid edit token");
        }
        throw new Error(errData.error || "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-cream-50">
        <div className="animate-pulse max-w-lg mx-auto w-full px-4 py-6">
          <div className="skeleton-warm h-6 w-1/3 mb-6" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="skeleton-warm h-5 w-24 mb-2 rounded-lg" />
                <div className="skeleton-warm h-12 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Auth error ─────────────────────────────────────────── */
  if (authError) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-cream-50">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-terra-50 flex items-center justify-center shadow-warm">
              <AlertTriangle className="w-10 h-10 text-terra-500" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-ink mb-3">
              Invalid Access
            </h1>
            <p className="text-ink-muted text-sm leading-relaxed mb-6">
              The edit link you used is invalid or has expired. Please use the link
              provided when you created your storefront.
            </p>
            <Link
              href={`/vendor/${vendorId}`}
              className="inline-flex items-center gap-2 bg-terra-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm"
            >
              <ArrowLeft className="w-4 h-4" /> View Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-cream-50">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-ink-muted">Vendor not found.</p>
        </div>
      </div>
    );
  }

  /* ── Edit form ──────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* Header */}
      <div className="bg-cream-50/95 backdrop-blur-md border-b border-cream-200/60 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/vendor/${vendorId}`}
            className="text-ink-muted hover:text-ink mr-3 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold font-serif text-ink">Edit Storefront</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Bookmark reminder */}
        <div className="bg-honey-50 border border-honey-200 rounded-2xl p-4 mb-6 text-sm text-honey-800 font-semibold">
          📌 Bookmark this page! This is how you edit your storefront.
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-terra-50 border border-terra-200 rounded-2xl p-4 text-sm text-terra-700 font-medium">
            {error}
          </div>
        )}

        {/* Success banner */}
        {saved && (
          <div className="mb-4 bg-sage-50 border border-sage-200 rounded-2xl p-4 text-sm text-sage-700 font-medium flex items-center gap-2">
            <Check className="w-4 h-4" /> Changes saved!
          </div>
        )}

        <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6">
          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={vendor.businessName}
                onChange={(e) => update({ businessName: e.target.value })}
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-shadow font-sans"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                Bio
              </label>
              <textarea
                value={vendor.bio || ""}
                onChange={(e) => update({ bio: e.target.value })}
                placeholder="Tell customers about your food..."
                rows={3}
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-shadow font-sans resize-none"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                Photo URL
              </label>
              <input
                type="text"
                value={vendor.photoUrl || ""}
                onChange={(e) => update({ photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-shadow font-sans"
              />
              {vendor.photoUrl && (
                <img
                  src={vendor.photoUrl}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded-2xl border border-cream-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                Phone
              </label>
              <input
                type="text"
                value={vendor.phone || ""}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-shadow font-sans"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                Website
              </label>
              <input
                type="text"
                value={vendor.website || ""}
                onChange={(e) => update({ website: e.target.value })}
                placeholder="https://yourbusiness.com"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-shadow font-sans"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                What you make
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => update({
                      categorySlug: cat.slug,
                      categoryName: cat.name,
                      categoryIcon: cat.icon,
                    })}
                    className={`text-sm px-3 py-3 rounded-2xl border text-left transition-all font-semibold ${
                      vendor.categorySlug === cat.slug
                        ? "border-sage-400 bg-sage-50 text-sage-700 shadow-warm"
                        : "border-cream-200 text-ink-light hover:border-sage-200 hover:bg-cream-50"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                City
              </label>
              <input
                type="text"
                value={vendor.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="e.g., Austin"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-shadow font-sans"
              />
            </div>

            {/* Accepts Messages Toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <label className="text-sm font-bold text-ink">
                  Accept messages
                </label>
                <p className="text-xs text-ink-muted mt-0.5">
                  Let customers send you messages
                </p>
              </div>
              <button
                type="button"
                onClick={() => update({ acceptsMessages: !vendor.acceptsMessages })}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  vendor.acceptsMessages ? "bg-sage-500" : "bg-cream-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    vendor.acceptsMessages ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="mt-6 w-full bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm text-center active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}
