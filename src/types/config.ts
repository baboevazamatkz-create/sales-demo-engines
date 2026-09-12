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

  /** 'dark' flips the whole app shell to a dark premium look. */
  mood?: 'light' | 'dark';
  /** App background; sensible defaults are derived from `mood`. */
  bg?: string;
  /** Cards, sheets, raised blocks. */
  surface?: string;
  /** Inputs, chips, secondary blocks. */
  surfaceMuted?: string;
  /** Main body text. */
  textPrimary?: string;
  /** Secondary text, captions. */
  textMuted?: string;
  /** Hairlines and card outlines. */
  border?: string;
}

export interface BusinessInfo {
  name: string;
  tagline?: string;
  logoUrl?: string;
  address?: string;
  currency: string;
  /** e.g. "25-35 мин" for cafe/delivery, or a shipping estimate for retail. */
  etaLabel?: string;
  /** Часы работы заведения: "09:00 – 23:00", "Круглосуточно". Показываются
   * на hero вместо срока готовности — у ресторана это разные вещи. */
  hoursLabel?: string;
  rating?: number;
  reviews?: number;
  /** Крупное фото для hero-экрана премиум-пресета. */
  heroImageUrl?: string;
}

export interface BaseClientConfig {
  /** Folder-safe id, must match the client's directory name under src/clients. */
  clientId: string;
  niche: Niche;
  business: BusinessInfo;
  theme: BrandTheme;
}
