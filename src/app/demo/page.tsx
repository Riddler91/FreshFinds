"use client";

import Link from "next/link";
import {
  MapPin,
  Clock,
  Store,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Star,
} from "lucide-react";

/* ── Demo vendor preview (compact card) ─────────────────────── */
function VendorPreviewCard() {
  return (
    <div className="bg-card rounded-3xl shadow-warm-lg border border-cream-200/40 overflow-hidden max-w-sm mx-auto">
      {/* Cover image */}
      <div className="aspect-[2/1] bg-cream-200 overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
          alt="Fresh baked goods"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        {/* Fresh badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-sage-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-warm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          Fresh Right Now
        </div>
      </div>

      {/* Vendor info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold font-serif text-ink text-lg">
              Your Business Name
            </h3>
            <p className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> Your City, Your State
            </p>
          </div>
          <span className="flex-shrink-0 bg-sage-50 text-sage-700 text-xs font-bold px-2 py-0.5 rounded-full border border-sage-200">
            🥖 Bakery
          </span>
        </div>

        {/* Product cards */}
        <div className="mt-3 flex gap-2 overflow-hidden">
          {[
            {
              title: "Sourdough Loaf",
              price: "$8",
              img: "https://images.unsplash.com/photo-1549931319-c545519f3f10?w=200&q=80",
            },
            {
              title: "Cinnamon Rolls",
              price: "$15",
              img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
            },
            {
              title: "Bagels (dozen)",
              price: "$10",
              img: "https://images.unsplash.com/photo-1611604548018-d56b4b53f958?w=200&q=80",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex-1 bg-cream-50 rounded-2xl overflow-hidden border border-cream-200/40"
            >
              <div className="aspect-square bg-cream-100">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-bold text-ink truncate">
                  {item.title}
                </p>
                <p className="text-xs font-bold text-sage-600">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-3 pt-3 border-t border-cream-200/60 text-center">
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">12</p>
            <p className="text-xs text-ink-muted">Products</p>
          </div>
          <div className="flex-1 border-x border-cream-200/60">
            <p className="text-sm font-bold text-ink flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 text-honey-500 fill-honey-500" /> 4.9
            </p>
            <p className="text-xs text-ink-muted">Rating</p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink flex items-center justify-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500" />
              </span>
              Live
            </p>
            <p className="text-xs text-ink-muted">On Map</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function DemoPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream-50">
      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-sage-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-honey-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-lg mx-auto px-4 pt-12 pb-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-sage-50 text-sage-700 text-sm font-bold px-3 py-1.5 rounded-full border border-sage-200/40 mb-4 animate-fade-in-up">
            <Sparkles className="w-4 h-4" /> For Cottage Food Vendors
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-ink leading-tight animate-fade-in-up">
            Your Food,
            <br />
            <span className="text-sage-600">Discovered Locally</span>
          </h1>

          <p className="mt-4 text-ink-light text-base leading-relaxed max-w-md mx-auto animate-fade-in-up-delay-1">
            Get found by hungry neighbors on the map that shows what&apos;s{" "}
            <strong className="text-ink">fresh right now</strong>. Free
            storefront, 30-second setup.
          </p>

          {/* CTA */}
          <div className="mt-8 animate-fade-in-up-delay-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-terra-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-terra-400 transition-all shadow-warm-md active:scale-[0.98] text-lg"
            >
              Create Your Free Storefront <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-3 text-xs text-ink-muted font-medium">
              No credit card • 30 seconds • Always free
            </p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (3 STEPS) ───────────────────────────── */}
      <section className="max-w-lg mx-auto w-full px-4 py-10">
        <h2 className="text-xl font-bold font-serif text-ink text-center mb-8">
          How It Works
        </h2>

        <div className="space-y-6">
          {[
            {
              step: "1",
              icon: Store,
              title: "Create your profile",
              desc: "Business name, what you make, city. That's it. Takes 30 seconds — seriously.",
              color: "bg-sage-100 text-sage-600 border-sage-200",
            },
            {
              step: "2",
              icon: Sparkles,
              title: "Post what you made today",
              desc: "Snap a photo, set a price, and it goes live on the map instantly. Your neighbors see it in the Fresh Right Now feed.",
              color: "bg-honey-100 text-honey-600 border-honey-200",
            },
            {
              step: "3",
              icon: MapPin,
              title: "Customers find you on the map",
              desc: "They browse the map, see what's fresh nearby, and come to you. No delivery apps, no middlemen.",
              color: "bg-terra-100 text-terra-600 border-terra-200",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className="flex gap-4 items-start animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-ink-muted bg-cream-100 px-2 py-0.5 rounded-full">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-ink text-base">{item.title}</h3>
                <p className="text-sm text-ink-light mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT YOUR STOREFRONT LOOKS LIKE ─────────────────── */}
      <section className="bg-cream-100/50 py-10">
        <div className="max-w-lg mx-auto w-full px-4">
          <h2 className="text-xl font-bold font-serif text-ink text-center mb-2">
            This Is What Your Customers See
          </h2>
          <p className="text-sm text-ink-muted text-center mb-6">
            Your products, on a beautiful storefront, visible on the map
          </p>
          <VendorPreviewCard />
        </div>
      </section>

      {/* ─── VALUE PROPS ─────────────────────────────────────── */}
      <section className="max-w-lg mx-auto w-full px-4 py-10">
        <h2 className="text-xl font-bold font-serif text-ink text-center mb-8">
          Why FreshFinds?
        </h2>

        <div className="grid gap-4">
          {[
            {
              icon: Clock,
              title: "Real-time freshness",
              desc: "Unlike static directories, FreshFinds shows what's available right now. Customers know what's fresh today.",
            },
            {
              icon: MapPin,
              title: "Map-first discovery",
              desc: "Your storefront is pinned on an interactive map. Neighbors browsing their area find you effortlessly.",
            },
            {
              icon: Leaf,
              title: "Built for cottage food",
              desc: "We understand cottage food laws. Only available in states where you can legally sell. Zero permit states prioritized.",
            },
            {
              icon: CheckCircle2,
              title: "Free, always",
              desc: "No listing fees, no commissions, no subscription. We make money from optional promoted spots — someday. Today, we just want you on the map.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-card rounded-2xl p-4 border border-cream-200/40 shadow-warm animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center border border-sage-200/40">
                <item.icon className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm">{item.title}</h3>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── URGENCY / SOCIAL PROOF ───────────────────────────── */}
      <section className="bg-sage-500 text-white">
        <div className="max-w-lg mx-auto w-full px-4 py-10 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-sm font-bold px-3 py-1.5 rounded-full border border-white/20 mb-4">
            🌱 Early Adopter Opportunity
          </div>
          <h2 className="text-2xl font-bold font-serif mb-3">
            Be one of the first vendors in your city
          </h2>
          <p className="text-white/80 text-sm max-w-sm mx-auto leading-relaxed mb-6">
            We&apos;re launching city by city across Tennessee, North Carolina,
            South Carolina, and beyond. The first vendors in each area get
            maximum visibility.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
            {["Nashville", "Knoxville", "Charlotte", "Charleston"].map(
              (city) => (
                <div
                  key={city}
                  className="bg-white/10 rounded-xl px-3 py-2 text-sm font-semibold border border-white/15"
                >
                  📍 {city}
                </div>
              )
            )}
          </div>

          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-white text-sage-600 font-bold px-10 py-4 rounded-2xl hover:bg-cream-50 transition-all shadow-warm-md active:scale-[0.98] text-lg"
          >
            Claim Your Spot — It&apos;s Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="max-w-lg mx-auto w-full px-4 py-12 text-center">
        <div className="bg-card rounded-3xl shadow-warm-lg border border-cream-200/40 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-50 flex items-center justify-center border border-sage-200/40">
            <Leaf className="w-8 h-8 text-sage-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold font-serif text-ink mb-3">
            Ready to get discovered?
          </h2>
          <p className="text-sm text-ink-light mb-6 max-w-xs mx-auto leading-relaxed">
            Your cottage food business deserves to be found. Create your free
            storefront and start appearing on the map today.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-terra-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-terra-400 transition-all shadow-warm-md active:scale-[0.98] text-lg w-full sm:w-auto"
          >
            Start Selling — It&apos;s Free <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="mt-4">
            <Link
              href="/"
              className="text-sm text-sage-600 hover:text-sage-500 font-semibold transition-colors"
            >
              ← Explore the Map
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          © {new Date().getFullYear()} FreshFinds —{" "}
          <Link href="/" className="underline hover:text-ink-light">
            freshfinds.app
          </Link>
        </p>
      </section>
    </div>
  );
}
