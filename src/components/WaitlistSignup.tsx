"use client";

import { useState } from "react";
import { Mail, Check, Leaf, Store, ShoppingBag, Loader2 } from "lucide-react";

interface WaitlistSignupProps {
  cityName?: string;
  variant?: "homepage" | "city" | "inline";
}

export default function WaitlistSignup({
  cityName,
  variant = "inline",
}: WaitlistSignupProps) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [city, setCity] = useState(cityName || "");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          city: city || null,
          userType: userType || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setMessage(data.message || "You're on the list!");
      } else {
        setError(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setError("Couldn't connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-2xl shadow-warm border border-cream-200/60 p-5 text-center animate-fade-in-up">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage-100 flex items-center justify-center">
          <Check className="w-6 h-6 text-sage-600" strokeWidth={2.5} />
        </div>
        <p className="text-ink font-bold font-serif text-lg mb-1">
          {message || "You're on the list! 🎉"}
        </p>
        <p className="text-ink-muted text-sm">
          We&apos;ll let you know when FreshFinds launches
          {cityName ? ` in ${cityName}` : " in your area"}.
        </p>
      </div>
    );
  }

  if (variant === "homepage") {
    return (
      <div className="bg-card rounded-3xl shadow-warm-lg border border-cream-200/60 p-6 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-honey-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-honey-600" />
          </div>
          <h2 className="text-lg font-bold font-serif text-ink">
            Get notified when we launch
          </h2>
        </div>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          FreshFinds is growing fast. Drop your email and we&apos;ll let you know when
          there are vendors in your area — plus early access to new features.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-2xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUserType(userType === "buyer" ? "" : "buyer")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                userType === "buyer"
                  ? "bg-sage-50 border-sage-300 text-sage-700 shadow-warm"
                  : "bg-cream-50 border-cream-200 text-ink-muted hover:bg-cream-100"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> I&apos;m a buyer
            </button>
            <button
              type="button"
              onClick={() => setUserType(userType === "seller" ? "" : "seller")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                userType === "seller"
                  ? "bg-terra-50 border-terra-300 text-terra-700 shadow-warm"
                  : "bg-cream-50 border-cream-200 text-ink-muted hover:bg-cream-100"
              }`}
            >
              <Store className="w-3.5 h-3.5" /> I&apos;m a seller
            </button>
          </div>
          {error && (
            <p className="text-xs text-terra-500 font-medium">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terra-500 text-white font-bold py-3 rounded-2xl hover:bg-terra-400 transition-all shadow-warm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Joining...
              </>
            ) : (
              <>
                <Leaf className="w-4 h-4" /> Join the Waitlist
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-ink-muted mt-3 text-center">
          No spam, ever. Just launch updates and fresh food alerts.
        </p>
      </div>
    );
  }

  // Default: inline variant (for city pages, sidebar, etc.)
  return (
    <div className="bg-card rounded-2xl shadow-warm border border-cream-200/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-sage-500" />
        <h3 className="text-sm font-bold font-serif text-ink">
          Get notified{cityName ? ` about ${cityName}` : ""}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-sage-500 text-white rounded-xl text-sm font-bold hover:bg-sage-400 transition-all shadow-warm active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Notify Me"
            )}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUserType(userType === "buyer" ? "" : "buyer")}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all border ${
              userType === "buyer"
                ? "bg-sage-50 border-sage-300 text-sage-700"
                : "bg-cream-50 border-cream-200 text-ink-muted hover:bg-cream-100"
            }`}
          >
            <ShoppingBag className="w-3 h-3 inline mr-1" /> Buyer
          </button>
          <button
            type="button"
            onClick={() => setUserType(userType === "seller" ? "" : "seller")}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all border ${
              userType === "seller"
                ? "bg-terra-50 border-terra-300 text-terra-700"
                : "bg-cream-50 border-cream-200 text-ink-muted hover:bg-cream-100"
            }`}
          >
            <Store className="w-3 h-3 inline mr-1" /> Seller
          </button>
        </div>
        {error && (
          <p className="text-xs text-terra-500 font-medium">{error}</p>
        )}
      </form>
    </div>
  );
}
