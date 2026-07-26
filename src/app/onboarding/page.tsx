"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────── */
interface FormData {
  // Step 1: Business Info
  businessName: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website: string;
  // Step 2: About
  bio: string;
  photoUrl: string;
  complianceChecked: boolean;
  homeKitchenAck: boolean;
  allowedFoodsAck: boolean;
  labelingAck: boolean;
  // Step 3: First Listing
  itemName: string;
  itemCategory: string;
  itemDescription: string;
  price: string;
  quantity: string;
  itemPhotoUrl: string;
  dietaryTags: string[];
  pickupStart: string;
  pickupEnd: string;
  ingredients: string;
  allergenWarning: string;
}

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

const DIETARY_OPTIONS = [
  "gluten-free",
  "vegan",
  "vegetarian",
  "dairy-free",
  "nut-free",
  "keto",
  "organic",
];

const ITEM_CATEGORIES = [
  "Bread", "Pastry", "Cake", "Cookies", "Pie", "Eggs", "Honey",
  "Jam/Preserves", "Vegetables", "Fruit", "Herbs", "Meal Prep",
  "Dinner", "Lunch", "Flowers", "Plants", "Other",
];

const STORAGE_KEY = "freshfinds_onboarding";

/* ── Helpers ───────────────────────────────────────────────── */
function loadDraft(): FormData {
  if (typeof window === "undefined") return getEmptyForm();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...getEmptyForm(), ...JSON.parse(raw) };
  } catch {}
  return getEmptyForm();
}

