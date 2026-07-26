"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Eye,
  Users,
  MapPin,
  Globe,
  Clock,
  Lock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface Stats {
  totalViews: number;
  todayViews: number;
  uniqueVisitors: number;
  uniqueTodayVisitors: number;
  byCity: { city: string; count: number }[];
  byPage: { path: string; count: number }[];
  recent: { path: string; city: string | null; session_id: string; timestamp: string }[];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Check for existing auth cookie on mount
  useEffect(() => {
    const auth = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ff_admin="));
    if (auth) {
      const val = auth.split("=")[1];
      if (val === "true") {
        setAuthenticated(true);
        fetchStats();
      }
    }
  }, []);

  async function fetchStats() {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/analytics?password=freshfinds2024");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/analytics?password=${encodeURIComponent(password)}`);
      if (res.ok) {
        // Set a simple session cookie (not httpOnly but functional)
        document.cookie = "ff_admin=true; path=/; max-age=86400; SameSite=Lax";
        setAuthenticated(true);
        const data = await res.json();
        setStats(data);
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    document.cookie = "ff_admin=; path=/; max-age=0";
    setAuthenticated(false);
    setStats(null);
    setPassword("");
  }

  // ── Login screen ──────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-warm-lg p-8 text-center">
            <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-sage-600" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink mb-2">
              FreshFinds Admin
            </h1>
            <p className="text-ink-muted text-sm mb-6">
              Enter the admin password to view analytics
            </p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-sm mb-3"
                autoFocus
              />
              {error && (
                <p className="text-terra-500 text-sm mb-3">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 bg-sage-500 text-white rounded-xl font-semibold text-sm hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Checking..." : "View Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 -ml-2 rounded-xl hover:bg-cream-100 transition-colors text-ink-muted hover:text-ink"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="font-serif text-lg font-bold text-ink">
                Analytics
              </h1>
              <p className="text-xs text-ink-muted">FreshFinds Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              disabled={statsLoading}
              className="p-2 rounded-xl hover:bg-cream-100 transition-colors text-ink-muted hover:text-ink"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${statsLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-ink-muted hover:text-terra-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-cream-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {statsLoading && !stats ? (
          <div className="text-center py-12 text-ink-muted">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
            <p>Loading stats...</p>
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={<Eye className="w-5 h-5" />}
                label="Total Views"
                value={stats.totalViews.toLocaleString()}
                color="sage"
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Today"
                value={stats.todayViews.toLocaleString()}
                color="honey"
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Unique Visitors"
                value={stats.uniqueVisitors.toLocaleString()}
                color="terra"
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Today's Uniques"
                value={stats.uniqueTodayVisitors.toLocaleString()}
                color="fresh"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Views by City */}
              <Panel
                icon={<MapPin className="w-4 h-4" />}
                title="Views by City"
              >
                {stats.byCity.length === 0 ? (
                  <p className="text-ink-muted text-sm py-4 text-center">
                    No city data yet
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cream-200">
                        <th className="text-left py-2 text-ink-muted font-medium">
                          City
                        </th>
                        <th className="text-right py-2 text-ink-muted font-medium">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.byCity.map((c, i) => (
                        <tr key={i} className="border-b border-cream-100 last:border-0">
                          <td className="py-2 text-ink">{c.city}</td>
                          <td className="py-2 text-right font-semibold text-ink">
                            {c.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Panel>

              {/* Views by Page */}
              <Panel
                icon={<Globe className="w-4 h-4" />}
                title="Views by Page"
              >
                {stats.byPage.length === 0 ? (
                  <p className="text-ink-muted text-sm py-4 text-center">
                    No page data yet
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-cream-200">
                        <th className="text-left py-2 text-ink-muted font-medium">
                          Page
                        </th>
                        <th className="text-right py-2 text-ink-muted font-medium">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.byPage.map((p, i) => (
                        <tr key={i} className="border-b border-cream-100 last:border-0">
                          <td className="py-2 text-ink font-mono text-xs">
                            {p.path}
                          </td>
                          <td className="py-2 text-right font-semibold text-ink">
                            {p.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Panel>
            </div>

            {/* Recent Activity */}
            <Panel
              icon={<Clock className="w-4 h-4" />}
              title="Recent Activity"
            >
              {stats.recent.length === 0 ? (
                <p className="text-ink-muted text-sm py-4 text-center">
                  No activity yet
                </p>
              ) : (
                <div className="divide-y divide-cream-100">
                  {stats.recent.map((r, i) => (
                    <div
                      key={i}
                      className="py-2.5 flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-ink-muted truncate">
                          {r.path}
                        </span>
                        {r.city && (
                          <span className="text-xs text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full shrink-0">
                            {r.city}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-ink-muted shrink-0 ml-3">
                        {formatTime(r.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </>
        ) : null}
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "sage" | "honey" | "terra" | "fresh";
}) {
  const colors = {
    sage: { bg: "bg-sage-50", text: "text-sage-600" },
    honey: { bg: "bg-honey-50", text: "text-honey-600" },
    terra: { bg: "bg-terra-50", text: "text-terra-600" },
    fresh: { bg: "bg-fresh-50", text: "text-fresh-600" },
  };

  return (
    <div className="bg-white rounded-2xl shadow-warm p-4">
      <div
        className={`w-10 h-10 ${colors[color].bg} rounded-xl flex items-center justify-center mb-3 ${colors[color].text}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-xs text-ink-muted mt-0.5">{label}</p>
    </div>
  );
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-warm overflow-hidden">
      <div className="px-4 py-3 border-b border-cream-100 flex items-center gap-2 text-ink-muted">
        {icon}
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
      </div>
      <div className="px-4 py-2 max-h-80 overflow-y-auto">{children}</div>
    </div>
  );
}
