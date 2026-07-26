// Shared store type for in-memory data used across API routes

export interface FreshFindsStore {
  vendors: any[];
  listings: any[];
  reviews: any[];
  messages: any[];
  nextVendorId: number;
  nextListingId: number;
  nextReviewId: number;
  nextMessageId: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __freshfinds_store: FreshFindsStore | undefined;
}

export function getStore(): FreshFindsStore {
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
  }
  return globalThis.__freshfinds_store;
}
