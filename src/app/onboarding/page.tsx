"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  ClipboardCheck,
  Package,
  Check,
  MapPin,
  Leaf,
  Share2,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
interface FormData {
  businessName: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website: string;
  bio: string;
  photoUrl: string;
  complianceChecked: boolean;
  homeKitchenAck: boolean;
  allowedFoodsAck: boolean;
  labelingAck: boolean;
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
  "gluten-free", "vegan", "vegetarian", "dairy-free",
  "nut-free", "keto", "organic",
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
    businessName: "", category: "", address: "",
    lat: 30.2672, lng: -97.7431, phone: "", email: "", website: "",
    bio: "", photoUrl: "",
    complianceChecked: false, homeKitchenAck: false,
    allowedFoodsAck: false, labelingAck: false,
    itemName: "", itemCategory: "", itemDescription: "",
    price: "", quantity: "", itemPhotoUrl: "", dietaryTags: [],
    pickupStart: "", pickupEnd: "", ingredients: "", allergenWarning: "",
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

  useEffect(() => { setForm(loadDraft()); }, []);
  useEffect(() => { saveDraft(form); }, [form]);

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
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.display_name) update({ address: data.display_name });
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
    form.businessName.trim().length >= 2 && form.category !== "" &&
    form.address.trim().length >= 5 && form.email.trim().includes("@");
  const step2Valid =
    form.bio.trim().length >= 10 && form.complianceChecked &&
    form.homeKitchenAck && form.allowedFoodsAck && form.labelingAck;
  const step3Valid =
    form.itemName.trim().length >= 2 && form.itemCategory !== "" &&
    form.itemDescription.trim().length >= 5 && form.price !== "" &&
    !isNaN(parseFloat(form.price)) && parseFloat(form.price) > 0;

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!step3Valid) return;
    setSubmitting(true);
    setError(null);

    try {
      const cat = CATEGORIES.find((c) => c.slug === form.category) || CATEGORIES[9];

      const vendorRes = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.businessName,
          businessName: form.businessName,
          email: form.email, phone: form.phone,
          address: form.address, lat: form.lat, lng: form.lng,
          bio: form.bio, photoUrl: form.photoUrl,
          categoryName: cat.name, categorySlug: cat.slug,
          categoryIcon: cat.icon, website: form.website,
        }),
      });

      if (!vendorRes.ok) throw new Error("Failed to create vendor");
      const vendorData = await vendorRes.json();
      const vendorId = vendorData.vendor.id;

      const listingRes = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId, title: form.itemName,
          description: form.itemDescription,
          price: parseFloat(form.price),
          quantity: form.quantity ? parseInt(form.quantity) : null,
          photoUrl: form.itemPhotoUrl, dietaryTags: form.dietaryTags,
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
      <div className="flex flex-col min-h-[100dvh] bg-cream-50">
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center shadow-warm">
            <Check className="w-12 h-12 text-sage-600" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold font-serif text-ink mb-3">
            You&apos;re live on FreshFinds!
          </h1>
          <p className="text-ink-muted mb-8 max-w-xs leading-relaxed">
            Your business and first listing are now visible to hungry Austinites. Welcome to the community! 🌿
          </p>

          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6 w-full space-y-3 mb-6">
            {[
              { icon: Check, label: "Vendor profile created", color: "text-sage-600" },
              { icon: Package, label: "First listing published", color: "text-sage-600" },
              { icon: MapPin, label: "Visible on the Austin map", color: "text-terra-500" },
              { icon: Leaf, label: 'Appears in "Fresh Right Now" feed', color: "text-sage-600" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-ink-light font-medium">
                <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                {item.label}
              </div>
            ))}
          </div>

          <div className="w-full space-y-3">
            {createdVendorId && (
              <Link
                href={`/vendor/${createdVendorId}`}
                className="block w-full bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm text-center active:scale-[0.98]"
              >
                View Your Profile →
              </Link>
            )}
            <button
              onClick={() => {
                setStep(1); setCompleted(false);
                setCreatedVendorId(null); setForm(getEmptyForm());
              }}
              className="block w-full bg-card text-sage-600 font-bold py-3.5 rounded-2xl border-2 border-sage-200 hover:border-sage-400 transition-all text-center"
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
              className="flex items-center justify-center gap-2 w-full bg-card text-ink-light font-medium py-3 rounded-2xl border border-cream-200 hover:bg-cream-50 transition-all text-center"
            >
              <Share2 className="w-4 h-4" /> Share Your Profile
            </button>
            <Link
              href="/"
              className="block text-center text-sm text-ink-muted hover:text-ink-light mt-4 font-medium"
            >
              ← Back to Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step indicator ──────────────────────────────────────── */
  const steps = [
    { num: 1, label: "Business Info", icon: Store },
    { num: 2, label: "About You", icon: ClipboardCheck },
    { num: 3, label: "First Listing", icon: Package },
  ];

  /* ── Form ────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* Header */}
      <div className="bg-cream-50/95 backdrop-blur-md border-b border-cream-200/60 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-ink-muted hover:text-ink mr-3 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold font-serif text-ink">Sell on FreshFinds</h1>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Progress steps */}
        <div className="flex items-center gap-1 mb-8">
          {steps.map(({ num, label, icon: Icon }) => {
            const isDone = step > num;
            const isCurrent = step === num;
            return (
              <div key={num} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? "bg-sage-500 text-white shadow-warm"
                        : isCurrent
                        ? "bg-terra-500 text-white shadow-warm scale-110"
                        : "bg-cream-200 text-ink-muted"
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-semibold text-ink-muted hidden sm:block">
                    {label}
                  </span>
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      step > num ? "bg-sage-400" : "bg-cream-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-terra-50 border border-terra-200 rounded-2xl p-4 text-sm text-terra-700 font-medium">
            {error}
          </div>
        )}

        {/* ─── STEP 1: Business Info ─────────────────────────── */}
        {step === 1 && (
          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
                <Store className="w-4 h-4 text-sage-600" />
              </div>
              <h2 className="text-lg font-bold font-serif text-ink">Business Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  Business Name <span className="text-terra-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => update({ businessName: e.target.value })}
                  placeholder="e.g., ATX Sourdough"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none transition-shadow font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  Category <span className="text-terra-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => update({ category: cat.slug })}
                      className={`text-sm px-3 py-3 rounded-2xl border text-left transition-all font-semibold ${
                        form.category === cat.slug
                          ? "border-sage-400 bg-sage-50 text-sage-700 shadow-warm"
                          : "border-cream-200 text-ink-light hover:border-sage-200 hover:bg-cream-50"
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  Pickup Address <span className="text-terra-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Your pickup address in Austin, TX"
                    className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleGeolocate}
                    disabled={geolocating}
                    className="px-4 py-3 bg-sage-100 text-sage-700 rounded-2xl text-sm font-bold hover:bg-sage-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <MapPin className="w-4 h-4" />
                    {geolocating ? "..." : "Locate"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  placeholder="(512) 555-0100"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  Email <span className="text-terra-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Website (optional)</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update({ website: e.target.value })}
                  placeholder="https://your-site.com"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className={`mt-6 w-full py-3.5 rounded-2xl font-bold transition-all ${
                step1Valid
                  ? "bg-terra-500 text-white hover:bg-terra-400 shadow-warm active:scale-[0.98]"
                  : "bg-cream-200 text-ink-muted cursor-not-allowed"
              }`}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ─── STEP 2: About Your Business ───────────────────── */}
        {step === 2 && (
          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4 text-sage-600" />
              </div>
              <h2 className="text-lg font-bold font-serif text-ink">About Your Business</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  Bio <span className="text-terra-500">*</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update({ bio: e.target.value })}
                  placeholder="Tell customers about your food, your process, and what makes it special... (min 10 characters)"
                  rows={4}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none resize-none font-sans"
                />
                <p className="text-xs text-ink-muted mt-1 font-medium">
                  {form.bio.length} / 10 minimum characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Cover Photo URL</label>
                <input
                  type="url"
                  value={form.photoUrl}
                  onChange={(e) => update({ photoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                />
                {form.photoUrl && (
                  <div className="mt-2 aspect-[2/1] rounded-2xl bg-cream-100 overflow-hidden shadow-warm">
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
              </div>

              {/* Compliance Checklist */}
              <div className="bg-honey-50 rounded-3xl p-5 border border-honey-200/40">
                <h3 className="text-sm font-bold text-honey-800 mb-3 font-serif">
                  Texas Cottage Food Law Compliance
                </h3>
                <p className="text-xs text-honey-700 mb-4 leading-relaxed">
                  Because you&apos;re selling homemade food in Texas, please acknowledge the following:
                </p>

                {[
                  {
                    key: "complianceChecked" as const,
                    title: "I understand Texas cottage food laws",
                    desc: "I've read the Texas DSHS guidelines and understand my responsibilities as a cottage food producer.",
                    link: "https://www.dshs.texas.gov/food-manufacturers/cottage-food-production",
                  },
                  {
                    key: "homeKitchenAck" as const,
                    title: "All my products are made in a home kitchen",
                    desc: "Not in a commercial facility. I meet all sanitary requirements.",
                  },
                  {
                    key: "allowedFoodsAck" as const,
                    title: "I only sell allowed foods",
                    desc: "No refrigerated items, no meat or dairy products (unless specifically permitted under cottage food law).",
                  },
                  {
                    key: "labelingAck" as const,
                    title: "I label all products",
                    desc: 'With the product name, ingredients list, allergen warnings, and "This food is made in a home kitchen not inspected by a health department" disclaimer.',
                  },
                ].map(({ key, title, desc, link }) => (
                  <label key={key} className="flex items-start gap-3 mb-3.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => update({ [key]: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-sage-500 rounded-lg border-cream-300 focus:ring-sage-400 flex-shrink-0"
                    />
                    <span className="text-sm text-ink-light leading-relaxed">
                      <strong className="text-ink">{title}</strong> — {desc}
                      {link && (
                        <>
                          {" "}
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sage-600 underline font-semibold"
                          >
                            Read the guidelines
                          </a>
                        </>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-cream-100 text-ink-light py-3.5 rounded-2xl font-bold hover:bg-cream-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!step2Valid}
                className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${
                  step2Valid
                    ? "bg-terra-500 text-white hover:bg-terra-400 shadow-warm active:scale-[0.98]"
                    : "bg-cream-200 text-ink-muted cursor-not-allowed"
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: First Listing ──────────────────────────── */}
        {step === 3 && (
          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-sage-600" />
              </div>
              <h2 className="text-lg font-bold font-serif text-ink">Create Your First Listing</h2>
            </div>
            <p className="text-sm text-ink-muted -mt-3 mb-4">
              This is what customers will see in the &ldquo;Fresh Right Now&rdquo; feed.
            </p>

            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  Item Type <span className="text-terra-500">*</span>
                </label>
                <select
                  value={form.itemCategory}
                  onChange={(e) => update({ itemCategory: e.target.value })}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                >
                  <option value="">Select item type...</option>
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  Description <span className="text-terra-500">*</span>
                </label>
                <textarea
                  value={form.itemDescription}
                  onChange={(e) => update({ itemDescription: e.target.value })}
                  placeholder="Describe your item — what makes it special?"
                  rows={3}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none resize-none font-sans"
                />
              </div>

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

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Item Photo URL</label>
                <input
                  type="url"
                  value={form.itemPhotoUrl}
                  onChange={(e) => update({ itemPhotoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">Dietary Tags</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5">Pickup Start</label>
                  <input
                    type="datetime-local"
                    value={form.pickupStart}
                    onChange={(e) => update({ pickupStart: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-1.5">Pickup End</label>
                  <input
                    type="datetime-local"
                    value={form.pickupEnd}
                    onChange={(e) => update({ pickupEnd: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Ingredients List</label>
                <textarea
                  value={form.ingredients}
                  onChange={(e) => update({ ingredients: e.target.value })}
                  placeholder="e.g., Organic flour, water, sourdough starter, sea salt"
                  rows={2}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Allergen Warning</label>
                <input
                  type="text"
                  value={form.allergenWarning}
                  onChange={(e) => update({ allergenWarning: e.target.value })}
                  placeholder="e.g., Contains wheat, dairy, nuts"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-cream-100 text-ink-light py-3.5 rounded-2xl font-bold hover:bg-cream-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!step3Valid || submitting}
                className={`flex-1 py-3.5 rounded-2xl font-bold transition-all ${
                  step3Valid && !submitting
                    ? "bg-terra-500 text-white hover:bg-terra-400 shadow-warm active:scale-[0.98]"
                    : "bg-cream-200 text-ink-muted cursor-not-allowed"
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

        <div className="h-24" />
      </div>
    </div>
  );
}
