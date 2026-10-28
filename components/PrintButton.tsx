"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-wall"
    >
      {label}
    </button>
  );
}
