/**
 * Shared config building blocks. Every niche engine (cafe-restaurant, retail,
 * delivery) has its own config shape in src/engines/<niche>/types.ts, but
 * they all embed these common pieces so the client picker, theming and
 * README instructions stay uniform across niches.
 */

export type Niche = 'cafe-restaurant' | 'retail' | 'delivery';

export interface BrandTheme {
  /** Header background, primary buttons, active chip background. */
  primary: string;
  /** Header text tint / soft badge background over the primary color. */
  primarySoft: string;
  /** Text color that reads on top of `primary` (defaults to primarySoft). */
  primaryContrast?: string;
  /** Star ratings, success icon, small highlights. */
  accent: string;
  /** Placeholder image gradient (used when a product has no photo). */
  imageGradientFrom: string;
  imageGradientTo: string;
}

export interface BusinessInfo {
  name: string;
  tagline?: string;
  logoUrl?: string;
  address?: string;
  currency: string;
  /** e.g. "25-35 мин" for cafe/delivery, or a shipping estimate for retail. */
  etaLabel?: string;
  rating?: number;
  reviews?: number;
}

export interface BaseClientConfig {
  /** Folder-safe id, must match the client's directory name under src/clients. */
  clientId: string;
  niche: Niche;
  business: BusinessInfo;
  theme: BrandTheme;
}
