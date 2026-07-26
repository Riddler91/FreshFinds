/** In-memory message store, piggybacking on the existing global store */

export interface Message {
  id: number;
  vendorId: number;
  text: string;
  sender: "consumer" | "vendor";
  createdAt: string;
}

declare global {
  var __freshfinds_store: {
    vendors: any[];
    listings: any[];
    reviews: any[];
    messages: Message[];
    nextVendorId: number;
    nextListingId: number;
    nextReviewId: number;
    nextMessageId: number;
  } | undefined;
}

export function getStore() {
  if (!globalThis.__freshfinds_store) {
    globalThis.__freshfinds_store = {
      vendors: [],
      listings: [],
      reviews: [],
      messages: [],
      nextVendorId: 100,
      nextListingId: 200,
      nextReviewId: 300,
      nextMessageId: 1,
    };
  } else if (!globalThis.__freshfinds_store.messages) {
    globalThis.__freshfinds_store.messages = [];
    globalThis.__freshfinds_store.nextMessageId = 1;
  }
  return globalThis.__freshfinds_store;
}

/** Get messages for a vendor, sorted oldest-first */
export function getMessages(vendorId: number): Message[] {
  const store = getStore();
  return store.messages.filter((m) => m.vendorId === vendorId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/** Add a message from a consumer to a vendor */
export function sendMessage(vendorId: number, text: string): Message {
  const store = getStore();
  const message: Message = {
    id: store.nextMessageId++,
    vendorId,
    text: text.trim(),
    sender: "consumer",
    createdAt: new Date().toISOString(),
  };
  store.messages.push(message);
  return message;
}
