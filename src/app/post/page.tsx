"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Clock,
  Package,
  Check,
  Sparkles,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
type PostTypeKey = "baked_today" | "harvested_today" | "just_made" | "limited_batch" | "available_now";

interface PostTypeOption {
  key: PostTypeKey;
  emoji: string;
  label: string;
  desc: string;
}

interface FormState {
  vendorId: string;
  itemName: string;
  description: string;
  price: string;
  quantity: string;
  photoUrl: string;
  postType: PostTypeKey;
  dietaryTags: string[];
  pickupStartHour: string;
  pickupStartAmPm: string;
  pickupEndHour: string;
  pickupEndAmPm: string;
}

/* ── Constants ─────────────────────────────────────────────── */
const POST_TYPES: PostTypeOption[] = [
  { key: "baked_today", emoji: "🥖", label: "Baked Today", desc: "Fresh from the oven this morning" },
  { key: "harvested_today", emoji: "🌽", label: "Harvested Today", desc: "Picked fresh today" },
  { key: "just_made", emoji: "🍪", label: "Just Made", desc: "Cooling on the rack right now" },
  { key: "limited_batch", emoji: "✨", label: "Limited Batch", desc: "Small batch — exclusive" },
  { key: "available_now", emoji: "🛒", label: "Available Now", desc: "Ready for pickup" },
];

const DIETARY_OPTIONS = [
  "gluten-free", "vegan", "vegetarian", "dairy-free", "nut-free", "keto", "organic",
];

/* ── Helpers ───────────────────────────────────────────────── */
function getEmptyForm(): FormState {
  return {
    vendorId: "",
    itemName: "",
    description: "",
    price: "",
    quantity: "",
    photoUrl: "",
    postType: "baked_today",
    dietaryTags: [],
    pickupStartHour: "8",
    pickupStartAmPm: "AM",
    pickupEndHour: "2",
    pickupEndAmPm: "PM",
  };
}

function buildPickupTime(hour: string, ampm: string): string {
  const now = new Date();
  const h = parseInt(hour) || 8;
  const adjusted = ampm === "PM" && h < 12 ? h + 12 : ampm === "AM" && h === 12 ? 0 : h;
  now.setHours(adjusted, 0, 0, 0);
  return now.toISOString();
}

