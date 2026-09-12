import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';

/** Короткая заставка при запуске: логотип проявляется на фирменном фоне
 * с орнаментом. Даёт демо ощущение настоящего приложения, а не веб-страницы. */
export function SplashIntro({
  name,
  logoUrl,
  tagline,
  onDone,
  durationMs = 1900,
}: {
  name: string;
  logoUrl?: string;
  tagline?: string;
  onDone: () => void;
  durationMs?: number;
}) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setLeaving(true), durationMs - 400);
    const done = setTimeout(onDone, durationMs);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [durationMs, onDone]);

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand transition-opacity duration-400 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="ornament-turkish absolute inset-0 opacity-40" />

      <div className="relative flex flex-col items-center">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-pulse-ring" />
          {logoUrl ? (
            <img
              src={asset(logoUrl)}
              alt={name}
              className="relative w-24 h-24 rounded-full object-cover animate-scale-in ring-2 ring-accent/60"
            />
          ) : (
            <div className="relative w-24 h-24 rounded-full foil animate-scale-in" />
          )}
        </div>

        <h1
          className="font-display text-3xl tracking-wide text-brand-contrast mt-6 animate-fade-up"
          style={{ animationDelay: '160ms' }}
        >
          {name}
        </h1>
        {tagline && (
          <p
            className="text-brand-soft text-xs tracking-[0.28em] uppercase mt-3 animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}
