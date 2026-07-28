"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, Leaf } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
interface FormData {
  businessName: string;
  category: string;
  email: string;
  state: string;
  city: string;
}

/* ── Constants ─────────────────────────────────────────────── */
const STATES = [
  { code: "TX", name: "Texas", compliance: "Texas cottage food law ($150K cap, food handler training)", guidelinesUrl: "https://www.dshs.texas.gov/food-manufacturers/cottage-food-production" },
  { code: "TN", name: "Tennessee", compliance: "No permit required — just follow TN cottage food guidelines", guidelinesUrl: "https://www.tn.gov/health/health-program-areas/eh/eh-fooddefense/cottagefood.html" },
  { code: "NC", name: "North Carolina", compliance: "No permit required — follow NC cottage food guidelines", guidelinesUrl: "https://www.ncagr.gov/fooddrug/food/homebiz.htm" },
  { code: "SC", name: "South Carolina", compliance: "No permit required — follow SC cottage food guidelines", guidelinesUrl: "https://www.scdhec.gov/food-safety/food-safety-manufacturers/cottage-food" },
  { code: "VA", name: "Virginia", compliance: "No permit required — follow VA cottage food guidelines", guidelinesUrl: "https://www.vdh.virginia.gov/environmental-health/food-safety/cottage-foods/" },
  { code: "AR", name: "Arkansas", compliance: "No permit required — follow AR cottage food guidelines", guidelinesUrl: "https://www.healthy.arkansas.gov/programs-services/topics/cottage-foods" },
  { code: "KS", name: "Kansas", compliance: "No permit required — follow KS cottage food guidelines", guidelinesUrl: "https://agriculture.ks.gov/divisions-programs/food-safety-lodging/cottage-foods" },
];
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
  return { businessName: "", category: "", email: "", state: "TX", city: "" };
}

/* ── Component ─────────────────────────────────────────────── */
export default function OnboardingPage() {
  const [form, setForm] = useState<FormData>(getEmptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [createdVendorId, setCreatedVendorId] = useState<number | null>(null);
  const [createdEditToken, setCreatedEditToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setForm(loadDraft()); }, []);
  useEffect(() => { saveDraft(form); }, [form]);

  // Track onboarding-started event
  useEffect(() => {
    try {
      const sid = localStorage.getItem("ff_sid") || "s" + Date.now();
      const city = localStorage.getItem("ff-selected-city") || "";
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "onboarding-started",
          path: "/onboarding",
          city,
          sessionId: sid,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, []);

  const update = useCallback((patch: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setError(null);
  }, []);

  /* ── Validation ──────────────────────────────────────────── */
  const isValid =
    form.businessName.trim().length >= 2 &&
    form.category !== "" &&
    form.email.trim().includes("@") &&
    form.city.trim().length >= 1;

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const cat = CATEGORIES.find((c) => c.slug === form.category) || CATEGORIES[9];

      const vendorRes = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Required fields from form
          name: form.businessName,
          businessName: form.businessName,
          email: form.email,
          state: form.state,
          city: form.city,
          // Category derived from picker
          categoryName: cat.name,
          categorySlug: cat.slug,
          categoryIcon: cat.icon,
          // Defaults for fields not in simplified form
          phone: "",
          address: form.city,
          lat: 0,
          lng: 0,
          bio: "",
          photoUrl: "",
          website: "",
          socialLinks: "",
          acceptsMessages: false,
        }),
      });

      if (!vendorRes.ok) throw new Error("Failed to create vendor");
      const vendorData = await vendorRes.json();
      const vendorId = vendorData.vendor.id;
      const editToken = vendorData.vendor.editToken;

      // Track onboarding-completed event
      try {
        const sid = localStorage.getItem("ff_sid") || "s" + Date.now();
        const city = localStorage.getItem("ff-selected-city") || "";
        fetch("/api/analytics/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "onboarding-completed",
            path: "/onboarding",
            city,
            sessionId: sid,
            properties: JSON.stringify({ vendorId, businessName: form.businessName }),
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {}

      setCreatedVendorId(vendorId);
      setCreatedEditToken(editToken);
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
            🎉 Your storefront is live!
          </h1>
          <p className="text-ink-muted mb-2 max-w-xs leading-relaxed">
            {form.businessName} is now on FreshFinds. Add your first product to start attracting customers! 🌿
          </p>
          {createdEditToken && (
            <div className="bg-honey-50 border border-honey-200 rounded-2xl p-4 mb-6 text-sm text-honey-800 font-semibold">
              📌 Bookmark this page! This is how you edit your storefront.
            </div>
          )}

          <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6 w-full space-y-3 mb-6">
            {[
              { icon: Check, label: "Vendor profile created", color: "text-sage-600" },
              { icon: MapPin, label: `Visible on the ${(STATES.find(s => s.code === form.state) || STATES[0]).name} map`, color: "text-terra-500" },
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
            <Link
              href="/post"
              className="block w-full bg-terra-500 text-white font-bold py-3.5 rounded-2xl hover:bg-terra-400 transition-all shadow-warm text-center active:scale-[0.98]"
            >
              Add your first product →
            </Link>
            {createdVendorId && createdEditToken && (
              <Link
                href={`/vendor/${createdVendorId}/edit?token=${createdEditToken}`}
                className="block w-full bg-card text-sage-600 font-bold py-3.5 rounded-2xl border-2 border-sage-200 hover:border-sage-400 transition-all text-center"
              >
                Complete your profile →
              </Link>
            )}
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
        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-terra-50 border border-terra-200 rounded-2xl p-4 text-sm text-terra-700 font-medium">
            {error}
          </div>
        )}

        <div className="bg-card rounded-3xl shadow-warm border border-cream-200/40 p-6">
          <h2 className="text-lg font-bold font-serif text-ink mb-6">
            Create your storefront
          </h2>

          <div className="space-y-4">
            {/* Business Name */}
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

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                What you make <span className="text-terra-500">*</span>
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

            {/* Email */}
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

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                State <span className="text-terra-500">*</span>
              </label>
              <select
                value={form.state}
                onChange={(e) => update({ state: e.target.value })}
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
              >
                {STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
              <p className="text-xs text-ink-muted mt-1.5 font-medium">
                {(STATES.find((s) => s.code === form.state) || STATES[0]).compliance}
              </p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                City <span className="text-terra-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="e.g., Austin"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className={`mt-6 w-full py-3.5 rounded-2xl font-bold transition-all ${
              isValid && !submitting
                ? "bg-terra-500 text-white hover:bg-terra-400 shadow-warm active:scale-[0.98]"
                : "bg-cream-200 text-ink-muted cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Creating...
              </span>
            ) : (
              "🎉 Create Storefront"
            )}
          </button>

          <p className="text-xs text-ink-muted text-center mt-4 font-medium">
            You can add photos, a bio, and more details after your storefront is created.
          </p>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}