/* ── Component ─────────────────────────────────────────────── */
export default function PostPage() {
  const [form, setForm] = useState<FormState>(getEmptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedListing, setCompletedListing] = useState<{ id: number; title: string; vendorId: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const update = (patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setError(null);
  };

  const toggleDietaryTag = (tag: string) => {
    const next = form.dietaryTags.includes(tag)
      ? form.dietaryTags.filter((t) => t !== tag)
      : [...form.dietaryTags, tag];
    update({ dietaryTags: next });
  };

  const isValid =
    form.itemName.trim().length >= 2 &&
    form.description.trim().length >= 5 &&
    form.price !== "" &&
    !isNaN(parseFloat(form.price)) &&
    parseFloat(form.price) > 0 &&
    form.vendorId !== "" &&
    !isNaN(parseInt(form.vendorId));

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const pickupStart = buildPickupTime(form.pickupStartHour, form.pickupStartAmPm);
      const pickupEnd = buildPickupTime(form.pickupEndHour, form.pickupEndAmPm);

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: parseInt(form.vendorId),
          title: form.itemName,
          description: form.description,
          price: parseFloat(form.price),
          quantity: form.quantity ? parseInt(form.quantity) : null,
          photoUrl: form.photoUrl || null,
          dietaryTags: form.dietaryTags,
          postType: form.postType,
          pickupWindowStart: pickupStart,
          pickupWindowEnd: pickupEnd,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to post listing");
      }

      const data = await res.json();
      setCompleted(true);
      setCompletedListing({ id: data.listing.id, title: data.listing.title, vendorId: data.listing.vendorId });
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen ──────────────────────────────────────── */
  if (completed && showSuccess) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-cream-50">
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center shadow-warm animate-fade-in-up">
            <Sparkles className="w-12 h-12 text-sage-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold font-serif text-ink mb-3 animate-fade-in-up">
            🎉 Your fresh items are live!
          </h1>
          <p className="text-ink-muted mb-6 max-w-xs leading-relaxed animate-fade-in-up">
            Customers can now see <strong className="text-ink">{completedListing?.title}</strong> in the Fresh Right Now feed!
          </p>

          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-5 w-full space-y-3 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-3 text-sm text-ink-light font-medium">
              <Check className="w-5 h-5 text-sage-600 flex-shrink-0" />
              <span>Appears in &ldquo;Fresh Right Now&rdquo; feed</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-light font-medium">
              <Check className="w-5 h-5 text-sage-600 flex-shrink-0" />
              <span>Visible on the map with fresh indicator</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-light font-medium">
              <Check className="w-5 h-5 text-sage-600 flex-shrink-0" />
              <span>Auto-expires in 24 hours</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Link
              href="/feed"
              className="block w-full bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm text-center active:scale-[0.98]"
            >
              View in Feed →
            </Link>
            <button
              onClick={() => { setForm(getEmptyForm()); setCompleted(false); setShowSuccess(false); setCompletedListing(null); }}
              className="block w-full bg-card text-sage-600 font-bold py-3.5 rounded-2xl border-2 border-sage-200 hover:border-sage-400 transition-all text-center"
            >
              Post Another Item
            </button>
            <Link
              href="/"
              className="block text-center text-sm text-ink-muted hover:text-ink-light mt-2 font-medium"
            >
              ← Back to Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* Header */}
      <div className="bg-cream-50/95 backdrop-blur-md border-b border-cream-200/60 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <Link href="/feed" className="text-ink-muted hover:text-ink mr-3 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold font-serif text-ink">Post a Fresh Item</h1>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Intro card */}
        <div className="bg-gradient-to-br from-honey-100/50 to-cream-50 rounded-3xl border border-honey-200/30 p-5 mb-6 shadow-warm">
          <h2 className="text-lg font-bold font-serif text-ink mb-1">
            What&apos;s fresh right now? 🍞
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            Post what you just made — it&apos;ll appear in the Fresh Right Now feed for hungry customers near you!
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-terra-50 border border-terra-200 rounded-2xl p-4 text-sm text-terra-700 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6 space-y-5">
          {/* Vendor ID */}
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">
              Your Vendor ID <span className="text-terra-500">*</span>
            </label>
            <input
              type="number"
              value={form.vendorId}
              onChange={(e) => update({ vendorId: e.target.value })}
              placeholder="e.g., 100 (from your onboarding)"
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
            />
            <p className="text-xs text-ink-muted mt-1">
              Find this on your vendor dashboard after onboarding.
            </p>
          </div>

          {/* Post Type Selector */}
          <div>
            <label className="block text-sm font-bold text-ink mb-2">
              Post Type <span className="text-terra-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {POST_TYPES.map((pt) => (
                <button
                  key={pt.key}
                  type="button"
                  onClick={() => update({ postType: pt.key })}
                  className={`text-left p-3 rounded-2xl border transition-all ${
                    form.postType === pt.key
                      ? "border-sage-400 bg-sage-50 shadow-warm scale-[1.02]"
                      : "border-cream-200 hover:bg-cream-50"
                  }`}
                >
                  <span className="text-2xl">{pt.emoji}</span>
                  <p className={`text-sm font-bold mt-1 ${form.postType === pt.key ? "text-sage-700" : "text-ink"}`}>
                    {pt.label}
                  </p>
                  <p className="text-xs text-ink-muted">{pt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">
              Item Name <span className="text-terra-500">*</span>
            </label>
            <input
              type="text"
              value={form.itemName}
              onChange={(e) => update({ itemName: e.target.value })}
              placeholder="e.g., Classic Country Loaf"
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">
              Short Description <span className="text-terra-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Describe your item — what makes it special?"
              rows={3}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none resize-none font-sans"
            />
          </div>

          {/* Price + Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                Price ($) <span className="text-terra-500">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update({ price: e.target.value })}
                placeholder="8.50"
                step="0.01" min="0"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => update({ quantity: e.target.value })}
                placeholder="e.g., 5"
                min="1"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Photo URL</label>
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => update({ photoUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
            />
            {form.photoUrl && (
              <div className="mt-2 aspect-[16/9] rounded-2xl bg-cream-100 overflow-hidden shadow-warm">
                <img
                  src={form.photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </div>

          {/* Pickup Window */}
          <div>
            <label className="block text-sm font-bold text-ink mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Pickup Window Today
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1 block">Start</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={form.pickupStartHour}
                    onChange={(e) => update({ pickupStartHour: e.target.value })}
                    min="1" max="12"
                    className="w-16 px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-center text-ink focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => update({ pickupStartAmPm: form.pickupStartAmPm === "AM" ? "PM" : "AM" })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      form.pickupStartAmPm === "AM"
                        ? "bg-honey-100 text-honey-700 border border-honey-300"
                        : "bg-cream-100 text-ink-muted border border-cream-200"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => update({ pickupStartAmPm: form.pickupStartAmPm === "PM" ? "AM" : "PM" })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      form.pickupStartAmPm === "PM"
                        ? "bg-sage-100 text-sage-700 border border-sage-300"
                        : "bg-cream-100 text-ink-muted border border-cream-200"
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1 block">End</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={form.pickupEndHour}
                    onChange={(e) => update({ pickupEndHour: e.target.value })}
                    min="1" max="12"
                    className="w-16 px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-center text-ink focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => update({ pickupEndAmPm: form.pickupEndAmPm === "AM" ? "PM" : "AM" })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      form.pickupEndAmPm === "AM"
                        ? "bg-honey-100 text-honey-700 border border-honey-300"
                        : "bg-cream-100 text-ink-muted border border-cream-200"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => update({ pickupEndAmPm: form.pickupEndAmPm === "PM" ? "AM" : "PM" })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      form.pickupEndAmPm === "PM"
                        ? "bg-sage-100 text-sage-700 border border-sage-300"
                        : "bg-cream-100 text-ink-muted border border-cream-200"
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-bold text-ink mb-2">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((tag) => {
                const selected = form.dietaryTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all ${
                      selected
                        ? "bg-honey-500 text-white shadow-warm"
                        : "bg-cream-100 text-ink-light hover:bg-cream-200"
                    }`}
                  >
                    {selected ? "✓ " : ""}{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`mt-6 w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            isValid && !submitting
              ? "bg-terra-500 text-white hover:bg-terra-400 shadow-warm-lg active:scale-[0.98]"
              : "bg-cream-200 text-ink-muted cursor-not-allowed"
          }`}
        >
          {submitting ? (
            <>
              <span className="animate-spin">⏳</span> Posting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Post to Fresh Right Now
            </>
          )}
        </button>
      </div>

      <div className="h-24" />
    </div>
  );
}
