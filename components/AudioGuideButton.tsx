"use client";

import { useEffect } from "react";
import { currentSpeaking, speak, stopSpeaking, useSpeaking, useSpeechSupported } from "@/lib/speech";

interface Props {
  id: string;
  stop: number;
  text: string;
  lang: string;
  playLabel: string;
  stopLabel: string;
  className?: string;
}

/** Numbered headphone tag. Absolutely positioned by its parent so appearing after hydration never shifts layout. */
export function AudioGuideButton({ id, stop, text, lang, playLabel, stopLabel, className = "" }: Props) {
  const supported = useSpeechSupported();
  const speaking = useSpeaking() === id;

  useEffect(() => {
    return () => {
      // Leaving the page (or unmounting this label) ends its narration.
      if (currentSpeaking() === id) stopSpeaking();
    };
  }, [id]);

  if (!supported) return null;

  return (
    <button
      type="button"
      aria-pressed={speaking}
      aria-label={speaking ? stopLabel : playLabel}
      onClick={(e) => {
        e.stopPropagation();
        if (speaking) stopSpeaking();
        else speak(id, text, lang);
      }}
      className={`inline-flex h-7 items-center gap-1 rounded-full border border-ink/60 px-2 font-mono text-[11px] leading-none text-ink transition-colors hover:border-ink aria-pressed:border-red-dot aria-pressed:bg-red-dot aria-pressed:text-[var(--on-accent)] ${className}`}
    >
      {speaking ? (
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <rect x="2" y="2" width="8" height="8" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
          <rect x="3" y="14" width="5" height="7" rx="1.5" fill="currentColor" stroke="none" />
          <rect x="16" y="14" width="5" height="7" rx="1.5" fill="currentColor" stroke="none" />
        </svg>
      )}
      <span aria-hidden="true">{stop}</span>
    </button>
  );
}
