import type { BrandTheme } from '@/types/config';

const DEFAULT_THEME: BrandTheme = {
  primary: '#064e3b',
  primarySoft: '#d1fae5',
  primaryContrast: '#ecfdf5',
  accent: '#fbbf24',
  imageGradientFrom: '#d1fae5',
  imageGradientTo: '#fef3c7',
};

/** Writes a client's brand colors onto :root as CSS custom properties so
 * Tailwind's `brand` / `accent` / `img-from` / `img-to` utilities pick them
 * up without a rebuild — this is what lets a config swap look & feel. */
export function applyTheme(theme: Partial<BrandTheme> = {}) {
  const merged: BrandTheme = { ...DEFAULT_THEME, ...theme };
  const root = document.documentElement.style;
  root.setProperty('--color-primary', merged.primary);
  root.setProperty('--color-primary-soft', merged.primarySoft);
  root.setProperty('--color-primary-contrast', merged.primaryContrast ?? merged.primarySoft);
  root.setProperty('--color-accent', merged.accent);
  root.setProperty('--img-gradient-from', merged.imageGradientFrom);
  root.setProperty('--img-gradient-to', merged.imageGradientTo);
}
