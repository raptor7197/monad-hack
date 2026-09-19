"use client";
import { useSyncExternalStore } from "react";

/** Blocked preflight attempts seen in this browser. Reverted txs keep no onchain events, so this is local only. */
export interface BlockedAttempt {
  proposalId: string;
  voter: string;
  reason: string;
  at: number;
}

const KEY = "flipguard.blocked";
let items: BlockedAttempt[] = [];
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    items = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    items = [];
  }
}

function emit() {
  subs.forEach((f) => f());
}

export function recordBlocked(a: BlockedAttempt) {
  load();
  items = [a, ...items].slice(0, 50);
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  emit();
}

export function clearBlocked() {
  items = [];
  try {
    localStorage.removeItem(KEY);
  } catch {}
  emit();
}

const EMPTY: BlockedAttempt[] = [];
export function useBlockedAttempts() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => (load(), items),
    () => EMPTY,
  );
}
