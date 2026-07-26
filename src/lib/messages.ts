/** In-memory message store, piggybacking on the existing global store */

import { getStore } from "@/lib/store";

export interface Message {
  id: number;
  vendorId: number;
  text: string;
  sender: "consumer" | "vendor";
  createdAt: string;
}

/** Get messages for a vendor, sorted oldest-first */
export function getMessages(vendorId: number): Message[] {
  const store = getStore();
  return store.messages.filter((m: Message) => m.vendorId === vendorId).sort(
    (a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
