import type { BaseClientConfig } from '@/types/config';

export interface RetailVariantGroup {
  /** e.g. "Размер" / "Цвет" — shown as a label above the option chips. */
  label: string;
  options: string[];
}

export interface RetailProduct {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  images: string[];
  /** Optional variant groups, e.g. [{label:"Размер", options:["S","M","L"]}]. */
  variants?: RetailVariantGroup[];
  tags?: string[];
  inStock?: boolean;
}

export interface RetailFilter {
  id: string;
  label: string;
  /** Matches against RetailProduct.tags. */
  tag: string;
}

export interface RetailConfig extends BaseClientConfig {
  niche: 'retail';
  categories: string[];
  filters?: RetailFilter[];
  products: RetailProduct[];
  shippingMethods: { id: string; label: string; etaLabel?: string }[];
  paymentMethods?: string[];
}
