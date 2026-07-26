"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Loader2,
  MapPin,
  Star,
} from "lucide-react";

interface Message {
  id: number;
  vendorId: number;
  text: string;
  sender: "consumer" | "vendor";
  createdAt: string;
}

interface VendorInfo {
  id: number;
  businessName: string;
  categoryIcon: string;
  categoryName: string;
  photoUrl: string | null;
  rating: number;
  address: string;
}

export default function MessagesPage() {
  const params = useParams();
  const vendorId = parseInt(params.vendorId as string, 10);

  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch vendor info
  useEffect(() => {
    fetch(`/api/vendors?id=${vendorId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.vendor) setVendor(data.vendor);
      })
      .catch(() => {});
  }, [vendorId]);

  // Fetch messages
  const fetchMessages = useCallback(() => {
    fetch(`/api/messages?vendorId=${vendorId}`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vendorId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, text }),
      });
      if (res.ok) {
        setInput("");
        fetchMessages();
        setToast("Message sent! The vendor will respond soon.");
        setTimeout(() => setToast(null), 3000);
      }
    } catch {}
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[100dvh] bg-cream-50">
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 text-sage-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-cream-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-sage-500 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-warm-lg animate-fade-in-up">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-cream-200/60">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/vendor/${vendorId}`} className="flex-shrink-0 w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-ink" />
          </Link>

          {vendor ? (
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {vendor.photoUrl ? (
                <img src={vendor.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0 text-lg">
                  {vendor.categoryIcon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-sm text-ink font-serif truncate">{vendor.businessName}</h1>
                <p className="text-xs text-ink-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {vendor.address}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <h1 className="font-bold text-sm text-ink font-serif">Messages</h1>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-ink-muted" strokeWidth={1.5} />
            </div>
            <p className="text-ink-light font-bold font-serif text-lg mb-1">Send a message</p>
            <p className="text-ink-muted text-sm max-w-xs">
              Send a message to {vendor?.businessName || "this vendor"} to ask about their products, pickup times, or custom orders.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "consumer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    msg.sender === "consumer"
                      ? "bg-terra-500 text-white rounded-br-md"
                      : "bg-cream-100 text-ink-light rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "consumer" ? "text-white/70" : "text-ink-muted"}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-card border-t border-cream-200/60 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about pickup, ingredients, custom orders..."
            className="flex-1 bg-cream-50 rounded-full px-4 py-2.5 text-sm text-ink placeholder-ink-muted/60 outline-none border border-cream-200/60 focus:border-sage-300 focus:ring-2 focus:ring-sage-100 transition-all"
            maxLength={1000}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-terra-500 text-white flex items-center justify-center hover:bg-terra-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
