"use client";

import { useSyncExternalStore } from "react";

let speaking: string | null = null;
const listeners = new Set<() => void>();

function set(id: string | null) {
  speaking = id;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function speak(id: string, text: string, lang: string) {
  if (!supported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const base = lang.toLowerCase().split("-")[0];
  const voice =
    synth.getVoices().find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ??
    synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(`${base}`));
  if (voice) utterance.voice = voice;
  const done = () => {
    if (speaking === id) set(null);
  };
  utterance.onend = done;
  utterance.onerror = done;
  set(id);
  synth.speak(utterance);
}

export function currentSpeaking(): string | null {
  return speaking;
}

export function stopSpeaking() {
  if (supported()) window.speechSynthesis.cancel();
  if (speaking !== null) set(null);
}

export function useSpeaking(): string | null {
  return useSyncExternalStore(subscribe, () => speaking, () => null);
}

const noop = () => () => {};
/** false on the server and during hydration, so markup always matches. */
export function useSpeechSupported(): boolean {
  return useSyncExternalStore(noop, supported, () => false);
}