function saveDraft(data: FormData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function getEmptyForm(): FormData {
  return {
    businessName: "",
    category: "",
    address: "",
    lat: 30.2672,
    lng: -97.7431,
    phone: "",
    email: "",
    website: "",
    bio: "",
    photoUrl: "",
    complianceChecked: false,
    homeKitchenAck: false,
    allowedFoodsAck: false,
    labelingAck: false,
    itemName: "",
    itemCategory: "",
    itemDescription: "",
    price: "",
    quantity: "",
    itemPhotoUrl: "",
    dietaryTags: [],
    pickupStart: "",
    pickupEnd: "",
    ingredients: "",
    allergenWarning: "",
  };
}

/* ── Component ─────────────────────────────────────────────── */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(getEmptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [createdVendorId, setCreatedVendorId] = useState<number | null>(null);
  const [geolocating, setGeolocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load draft on mount
  useEffect(() => {
    setForm(loadDraft());
  }, []);

  // Save draft on changes
  useEffect(() => {
    saveDraft(form);
  }, [form]);

  const update = useCallback((patch: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setError(null);
  }, []);

  /* ── Geolocation ─────────────────────────────────────────── */
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        // Reverse geocode
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
        )
          .then((r) => r.json())
          .then((data) => {
            if (data.display_name) {
              update({ address: data.display_name });
            }
          })
          .catch(() => {})
          .finally(() => setGeolocating(false));
      },
      () => {
        setGeolocating(false);
        setError("Could not access location. Please enter your address manually.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  /* ── Validation ──────────────────────────────────────────── */
  const step1Valid =
    form.businessName.trim().length >= 2 &&
    form.category !== "" &&
    form.address.trim().length >= 5 &&
    form.email.trim().includes("@");

  const step2Valid =
    form.bio.trim().length >= 10 &&
    form.complianceChecked &&
    form.homeKitchenAck &&
    form.allowedFoodsAck &&
    form.labelingAck;

  const step3Valid =
    form.itemName.trim().length >= 2 &&
    form.itemCategory !== "" &&
    form.itemDescription.trim().length >= 5 &&
    form.price !== "" &&
    !isNaN(parseFloat(form.price)) &&
    parseFloat(form.price) > 0;

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!step3Valid) return;
    setSubmitting(true);
    setError(null);

    try {
      const cat = CATEGORIES.find((c) => c.slug === form.category) || CATEGORIES[9];

      // 1. Create vendor
      const vendorRes = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.businessName,
          businessName: form.businessName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          lat: form.lat,
          lng: form.lng,
          bio: form.bio,
          photoUrl: form.photoUrl,
          categoryName: cat.name,
          categorySlug: cat.slug,
          categoryIcon: cat.icon,
          website: form.website,
        }),
      });

      if (!vendorRes.ok) throw new Error("Failed to create vendor");
      const vendorData = await vendorRes.json();
      const vendorId = vendorData.vendor.id;

      // 2. Create listing
      const listingRes = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          title: form.itemName,
          description: form.itemDescription,
          price: parseFloat(form.price),
          quantity: form.quantity ? parseInt(form.quantity) : null,
          photoUrl: form.itemPhotoUrl,
          dietaryTags: form.dietaryTags,
          pickupWindowStart: form.pickupStart || new Date().toISOString(),
          pickupWindowEnd: form.pickupEnd || new Date(Date.now() + 86400000).toISOString(),
          ingredients: form.ingredients || null,
          allergenWarning: form.allergenWarning || null,
        }),
      });

      if (!listingRes.ok) throw new Error("Failed to create listing");

      setCreatedVendorId(vendorId);
      setCompleted(true);
      clearDraft();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen ──────────────────────────────────────── */
  if (completed) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gray-50">
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col items-center justify-center text-center">
          <span className="text-6xl mb-4">🎉</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You&apos;re live on FreshFinds!
          </h1>
          <p className="text-gray-500 mb-8 max-w-xs">
            Your business and first listing are now visible to hungry Austinites.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>✅</span> Vendor profile created
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>✅</span> First listing published
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>📍</span> Visible on the Austin map
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>🕐</span> Appears in "Fresh Right Now" feed
            </div>
          </div>

          <div className="w-full space-y-3">
            {createdVendorId && (
              <Link
                href={`/vendor/${createdVendorId}`}
                className="block w-full bg-fresh-500 text-white font-semibold py-3 rounded-xl hover:bg-fresh-600 transition-colors text-center"
              >
                View Your Profile →
              </Link>
            )}
            <button
              onClick={() => {
                setStep(1);
                setCompleted(false);
                setCreatedVendorId(null);
                setForm(getEmptyForm());
              }}
              className="block w-full bg-white text-fresh-600 font-semibold py-3 rounded-xl border-2 border-fresh-200 hover:border-fresh-400 transition-colors text-center"
            >
              Add Another Listing
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${form.businessName} on FreshFinds`,
                    text: `Check out ${form.businessName} on FreshFinds — local homemade food, available now!`,
                    url: createdVendorId
                      ? `${window.location.origin}/vendor/${createdVendorId}`
                      : window.location.origin,
                  });
                }
              }}
              className="block w-full bg-white text-gray-700 font-medium py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-center"
            >
              📤 Share Your Profile
            </button>
            <Link
              href="/"
              className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-4"
            >
              ← Back to Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step indicator ──────────────────────────────────────── */
  const stepLabels = ["Business Info", "About You", "First Listing"];

  /* ── Form ────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 mr-3">
            ←
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Sell on FreshFinds</h1>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                    s <= step
                      ? "bg-fresh-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 rounded transition-colors ${
                      s < step ? "bg-fresh-500" : "bg-gray-200"
                    }`}
                  />
                )}
                <span className="hidden sm:block text-xs text-gray-400 flex-shrink-0">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ─── STEP 1: Business Info ─────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🏪 Business Details</h2>

            <div className="space-y-4">
              {/* Business name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => update({ businessName: e.target.value })}
                  placeholder="e.g., ATX Sourdough"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none transition-shadow"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => update({ category: cat.slug })}
                      className={`text-sm px-3 py-2.5 rounded-xl border text-left transition-all ${
                        form.category === cat.slug
                          ? "border-fresh-400 bg-fresh-50 text-fresh-700 font-medium shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Address <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Your pickup address in Austin, TX"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGeolocate}
                    disabled={geolocating}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {geolocating ? "📍..." : "📍 Use My Location"}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  placeholder="(512) 555-0100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update({ website: e.target.value })}
                  placeholder="https://your-site.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all ${
                step1Valid
                  ? "bg-fresh-500 text-white hover:bg-fresh-600 shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ─── STEP 2: About Your Business ───────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 About Your Business</h2>

            <div className="space-y-4">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update({ bio: e.target.value })}
                  placeholder="Tell customers about your food, your process, and what makes it special... (min 10 characters)"
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.bio.length} / 10 minimum characters
                </p>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Photo URL
                </label>
                <input
                  type="url"
                  value={form.photoUrl}
                  onChange={(e) => update({ photoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                />
                {form.photoUrl && (
                  <div className="mt-2 aspect-[2/1] rounded-lg bg-gray-100 overflow-hidden">
                    <img
                      src={form.photoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Paste a URL to an image (Unsplash, Imgur, etc.)
                </p>
              </div>

              {/* Compliance Checklist */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-800 mb-3">
                  ⚖️ Texas Cottage Food Law Compliance
                </h3>
                <p className="text-xs text-amber-700 mb-3">
                  Because you&apos;re selling homemade food in Texas, you must acknowledge the following:
                </p>

                <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.complianceChecked}
                    onChange={(e) => update({ complianceChecked: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-fresh-500 rounded border-gray-300 focus:ring-fresh-500"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>I understand Texas cottage food laws</strong> — I&apos;ve read the{" "}
                    <a
                      href="https://www.dshs.texas.gov/food-manufacturers/cottage-food-production"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fresh-600 underline"
                    >
                      Texas DSHS guidelines
                    </a>{" "}
                    and understand my responsibilities as a cottage food producer.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.homeKitchenAck}
                    onChange={(e) => update({ homeKitchenAck: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-fresh-500 rounded border-gray-300 focus:ring-fresh-500"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>All my products are made in a home kitchen</strong> — not in a commercial
                    facility. I meet all sanitary requirements.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allowedFoodsAck}
                    onChange={(e) => update({ allowedFoodsAck: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-fresh-500 rounded border-gray-300 focus:ring-fresh-500"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>I only sell allowed foods</strong> — no refrigerated items, no meat or
                    dairy products (unless specifically permitted under cottage food law).
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.labelingAck}
                    onChange={(e) => update({ labelingAck: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-fresh-500 rounded border-gray-300 focus:ring-fresh-500"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>I label all products</strong> with the product name, ingredients list,
                    allergen warnings, and &ldquo;This food is made in a home kitchen not inspected
                    by a health department&rdquo; disclaimer.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!step2Valid}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  step2Valid
                    ? "bg-fresh-500 text-white hover:bg-fresh-600 shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: First Listing ──────────────────────────── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📦 Create Your First Listing
            </h2>
            <p className="text-sm text-gray-500 -mt-3 mb-4">
              This is what customers will see in the &ldquo;Fresh Right Now&rdquo; feed.
            </p>

            <div className="space-y-4">
              {/* Item name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.itemName}
                  onChange={(e) => update({ itemName: e.target.value })}
                  placeholder="e.g., Classic Country Loaf"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                />
              </div>

              {/* Item category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.itemCategory}
                  onChange={(e) => update({ itemCategory: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none bg-white"
                >
                  <option value="">Select item type...</option>
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.itemDescription}
                  onChange={(e) => update({ itemDescription: e.target.value })}
                  placeholder="Describe your item — what makes it special? (min 5 characters)"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none resize-none"
                />
              </div>

              {/* Price + Quantity row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => update({ price: e.target.value })}
                    placeholder="8.50"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => update({ quantity: e.target.value })}
                    placeholder="e.g., 5"
                    min="1"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Photo URL
                </label>
                <input
                  type="url"
                  value={form.itemPhotoUrl}
                  onChange={(e) => update({ itemPhotoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                />
              </div>

              {/* Dietary tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((tag) => {
                    const selected = form.dietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const next = selected
                            ? form.dietaryTags.filter((t) => t !== tag)
                            : [...form.dietaryTags, tag];
                          update({ dietaryTags: next });
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selected
                            ? "bg-amber-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {selected ? "✓ " : ""}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pickup window */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Start
                  </label>
                  <input
                    type="datetime-local"
                    value={form.pickupStart}
                    onChange={(e) => update({ pickupStart: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup End
                  </label>
                  <input
                    type="datetime-local"
                    value={form.pickupEnd}
                    onChange={(e) => update({ pickupEnd: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredients List
                </label>
                <textarea
                  value={form.ingredients}
                  onChange={(e) => update({ ingredients: e.target.value })}
                  placeholder="e.g., Organic flour, water, sourdough starter, sea salt"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none resize-none"
                />
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergen Warning
                </label>
                <input
                  type="text"
                  value={form.allergenWarning}
                  onChange={(e) => update({ allergenWarning: e.target.value })}
                  placeholder="e.g., Contains wheat, dairy, nuts"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!step3Valid || submitting}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  step3Valid && !submitting
                    ? "bg-fresh-500 text-white hover:bg-fresh-600 shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Posting...
                  </span>
                ) : (
                  "📤 Post Listing"
                )}
              </button>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
