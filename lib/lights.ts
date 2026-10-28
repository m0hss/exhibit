"use client";

import { useSyncExternalStore } from "react";
import { LIGHTS_STORAGE_KEY } from "@/lib/constants";

export type Lights = "on" | "off";

const listeners = new Set<() => void>();

function read(): Lights {
  return document.documentElement.dataset.lights === "off" ? "off" : "on";
}

export function setLights(next: Lights) {
  document.documentElement.dataset.lights = next;
  try {
    localStorage.setItem(LIGHTS_STORAGE_KEY, next);
  } catch {
    /* storage unavailable: the switch still works for this visit */
  }
  listeners.forEach((l) => l());
}

export function toggleLights() {
  setLights(read() === "off" ? "on" : "off");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Server and first client render agree on "on"; the real value follows right after hydration. */
export function useLights(): Lights {
  return useSyncExternalStore(subscribe, read, () => "on");
}
