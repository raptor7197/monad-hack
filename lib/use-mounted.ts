"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};
/** false during SSR/hydration, true after — avoids wallet-state hydration mismatches. */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
