import type { ReactNode } from 'react';

/**
 * Wraps an engine in a phone-shaped card for browser demo links, so a link
 * sent to a client reads as "here's your app" rather than a bare webpage.
 * Skipped when the engine is actually running inside the installed
 * Capacitor app (see isStandalone in lib/platform.ts) — a phone frame
 * inside a real phone would look wrong.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-app flex justify-center py-6 px-3">
      <div
        className="w-full max-w-sm bg-surface rounded-[2rem] shadow-2xl overflow-hidden border border-line relative"
        style={{ minHeight: 700 }}
      >
        {children}
      </div>
    </div>
  );
}
