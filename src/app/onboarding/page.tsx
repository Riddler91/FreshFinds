"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🏪 Sell on FreshFinds
        </h1>
        <p className="text-gray-500 mb-8">
          Get your homemade food, farm stand, or cottage food business in front of
          hungry Austinites.
        </p>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s <= step
                    ? "bg-fresh-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 rounded ${
                    s < step ? "bg-fresh-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Business Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ATX Sourdough"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Maria Rodriguez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Your pickup address in Austin, TX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none"
                    disabled
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full bg-fresh-600 text-white py-2.5 rounded-lg font-semibold hover:bg-fresh-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                What do you sell?
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none bg-white"
                    disabled
                  >
                    <option>Bread & Pastries</option>
                    <option>Fresh Produce</option>
                    <option>Eggs & Dairy</option>
                    <option>Honey & Preserves</option>
                    <option>Meals & Prepared</option>
                    <option>Desserts & Sweets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / Description
                  </label>
                  <textarea
                    placeholder="Tell customers about your food, your process, and what makes it special..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fresh-500 focus:border-fresh-500 outline-none resize-none"
                    disabled
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-fresh-600 text-white py-2.5 rounded-lg font-semibold hover:bg-fresh-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <span className="text-5xl">🎉</span>
              <h2 className="text-lg font-semibold mt-4">You&apos;re all set!</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Onboarding is coming soon. We&apos;ll notify you when vendor
                registration opens in Austin.
              </p>
              <div className="bg-fresh-50 rounded-lg p-4 mt-6 text-left">
                <p className="text-sm font-medium text-fresh-800 mb-2">
                  What happens next:
                </p>
                <ul className="text-sm text-fresh-700 space-y-1">
                  <li>✓ We review your application (1-2 business days)</li>
                  <li>✓ You get access to the vendor dashboard</li>
                  <li>✓ Start posting listings — they appear on the map instantly</li>
                  <li>✓ First 3 months free for early vendors</li>
                </ul>
              </div>
              <Link
                href="/"
                className="mt-6 inline-block w-full bg-fresh-600 text-white py-2.5 rounded-lg font-semibold hover:bg-fresh-700 transition-colors"
              >
                Back to Map
              </Link>
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
