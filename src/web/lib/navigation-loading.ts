"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;

let isNavigationLoading = false;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function setNavigationLoading(value: boolean) {
  if (isNavigationLoading === value) return;
  isNavigationLoading = value;
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return isNavigationLoading;
}

export function useNavigationLoading() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

